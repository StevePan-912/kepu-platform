'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Device } from '@/lib/supabase/types'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

// Leaflet 必须纯客户端加载，防止 SSR 报错
const MapContainerInner = dynamic(() => import('./MapContainerInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">地图加载中…</p>
      </div>
    </div>
  ),
})

interface MapContainerProps {
  devices: Device[]
}

export default function MapContainer({ devices }: MapContainerProps) {
  return <MapContainerInner devices={devices} />
}
