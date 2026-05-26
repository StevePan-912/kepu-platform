'use client'

import { useState, useEffect } from 'react'
import { getUserExchanges } from '@/lib/supabase/queries'
import { Clock, CheckCircle2, XCircle, Package, Loader2 } from 'lucide-react'

interface ExchangeHistoryProps {
  userId: string | null
  refreshKey?: number
}

interface ExchangeWithProduct {
  id: string
  user_id: string
  product_id: string
  points_spent: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  products?: { name: string; image_url?: string }
}

const statusConfig = {
  pending: { label: '待处理', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  completed: { label: '已完成', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  cancelled: { label: '已取消', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50' },
}

export default function ExchangeHistory({ userId, refreshKey }: ExchangeHistoryProps) {
  const [records, setRecords] = useState<ExchangeWithProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      loadRecords()
    }
  }, [userId, refreshKey])

  const loadRecords = async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await getUserExchanges(userId)
    if (!error && data) {
      setRecords(data as ExchangeWithProduct[])
    }
    setLoading(false)
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Package className="mb-3 h-12 w-12 text-gray-200" />
        <p className="text-sm">登录后查看兑换记录</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm">加载记录中...</p>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Package className="mb-3 h-12 w-12 text-gray-200" />
        <p className="text-sm">暂无兑换记录</p>
        <p className="mt-1 text-xs text-gray-300">快去挑选喜欢的商品吧</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map(record => {
        const status = statusConfig[record.status] ?? statusConfig.pending
        const StatusIcon = status.icon
        const productName = record.products?.name ?? '未知商品'

        return (
          <div key={record.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.bg}`}>
                  <StatusIcon className={`h-5 w-5 ${status.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{productName}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {new Date(record.created_at).toLocaleString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-500">-{record.points_spent}</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
