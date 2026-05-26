'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/lib/supabase/types'
import { getProducts } from '@/lib/supabase/queries'
import ProductCard from './ProductCard'
import { Package, Search, Loader2 } from 'lucide-react'

interface ProductGridProps {
  userPoints: number
  onExchange: (product: Product) => void
}

const CATEGORIES = [
  { id: '', label: '全部', icon: '🎁' },
  { id: 'book', label: '书籍', icon: '📚' },
  { id: 'stationery', label: '文具', icon: '✏️' },
  { id: 'toy', label: '玩具', icon: '🧸' },
  { id: 'coupon', label: '券码', icon: '🎟️' },
  { id: 'badge', label: '徽章', icon: '🏅' },
]

// 兜底模拟数据（Supabase 未连接时展示）
const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: '科普百科全书（儿童版）', points_cost: 200, stock: 10 } as Product,
  { id: '2', name: '定制科学实验套装', points_cost: 350, stock: 5 } as Product,
  { id: '3', name: '荣誉探索者徽章', points_cost: 100, stock: 20 } as Product,
  { id: '4', name: '科普主题笔记本', points_cost: 80, stock: 15 } as Product,
  { id: '5', name: '免费参观科技馆券', points_cost: 150, stock: 8 } as Product,
  { id: '6', name: '3D打印纪念品', points_cost: 500, stock: 3 } as Product,
  { id: '7', name: '环保购物袋（印制科普图案）', points_cost: 60, stock: 30 } as Product,
  { id: '8', name: '儿童智力拼图', points_cost: 120, stock: 12 } as Product,
]

export default function ProductGrid({ userPoints, onExchange }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    const { data, error } = await getProducts()
    if (!error && data && data.length > 0) {
      setProducts(data)
    } else {
      // 使用演示数据
      setProducts(DEMO_PRODUCTS)
    }
    setLoading(false)
  }

  // 筛选逻辑
  useEffect(() => {
    let list = products
    if (activeCategory) {
      list = list.filter(p => (p as Record<string, unknown>).category === activeCategory)
    }
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(kw))
    }
    setFiltered(list)
  }, [products, activeCategory, search])

  return (
    <div>
      {/* 搜索框 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="搜索商品名称..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* 分类筛选 */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* 商品网格 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm">加载商品中...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Package className="mb-3 h-12 w-12 text-gray-200" />
          <p className="text-sm">暂无符合条件的商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              userPoints={userPoints}
              onExchange={onExchange}
            />
          ))}
        </div>
      )}
    </div>
  )
}
