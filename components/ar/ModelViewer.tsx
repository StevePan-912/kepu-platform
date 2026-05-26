'use client'

import { useEffect, useRef, createElement } from 'react'

interface ModelViewerProps {
  src: string
  alt: string
  poster?: string
  className?: string
  autoRotate?: boolean
  cameraControls?: boolean
}

export default function ModelViewer({
  src,
  alt,
  poster,
  className = '',
  autoRotate = true,
  cameraControls = true,
}: ModelViewerProps) {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // 动态加载 model-viewer 库
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js'
    document.head.appendChild(script)
  }, [])

  // 用 createElement 避免 React 19 JSX 自定义元素类型问题
  return createElement('model-viewer', {
    src,
    alt,
    poster,
    'auto-rotate': autoRotate ? '' : undefined,
    'camera-controls': cameraControls ? '' : undefined,
    'shadow-intensity': '1',
    exposure: '1',
    className,
    style: { width: '100%', height: '100%' },
  })
}
