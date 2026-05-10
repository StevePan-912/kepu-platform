'use client'

import dynamic from 'next/dynamic'

// Leaflet 必须动态加载（禁止 SSR），否则 window is not defined
const DeviceMapInner = dynamic(() => import('./DeviceMapInner'), { ssr: false })

export function DeviceMap() {
  return <DeviceMapInner />
}
