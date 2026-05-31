'use client'

import { usePoints } from '@/lib/hooks/usePoints'
import { useUser } from '@/lib/hooks/useUser'
import { Coins, TrendingUp, ShoppingBag } from 'lucide-react'

interface PointsBannerProps {
  onLoginDemo?: () => void
}

export default function PointsBanner({ onLoginDemo }: PointsBannerProps) {
  const { user, loginDemo } = useUser()
  const { totalPoints, totalEarned, totalSpent } = usePoints()

  const handleLogin = () => {
    loginDemo()
    onLoginDemo?.()
  }

  const honorLabels = {
    explorer: { label: '探索者', color: 'text-green-400', bg: 'bg-green-400/20' },
    communicator: { label: '传播者', color: 'text-blue-400', bg: 'bg-blue-400/20' },
    leader: { label: '领航者', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  }

  const honor = user?.honor_level ? (honorLabels as Record<string, { label: string; color: string; bg: string }>)[user.honor_level] : null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-5 text-white shadow-lg">
      {/* 背景装饰 */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />

      {user ? (
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">你好，{user.nickname || '居民'}</span>
                {honor && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${honor.bg} ${honor.color}`}>
                    {honor.label}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-4xl font-bold">{totalPoints.toLocaleString()}</span>
                <span className="mb-1 text-sm text-white/70">积分</span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Coins className="h-8 w-8 text-yellow-300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <TrendingUp className="h-3.5 w-3.5" />
                累计获得
              </div>
              <div className="mt-1 text-lg font-semibold">{totalEarned.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <div className="flex items-center gap-1.5 text-xs text-white/70">
                <ShoppingBag className="h-3.5 w-3.5" />
                已兑换
              </div>
              <div className="mt-1 text-lg font-semibold">{totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">登录后查看积分余额</p>
            <p className="mt-1 text-xs text-white/60">参与科普活动赚取积分，兑换精美奖品</p>
          </div>
          <button
            onClick={handleLogin}
            className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
          >
            体验登录
          </button>
        </div>
      )}
    </div>
  )
}
