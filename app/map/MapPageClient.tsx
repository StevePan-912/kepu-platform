'use client'

import dynamic from 'next/dynamic'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES } from '@/lib/constants/categories'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'

// 动态加载地图容器（纯客户端）
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">地图加载中…</p>
      </div>
    </div>
  ),
})

interface MapPageClientProps {
  devices: Device[]
}

export function MapPageClient({ devices }: MapPageClientProps) {
  const { currentDeviceId } = useAppStore()

  const onlineCount = devices.filter((d) => d.status === 'online').length
  const typeStats = Object.entries(DEVICE_TYPES).map(([key, info]) => ({
    key,
    label: info.label,
    count: devices.filter((d) => d.type === key).length,
  }))

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-xl leading-none">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900 text-base leading-tight">资源地图</h1>
          <p className="text-xs text-gray-400">周边科普设施实时分布</p>
        </div>
        {/* 在线统计 */}
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-700">{onlineCount} 在线</span>
        </div>
      </header>

      {/* 设备类型快捷统计条 */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-4 overflow-x-auto shrink-0">
        {typeStats.map(({ key, label, count }) => (
          <div key={key} className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-semibold text-gray-800 bg-gray-100 rounded-full px-1.5 py-0.5">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* 地图主体 */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer devices={devices} />
      </div>

      {/* 底部提示 */}
      <div className="bg-white border-t border-gray-100 px-4 py-2 text-center shrink-0">
        <p className="text-xs text-gray-400">点击地图标记查看设备详情 · 支持拖拽和缩放</p>
      </div>
    </div>
  )
}
