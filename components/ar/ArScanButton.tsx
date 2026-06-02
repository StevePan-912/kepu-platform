'use client'

import { Smartphone, Scan } from 'lucide-react'

interface ArScanButtonProps {
  onClick: () => void
  deviceCount?: number
}

export default function ArScanButton({ onClick, deviceCount = 0 }: ArScanButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="w-full bg-primary text-primary-foreground rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-primary-foreground/15 rounded-xl flex items-center justify-center shrink-0">
          <Smartphone className="h-7 w-7" />
        </div>

        {/* Text */}
        <div className="flex-1 text-left">
          <p className="font-semibold text-base leading-tight">开启 AR 探境</p>
          <p className="text-xs opacity-70 mt-0.5">扫描周边探索隐藏科普彩蛋</p>
          {deviceCount > 0 && (
            <p className="text-xs opacity-60 mt-1">
              周边 <span className="font-semibold">{deviceCount}</span> 个AR探境点可用
            </p>
          )}
        </div>

        {/* Scan indicator */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 border-2 border-primary-foreground/40 rounded-full animate-ping" />
          <div className="absolute inset-1 border-2 border-primary-foreground/80 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Scan className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Beta label */}
      <div className="absolute -top-2 -right-2">
        <span className="bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
          Beta
        </span>
      </div>
    </div>
  )
}
