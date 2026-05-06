'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'

// 设备状态对应的标记颜色
const STATUS_COLORS: Record<string, string> = {
  online: '#22c55e',
  offline: '#ef4444',
  maintenance: '#eab308',
}

// 设备类型对应的 emoji
const TYPE_EMOJI: Record<string, string> = {
  audio_station: '🔊',
  screen: '📺',
  ar_point: '🔮',
  star_corner: '⭐',
}

function createDeviceIcon(type: Device['type'], status: Device['status']): L.DivIcon {
  const color = STATUS_COLORS[status] ?? '#6b7280'
  const emoji = TYPE_EMOJI[type] ?? '📍'
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 40px; height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 18px; line-height: 1;">${emoji}</span>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  })
}

interface DeviceMarkerProps {
  device: Device
}

export default function DeviceMarker({ device }: DeviceMarkerProps) {
  const router = useRouter()
  const setCurrentDeviceId = useAppStore((s) => s.setCurrentDeviceId)

  if (device.lat == null || device.lng == null) return null

  const typeInfo = DEVICE_TYPES[device.type]
  const statusInfo = DEVICE_STATUS[device.status]
  const icon = createDeviceIcon(device.type, device.status)

  function handleViewDetail() {
    setCurrentDeviceId(device.id)
    router.push(`/map?device=${device.id}`)
  }

  return (
    <Marker position={[device.lat, device.lng]} icon={icon}>
      <Popup minWidth={200} maxWidth={260}>
        <div className="p-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{TYPE_EMOJI[device.type]}</span>
            <div>
              <p className="font-semibold text-sm text-gray-900">{device.name}</p>
              <p className="text-xs text-gray-500">{typeInfo?.label}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            {device.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{device.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: STATUS_COLORS[device.status] }}
              />
              <span>{statusInfo?.label}</span>
              <span className="ml-auto text-gray-400">🔋 {device.battery_level}%</span>
            </div>
          </div>

          <button
            onClick={handleViewDetail}
            className="mt-3 w-full text-center text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg py-1.5 transition-colors"
          >
            查看详情
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
