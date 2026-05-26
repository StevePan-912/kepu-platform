'use client'

import type { Product } from '@/lib/supabase/types'
import { ShoppingCart, Package, Zap } from 'lucide-react'

interface ProductCardProps {
  product: Product
  userPoints: number
  onExchange: (product: Product) => void
}

// 商品分类图标/颜色映射
const categoryStyle: Record<string, { icon: string; gradient: string; badge: string }> = {
  book: { icon: '📚', gradient: 'from-blue-50 to-indigo-100', badge: 'bg-blue-100 text-blue-700' },
  stationery: { icon: '✏️', gradient: 'from-yellow-50 to-amber-100', badge: 'bg-amber-100 text-amber-700' },
  toy: { icon: '🧸', gradient: 'from-pink-50 to-rose-100', badge: 'bg-pink-100 text-pink-700' },
  coupon: { icon: '🎟️', gradient: 'from-purple-50 to-violet-100', badge: 'bg-purple-100 text-purple-700' },
  badge: { icon: '🏅', gradient: 'from-orange-50 to-amber-100', badge: 'bg-orange-100 text-orange-700' },
  default: { icon: '🎁', gradient: 'from-emerald-50 to-teal-100', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function ProductCard({ product, userPoints, onExchange }: ProductCardProps) {
  // queries.ts 中用 points_required，但 types.ts 中是 points_cost，兼容两者
  const cost = (product as Record<string, unknown>).points_required as number ?? product.points_cost
  const canExchange = userPoints >= cost && product.stock > 0
  const category = (product as Record<string, unknown>).category as string ?? 'default'
  const imageUrl = (product as Record<string, unknown>).image_url as string | undefined
  const style = categoryStyle[category] ?? categoryStyle.default

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} border border-white/60 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
      {/* 库存紧张标签 */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
          <Zap className="h-3 w-3" />
          仅剩{product.stock}件
        </div>
      )}
      {product.stock === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/30">
          <span className="rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white">已售罄</span>
        </div>
      )}

      {/* 图片区 */}
      <div className="flex h-32 items-center justify-center p-4">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="h-full w-full object-contain" />
        ) : (
          <span className="text-5xl">{style.icon}</span>
        )}
      </div>

      {/* 信息区 */}
      <div className="border-t border-white/40 bg-white/60 p-3 backdrop-blur-sm">
        <div className="mb-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
            {category === 'default' ? '礼品' : category}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-semibold text-gray-800">{product.name}</h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-emerald-600">{cost.toLocaleString()}</span>
            <span className="text-xs text-gray-500">积分</span>
          </div>
          <button
            onClick={() => onExchange(product)}
            disabled={!canExchange}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              canExchange
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                : userPoints < cost
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock === 0 ? '售罄' : userPoints < cost ? '积分不足' : '立即兑换'}
          </button>
        </div>

        {/* 积分差距提示 */}
        {userPoints > 0 && userPoints < cost && product.stock > 0 && (
          <p className="mt-1.5 text-right text-xs text-gray-400">
            还差 {(cost - userPoints).toLocaleString()} 积分
          </p>
        )}
      </div>
    </div>
  )
}
