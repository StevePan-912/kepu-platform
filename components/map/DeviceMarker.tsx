'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { MapPin, BatteryMedium } from 'lucide-react'

// Device status marker colors (oklch-based, works across light/dark)
const STATUS_COLORS: Record<string, string> = {
  online: '#3b9b7f',
  offline: '#c94a4a',
  maintenance: '#c49a3c',
}

// Inline SVG paths for device type icons (extracted from lucide)
const TYPE_SVG_PATHS: Record<string, string> = {
  audio_station: 'M3 18v-6a9 9 0 0 1 18 0v6', // Headphones simplified
  screen: 'M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4H2z M6 18h12', // Monitor simplified
  ar_point: 'M5 8a7 7 0 0 1 14 0v4H5z M12 2v2 M7 18v2 M17 18v2', // Smartphone simplified
  star_corner: 'M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.4 5.7 21l2.3-7L2 9.4h7.6z', // Star
}

function createDeviceIcon(type: Device['type'], status: Device['status']): L.DivIcon {
  const color = STATUS_COLORS[status] ?? '#6b7280'
  const svgPath = TYPE_SVG_PATHS[type ?? ''] ?? ''
  const hasSvg = svgPath.length > 0

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 36px; height: 36px;
        border-radius: 50% 50% 50% 4px;
        transform: rotate(-45deg);
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        display: flex; align-items: center; justify-content: center;
      ">
        ${hasSvg ? `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
            <path d="${svgPath}"/>
          </svg>
        ` : `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
            <circle cx="12" cy="12" r="4"/>
          </svg>
        `}
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  })
}

interface DeviceMarkerProps {
  device: Device
}

export default function DeviceMarker({ device }: DeviceMarkerProps) {
  const router = useRouter()
  const setCurrentDeviceId = useAppStore((s) => s.setCurrentDeviceId)

  if (device.latitude == null || device.longitude == null) return null

  const typeInfo = (DEVICE_TYPES as Record<string, any>)[device.type ?? '']
  const statusInfo = (DEVICE_STATUS as Record<string, any>)[device.status]
  const icon = createDeviceIcon(device.type, device.status)

  function handleViewDetail() {
    setCurrentDeviceId(device.id)
    router.push(`/map?device=${device.id}`)
  }

  return (
    <Marker position={[device.latitude, device.longitude]} icon={icon}>
      <Popup minWidth={200} maxWidth={260}>
        <div className="p-1">
          <div className="flex items-center gap-2 mb-2">
            {typeInfo?.Icon && (
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <typeInfo.Icon className="w-4 h-4 text-foreground" />
              </div>
            )}
            <div>
              <p className="font-semibold text-sm text-foreground">{device.name}</p>
              <p className="text-xs text-muted-foreground">{typeInfo?.label}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            {device.address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span>{device.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: STATUS_COLORS[device.status] }}
              />
              <span>{statusInfo?.label}</span>
              <span className="ml-auto flex items-center gap-0.5 text-muted-foreground">
                <BatteryMedium className="w-3 h-3" />
                {device.battery_level}%
              </span>
            </div>
          </div>

          <button
            onClick={handleViewDetail}
            className="mt-3 w-full text-center text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-1.5 transition-colors"
          >
            查看详情
          </button>
        </div>
      </Popup>
    </Marker>
  )
}
