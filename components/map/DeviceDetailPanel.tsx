'use client'

import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'
import { MapPin, Clock, BatteryMedium, Crosshair, View, X } from 'lucide-react'

interface DeviceDetailPanelProps {
  device: Device | null
  onClose: () => void
  onNavigate?: (deviceId: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  online: 'text-success bg-success/10',
  offline: 'text-destructive bg-destructive/10',
  maintenance: 'text-warning bg-warning/10',
}

function getBatteryColor(level: number) {
  if (level > 60) return 'bg-success'
  if (level > 30) return 'bg-warning'
  return 'bg-destructive'
}

export default function DeviceDetailPanel({ device, onClose, onNavigate }: DeviceDetailPanelProps) {
  if (!device) return null

  const typeInfo = (DEVICE_TYPES as Record<string, any>)[device.type ?? '']
  const statusInfo = (DEVICE_STATUS as Record<string, any>)[device.status]
  const statusStyle = STATUS_STYLES[device.status] ?? 'text-muted-foreground bg-muted'
  const lastActive = new Date(device.last_active_at ?? '')
  const lastActiveStr = lastActive.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] glass rounded-t-2xl shadow-lg p-6 pb-8 transition-all ring-1 ring-border">
      {/* Drag handle */}
      <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Device header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          {typeInfo?.Icon ? (
            <typeInfo.Icon className="w-6 h-6 text-foreground" />
          ) : (
            <MapPin className="w-6 h-6 text-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg leading-tight">{device.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{typeInfo?.label}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusStyle}`}>
          {statusInfo?.label}
        </span>
      </div>

      {/* Detail info */}
      <div className="space-y-3 bg-muted/50 rounded-xl p-4 mb-4">
        {device.address && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-16 shrink-0">位置</span>
            <span className="text-foreground">{device.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground w-16 shrink-0">最近活跃</span>
          <span className="text-foreground">{lastActiveStr}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground w-16 shrink-0">电量</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBatteryColor(device.battery_level ?? 0)}`}
                style={{ width: `${device.battery_level}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs w-8">{device.battery_level}%</span>
          </div>
        </div>
        {device.latitude != null && device.longitude != null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-16 shrink-0">坐标</span>
            <span className="text-muted-foreground text-xs font-mono">
              {device.latitude.toFixed(5)}, {device.longitude.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {/* AR entry (only for ar_point type) */}
      {device.type === 'ar_point' && device.status === 'online' && (
        <button
          onClick={() => onNavigate?.(device.id)}
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <View className="w-4 h-4" />
          进入 AR 探境
        </button>
      )}
    </div>
  )
}
