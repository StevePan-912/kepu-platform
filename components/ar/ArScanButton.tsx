'use client'

interface ArScanButtonProps {
  onClick: () => void
  deviceCount?: number
}

export default function ArScanButton({ onClick, deviceCount = 0 }: ArScanButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:shadow-purple-200 transition-all duration-200 active:scale-98"
      >
        {/* 左侧图标 */}
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl shrink-0">
          📱
        </div>

        {/* 文字区域 */}
        <div className="flex-1 text-left">
          <p className="font-bold text-base leading-tight">开启 AR 探境</p>
          <p className="text-xs text-white/80 mt-0.5">扫描周边探索隐藏科普彩蛋</p>
          {deviceCount > 0 && (
            <p className="text-xs text-white/70 mt-1">
              周边 <span className="font-semibold text-white">{deviceCount}</span> 个AR探境点可用
            </p>
          )}
        </div>

        {/* 动态扫描圈 */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="absolute inset-0 border-2 border-white/60 rounded-full animate-ping" />
          <div className="absolute inset-1 border-2 border-white rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center text-sm">✦</div>
        </div>
      </button>

      {/* 提示标签 */}
      <div className="absolute -top-2 -right-2">
        <span className="bg-orange-400 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow">
          Beta
        </span>
      </div>
    </div>
  )
}
