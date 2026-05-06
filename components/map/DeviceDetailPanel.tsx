'use client'

import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES, DEVICE_STATUS } from '@/lib/constants/categories'

interface DeviceDetailPanelProps {
  device: Device | null
  onClose: () => void
  onNavigate?: (deviceId: string) => void
}

const TYPE_EMOJI: Record<string, string> = {
  audio_station: '🔊',
  screen: '📺',
  ar_point: '🔮',
  star_corner: '⭐',
}

const STATUS_COLORS: Record<string, string> = {
  online: 'text-green-600 bg-green-50',
  offline: 'text-red-600 bg-red-50',
  maintenance: 'text-yellow-600 bg-yellow-50',
}

function getBatteryColor(level: number) {
  if (level > 60) return 'bg-green-500'
  if (level > 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function DeviceDetailPanel({ device, onClose, onNavigate }: DeviceDetailPanelProps) {
  if (!device) return null

  const typeInfo = DEVICE_TYPES[device.type]
  const statusInfo = DEVICE_STATUS[device.status]
  const statusStyle = STATUS_COLORS[device.status] ?? 'text-gray-600 bg-gray-50'
  const lastActive = new Date(device.last_active)
  const lastActiveStr = lastActive.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl p-5 pb-8 transition-all">
      {/* 顶部拖拽条 */}
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
      >
        ✕
      </button>

      {/* 设备信息头 */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
          {TYPE_EMOJI[device.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{device.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{typeInfo?.label}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle}`}>
          {statusInfo?.label}
        </span>
      </div>

      {/* 详细信息 */}
      <div className="space-y-3 bg-gray-50 rounded-2xl p-4 mb-4">
        {device.location && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 w-16 shrink-0">位置</span>
            <span className="text-gray-700">{device.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 w-16 shrink-0">最近活跃</span>
          <span className="text-gray-700">{lastActiveStr}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 w-16 shrink-0">电量</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBatteryColor(device.battery_level)}`}
                style={{ width: `${device.battery_level}%` }}
              />
            </div>
            <span className="text-gray-700 text-xs w-8">{device.battery_level}%</span>
          </div>
        </div>
        {device.lat != null && device.lng != null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 w-16 shrink-0">坐标</span>
            <span className="text-gray-700 text-xs font-mono">
              {device.lat.toFixed(5)}, {device.lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {/* AR探境入口（仅 ar_point 类型显示） */}
      {device.type === 'ar_point' && device.status === 'online' && (
        <button
          onClick={() => onNavigate?.(device.id)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm shadow-lg active:scale-95 transition-transform"
        >
          🔮 进入 AR 探境
        </button>
      )}
    </div>
  )
}
