'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { MapPin, BatteryMedium } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

  // Map pin shape: circle top + pointed bottom, no rotation needed
  return L.divIcon({
    className: '',
    html: `
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26s16-16 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="9" fill="white" fill-opacity="0.25"/>
        ${
          hasSvg
            ? `
          <g transform="translate(16,16)">
            <g transform="scale(0.5)">
              <path d="${svgPath}" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(-12,-12)"/>
            </g>
          </g>
        `
            : `
          <circle cx="16" cy="16" r="4" fill="white"/>
        `
        }
      </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  })
}

interface DeviceMarkerProps {
  device: Device
}

export default function DeviceMarker({ device }: DeviceMarkerProps) {
  const router = useRouter()
  const setCurrentDeviceId = useAppStore((s) => s.setCurrentDeviceId)

  if (device.latitude == null || device.longitude == null) return null

  const typeInfo = (DEVICE_TYPES as Record<string, { label: string; Icon: LucideIcon }>)[
    device.type ?? ''
  ]
  const statusInfo = (DEVICE_STATUS as Record<string, { label: string; color: string }>)[
    device.status
  ]
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
