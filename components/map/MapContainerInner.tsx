'use client'

import { useState, useEffect } from 'react'
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Device } from '@/lib/supabase/types'
import { DeviceMarker, MapFilter, DeviceDetailPanel } from './index'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

// 默认中心坐标（北京展览路街道）
const DEFAULT_CENTER: [number, number] = [39.934, 116.341]
const DEFAULT_ZOOM = 15

interface Props {
  devices: Device[]
}

// 点击标记后自动飞到对应位置的子组件
function FlyToDevice({ device }: { device: Device | null }) {
  const map = useMap()
  useEffect(() => {
    if (device?.latitude != null && device?.longitude != null) {
      map.flyTo([device.latitude, device.longitude], 18, { duration: 0.8 })
    }
  }, [device, map])
  return null
}

export default function MapContainerInner({ devices }: Props) {
  const [filteredDevices, setFilteredDevices] = useState<Device[]>(devices)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const { currentDeviceId, setCurrentDeviceId } = useAppStore()
  const router = useRouter()

  // 从 URL query 恢复选中状态
  useEffect(() => {
    if (currentDeviceId) {
      const device = devices.find((d) => d.id === currentDeviceId)
      if (device) setSelectedDevice(device)
    }
  }, [currentDeviceId, devices])

  // 过滤变更后，如果选中设备被过滤掉则关闭面板
  useEffect(() => {
    if (selectedDevice && !filteredDevices.find((d) => d.id === selectedDevice.id)) {
      setSelectedDevice(null)
    }
  }, [filteredDevices, selectedDevice])

  function handleFilterChange(filtered: Device[]) {
    setFilteredDevices(filtered)
  }

  function handleClosePanel() {
    setSelectedDevice(null)
    setCurrentDeviceId(null)
  }

  function handleARNavigate(deviceId: string) {
    router.push(`/ar?device=${deviceId}`)
  }

  return (
    <div className="relative w-full h-full">
      <LeafletMap
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
          subdomains={['1', '2', '3', '4']}
        />

        {/* 飞到选中设备 */}
        <FlyToDevice device={selectedDevice} />

        {/* 设备标记 */}
        {filteredDevices.map((device) => (
          <DeviceMarker key={device.id} device={device} />
        ))}
      </LeafletMap>

      {/* 筛选控件 */}
      <MapFilter devices={devices} onFilterChange={handleFilterChange} />

      {/* 设备详情面板 */}
      {selectedDevice && (
        <DeviceDetailPanel
          device={selectedDevice}
          onClose={handleClosePanel}
          onNavigate={handleARNavigate}
        />
      )}
    </div>
  )
}
