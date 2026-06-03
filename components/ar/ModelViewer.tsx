'use client'

import { useEffect, useRef, createElement } from 'react'

interface ModelViewerProps {
  src: string
  alt: string
  poster?: string
  className?: string
  autoRotate?: boolean
  cameraControls?: boolean
  cameraOrbit?: string
  environmentImage?: string
}

export default function ModelViewer({
  src,
  alt,
  poster,
  className = '',
  autoRotate = true,
  cameraControls = true,
  cameraOrbit = '30deg 60deg 2.5',
  environmentImage = 'neutral',
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
    'shadow-intensity': '0.5',
    'shadow-softness': '0.8',
    exposure: '1.2',
    'camera-orbit': cameraOrbit,
    'environment-image': environmentImage,
    'interaction-prompt': 'auto',
    loading: 'eager',
    className,
    style: { width: '100%', height: '100%', backgroundColor: '#1a1a2e' },
  })
}
