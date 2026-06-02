'use client'

import type { Product } from '@/lib/supabase/types'
import { ShoppingCart, Package, Zap, BookOpen, Pencil, ToyBrick, Ticket, Award, Gift } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ProductCardProps {
  product: Product
  userPoints: number
  onExchange: (product: Product) => void
}

// 商品分类图标/颜色映射
const categoryStyle: Record<string, { icon: LucideIcon; badge: string }> = {
  book: { icon: BookOpen, badge: 'bg-accent text-primary' },
  stationery: { icon: Pencil, badge: 'bg-accent text-primary' },
  toy: { icon: ToyBrick, badge: 'bg-accent text-primary' },
  coupon: { icon: Ticket, badge: 'bg-accent text-primary' },
  badge: { icon: Award, badge: 'bg-accent text-primary' },
  default: { icon: Gift, badge: 'bg-accent text-primary' },
}

export default function ProductCard({ product, userPoints, onExchange }: ProductCardProps) {
  const cost = product.points_required
  const canExchange = userPoints >= cost && product.stock > 0
  const category = (product as Record<string, unknown>).category as string ?? 'default'
  const imageUrl = (product as Record<string, unknown>).image_url as string | undefined
  const style = categoryStyle[category] ?? categoryStyle.default
  const IconComponent = style.icon

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-background border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
      {/* 库存紧张标签 */}
      {product.stock > 0 && product.stock <= 5 && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-xs text-white">
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
          <IconComponent className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      {/* 信息区 */}
      <div className="border-t border-border bg-muted/30 p-3 backdrop-blur-sm">
        <div className="mb-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
            {category === 'default' ? '礼品' : category}
          </span>
        </div>
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</h3>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">{cost.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">积分</span>
          </div>
          <button
            onClick={() => onExchange(product)}
            disabled={!canExchange}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
              canExchange
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                : 'cursor-not-allowed bg-muted text-muted-foreground'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock === 0 ? '售罄' : userPoints < cost ? '积分不足' : '立即兑换'}
          </button>
        </div>

        {/* 积分差距提示 */}
        {userPoints > 0 && userPoints < cost && product.stock > 0 && (
          <p className="mt-1.5 text-right text-xs text-muted-foreground">
            还差 {(cost - userPoints).toLocaleString()} 积分
          </p>
        )}
      </div>
    </div>
  )
}
