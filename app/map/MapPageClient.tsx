'use client'

import dynamic from 'next/dynamic'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES } from '@/lib/constants/categories'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { ArrowLeft, Wifi } from 'lucide-react'

// Dynamic map container (client-only)
const MapContainer = dynamic(() => import('@/components/map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">地图加载中…</p>
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
    Icon: info.Icon,
    count: devices.filter((d) => d.type === key).length,
  }))

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground text-base leading-tight">资源地图</h1>
          <p className="text-xs text-muted-foreground">周边科普设施实时分布</p>
        </div>
        {/* Online indicator */}
        <div className="flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full">
          <Wifi className="w-3 h-3 text-success" />
          <span className="text-xs font-medium text-success">{onlineCount} 在线</span>
        </div>
      </header>

      {/* Device type stats strip */}
      <div className="glass border-b border-border px-4 py-2 flex gap-4 overflow-x-auto shrink-0">
        {typeStats.map(({ key, label, Icon, count }) => (
          <div key={key} className="flex items-center gap-1.5 shrink-0">
            {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-medium text-foreground bg-muted rounded-full px-1.5 py-0.5">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Map body */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer devices={devices} />
      </div>

      {/* Bottom hint */}
      <div className="bg-background/80 border-t border-border px-4 py-2 text-center shrink-0">
        <p className="text-xs text-muted-foreground">点击地图标记查看设备详情</p>
      </div>
    </div>
  )
}
