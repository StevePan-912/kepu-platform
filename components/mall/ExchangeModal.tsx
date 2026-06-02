'use client'

import { useState } from 'react'
import type { Product } from '@/lib/supabase/types'
import { createExchange } from '@/lib/supabase/queries'
import { X, Coins, CheckCircle2, AlertCircle, Loader2, ShoppingCart, BookOpen, Pencil, ToyBrick, Ticket, Award, Gift } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ExchangeModalProps {
  product: Product
  userPoints: number
  userId: string | null
  onClose: () => void
  onSuccess: () => void
}

type Step = 'confirm' | 'loading' | 'success' | 'error'

const categoryIcons: Record<string, LucideIcon> = {
  book: BookOpen,
  stationery: Pencil,
  toy: ToyBrick,
  coupon: Ticket,
  badge: Award,
  default: Gift,
}

export default function ExchangeModal({ product, userPoints, userId, onClose, onSuccess }: ExchangeModalProps) {
  const [step, setStep] = useState<Step>('confirm')
  const [errorMsg, setErrorMsg] = useState('')

  const cost = product.points_required
  const remaining = userPoints - cost
  const imageUrl = (product as Record<string, unknown>).image_url as string | undefined

  const category = (product as Record<string, unknown>).category as string ?? 'default'
  const CategoryIcon = categoryIcons[category] ?? categoryIcons.default

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
      <div className="relative w-full max-w-sm rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl">
        {/* 关闭按钮 */}
        {step === 'confirm' && (
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        )}

        {/* 确认步骤 */}
        {step === 'confirm' && (
          <>
            <div className="mb-5 text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="h-16 w-16 object-contain" />
                ) : (
                  <CategoryIcon className="h-10 w-10 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">确认兑换该商品？</p>
            </div>

            {/* 积分明细 */}
            <div className="mb-5 rounded-2xl bg-muted p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">当前积分</span>
                <span className="font-semibold text-foreground">{userPoints.toLocaleString()}</span>
              </div>
              <div className="my-2 border-t border-dashed border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Coins className="h-4 w-4 text-primary" />
                  消耗积分
                </span>
                <span className="font-semibold text-destructive">- {cost.toLocaleString()}</span>
              </div>
              <div className="my-2 border-t border-dashed border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">兑换后剩余</span>
                <span className={`font-bold ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {remaining.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                再想想
              </button>
              <button
                onClick={handleConfirm}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-white hover:bg-primary/90 active:scale-95 transition"
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
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-foreground">兑换处理中...</p>
            <p className="mt-1 text-xs text-muted-foreground">请稍等片刻</p>
          </div>
        )}

        {/* 成功 */}
        {step === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground">兑换成功！</p>
            <p className="mt-2 text-sm text-muted-foreground">
              已消耗 <span className="font-semibold text-primary">{cost}</span> 积分
            </p>
            <p className="mt-1 text-xs text-muted-foreground">请到个人中心查看兑换记录</p>
          </div>
        )}

        {/* 失败 */}
        {step === 'error' && (
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <p className="text-xl font-bold text-foreground">兑换失败</p>
            <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={onClose} className="rounded-xl border border-border px-5 py-2.5 text-sm text-muted-foreground hover:bg-muted">
                关闭
              </button>
              <button onClick={() => setStep('confirm')} className="rounded-xl bg-primary px-5 py-2.5 text-sm text-white hover:bg-primary/90">
                重试
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
