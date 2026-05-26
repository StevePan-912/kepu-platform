'use client'

import { useState } from 'react'
import type { Product } from '@/lib/supabase/types'
import { createExchange } from '@/lib/supabase/queries'
import { X, Coins, CheckCircle2, AlertCircle, Loader2, ShoppingCart } from 'lucide-react'

interface ExchangeModalProps {
  product: Product
  userPoints: number
  userId: string | null
  onClose: () => void
  onSuccess: () => void
}

type Step = 'confirm' | 'loading' | 'success' | 'error'

export default function ExchangeModal({ product, userPoints, userId, onClose, onSuccess }: ExchangeModalProps) {
  const [step, setStep] = useState<Step>('confirm')
  const [errorMsg, setErrorMsg] = useState('')

  const cost = (product as Record<string, unknown>).points_required as number ?? product.points_cost
  const remaining = userPoints - cost
  const imageUrl = (product as Record<string, unknown>).image_url as string | undefined

  const categoryIcons: Record<string, string> = {
    book: '📚', stationery: '✏️', toy: '🧸', coupon: '🎟️', badge: '🏅', default: '🎁',
  }
  const category = (product as Record<string, unknown>).category as string ?? 'default'
  const icon = categoryIcons[category] ?? categoryIcons.default

  const handleConfirm = async () => {
    if (!userId) {
      setErrorMsg('请先登录后再兑换')
      setStep('error')
      return
    }
    setStep('loading')
    const { error } = await createExchange(userId, product.id)
    if (error) {
      setErrorMsg(error.message || '兑换失败，请稍后重试')
      setStep('error')
    } else {
      setStep('success')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={step === 'confirm' ? onClose : undefined} />

      {/* 弹窗 */}
      <div className="relative w-full max-w-sm rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        {/* 关闭按钮 */}
        {step === 'confirm' && (
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        )}

        {/* 确认步骤 */}
        {step === 'confirm' && (
          <>
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="h-16 w-16 object-contain" />
                ) : (
                  <span className="text-4xl">{icon}</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">确认兑换该商品？</p>
            </div>

            {/* 积分明细 */}
            <div className="mb-5 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">当前积分</span>
                <span className="font-semibold text-gray-700">{userPoints.toLocaleString()}</span>
              </div>
              <div className="my-2 border-t border-dashed border-gray-200" />
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Coins className="h-4 w-4 text-amber-500" />
                  消耗积分
                </span>
                <span className="font-semibold text-red-500">- {cost.toLocaleString()}</span>
              </div>
              <div className="my-2 border-t border-dashed border-gray-200" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">兑换后剩余</span>
                <span className={`font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {remaining.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                再想想
              </button>
              <button
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-medium text-white hover:bg-emerald-600 active:scale-95 transition"
              >
                <ShoppingCart className="h-4 w-4" />
                确认兑换
              </button>
            </div>
          </>
        )}

        {/* 加载中 */}
        {step === 'loading' && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-500" />
            <p className="text-gray-600">兑换处理中...</p>
            <p className="mt-1 text-xs text-gray-400">请稍等片刻</p>
          </div>
        )}

        {/* 成功 */}
        {step === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">兑换成功！</p>
            <p className="mt-2 text-sm text-gray-500">
              已消耗 <span className="font-semibold text-emerald-600">{cost}</span> 积分
            </p>
            <p className="mt-1 text-xs text-gray-400">请到个人中心查看兑换记录</p>
          </div>
        )}

        {/* 失败 */}
        {step === 'error' && (
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-xl font-bold text-gray-900">兑换失败</p>
            <p className="mt-2 text-sm text-gray-500">{errorMsg}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={onClose} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                关闭
              </button>
              <button onClick={() => setStep('confirm')} className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm text-white hover:bg-emerald-600">
                重试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
