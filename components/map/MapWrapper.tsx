'use client'

import dynamic from 'next/dynamic'
import type { Device } from '@/lib/supabase/types'

const MapInner = dynamic(() => import('./MapContainer'), {
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

interface MapWrapperProps {
  devices: Device[]
}

export function MapWrapper({ devices }: MapWrapperProps) {
  return <MapInner devices={devices} />
}
