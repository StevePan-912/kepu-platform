'use client'

import { useState } from 'react'
import type { Product } from '@/lib/supabase/types'
import { useUser } from '@/lib/hooks/useUser'
import { usePoints } from '@/lib/hooks/usePoints'
import { PointsBanner, ProductGrid, ExchangeModal, ExchangeHistory } from '@/components/mall'
import { ShoppingBag, History, Coins } from 'lucide-react'

type Tab = 'shop' | 'history'

export default function MallPageClient() {
  const { user } = useUser()
  const { totalPoints, refetch: refetchPoints } = usePoints()
  const [activeTab, setActiveTab] = useState<Tab>('shop')
  const [exchangingProduct, setExchangingProduct] = useState<Product | null>(null)
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0)

  const handleExchangeSuccess = () => {
    refetchPoints()
    setHistoryRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-30 glass border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">积分商城</h1>
          {user && (
            <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-medium text-primary">
              <Coins className="h-4 w-4" />
              <span>{totalPoints.toLocaleString()} 积分</span>
            </div>
          )}
        </div>

        {/* Tab 切换 */}
        <div className="flex border-t border-border">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'shop'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            商品兑换
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              activeTab === 'history'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <History className="h-4 w-4" />
            兑换记录
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* 积分展示 Banner */}
        <div className="mb-4">
          <PointsBanner />
        </div>

        {/* 积分获取入口 */}
        {!user && (
          <div className="mb-4 rounded-xl border border-border bg-accent p-3">
            <p className="text-sm font-medium text-foreground">如何获取积分？</p>
            <div className="mt-2 space-y-1.5">
              {[
                { action: '播放科普音频', points: '+10' },
                { action: 'AR扫码互动', points: '+20' },
                { action: '搜索科普内容', points: '+5' },
                { action: '提交反馈意见', points: '+15' },
              ].map(item => (
                <div key={item.action} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.action}</span>
                  <span className="font-semibold text-primary">{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 商品兑换 Tab */}
        {activeTab === 'shop' && (
          <ProductGrid
            userPoints={totalPoints}
            onExchange={setExchangingProduct}
          />
        )}

        {/* 兑换记录 Tab */}
        {activeTab === 'history' && (
          <ExchangeHistory
            userId={user?.id ?? null}
            refreshKey={historyRefreshKey}
          />
        )}
      </div>

      {/* 兑换确认弹窗 */}
      {exchangingProduct && (
        <ExchangeModal
          product={exchangingProduct}
          userPoints={totalPoints}
          userId={user?.id ?? null}
          onClose={() => setExchangingProduct(null)}
          onSuccess={handleExchangeSuccess}
        />
      )}
    </div>
  )
}
