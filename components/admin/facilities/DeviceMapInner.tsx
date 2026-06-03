'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react'
import { getDevices } from '@/lib/supabase/admin/queries'

// Fix Leaflet default marker icon path for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Semantic status colors for map markers
const STATUS_MARKER_COLORS: Record<string, string> = {
  online: '#3b9b7f',
  offline: '#c94a4a',
  maintenance: '#c49a3c',
}

function createColorIcon(status: string) {
  const color = STATUS_MARKER_COLORS[status] ?? '#6b7280'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  })
}

const statusLabels: Record<string, string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
}

const deviceTypeLabels: Record<string, string> = {
  audio_station: '语音导览点',
  screen: '资讯屏',
  ar_point: 'AR互动点',
  star_corner: '星空角',
}

// Auto-fit map bounds to all device coordinates
function FitBounds({ devices }: { devices: any[] }) {
  const map = useMap()
  useEffect(() => {
    const validDevices = devices.filter((d) => d.latitude && d.longitude)
    if (validDevices.length > 0) {
      const bounds = L.latLngBounds(validDevices.map((d) => [d.latitude, d.longitude]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [devices, map])
  return null
}

export default function DeviceMapInner() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDevices = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getDevices({ page: 1, pageSize: 200 })
    if (fetchError) {
      setError(fetchError)
    } else if (data) {
      setDevices(data.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const mappableDevices = devices.filter((d) => d.latitude && d.longitude)

  const defaultCenter: [number, number] = [39.9355, 116.3385]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>设备分布地图</CardTitle>
            <CardDescription>
              {loading
                ? '加载中…'
                : `共 ${mappableDevices.length} 台设备已定位，点击标记查看详情`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />在线
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />离线
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />维护中
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchDevices}
              disabled={loading}
              title="刷新"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>地图数据加载失败：{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-destructive"
              onClick={fetchDevices}
            >
              重试
            </Button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center animate-pulse">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">地图加载中…</p>
            </div>
          </div>
        )}

        {/* Map body */}
        {!loading && (
          <div className="h-[500px] rounded-lg overflow-hidden ring-1 ring-border">
            <style>{`
              .leaflet-container { height: 100%; width: 100%; }
            `}</style>
            <MapContainer
              center={defaultCenter}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
                url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
                subdomains={['1', '2', '3', '4']}
              />
              {mappableDevices.length > 0 && <FitBounds devices={mappableDevices} />}
              {mappableDevices.map((device) => (
                <Marker
                  key={device.id}
                  position={[device.latitude, device.longitude]}
                  icon={createColorIcon(device.status)}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <div className="font-semibold text-foreground mb-1">{device.name}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {deviceTypeLabels[device.type] ?? device.type}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        {device.address ?? '未知位置'}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            device.status === 'online'
                              ? 'bg-success/10 text-success'
                              : device.status === 'offline'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {statusLabels[device.status] ?? device.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          电量 {device.battery_level ?? '—'}%
                        </span>
                      </div>
                      <div className="mt-2">
                        <a
                          href={`/admin/facilities/${device.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          查看详情
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* No data */}
        {!loading && !error && mappableDevices.length === 0 && (
          <div className="mt-3 text-center text-sm text-muted-foreground">
            <MapPin className="w-5 h-5 mx-auto mb-1 opacity-40" />
            <p>当前设备均未配置经纬度坐标</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
