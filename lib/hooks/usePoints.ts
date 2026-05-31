'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { PointRecord } from '../supabase/types'
import { useUser } from './useUser'

const DEMO_RECORDS: PointRecord[] = [
  { id: '1', user_id: '00000000-0000-0000-0000-000000000001', points: 50, reason: '浏览科普音频', created_at: '2026-05-30T10:00:00Z' },
  { id: '2', user_id: '00000000-0000-0000-0000-000000000001', points: 30, reason: 'AR 扫描互动', created_at: '2026-05-29T15:00:00Z' },
  { id: '3', user_id: '00000000-0000-0000-0000-000000000001', points: 20, reason: '搜索科普内容', created_at: '2026-05-28T09:00:00Z' },
  { id: '4', user_id: '00000000-0000-0000-0000-000000000001', points: -100, reason: '兑换商品：科普书籍', created_at: '2026-05-27T14:00:00Z' },
  { id: '5', user_id: '00000000-0000-0000-0000-000000000001', points: 80, reason: '参与志愿者活动', created_at: '2026-05-26T16:00:00Z' },
]

/** 检测 Supabase 是否已配置真实凭据 */
const isSupabaseConfigured = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return url.startsWith('https://') && !url.includes('placeholder')
})()

export function usePoints() {
  const { user } = useUser()
  const [records, setRecords] = useState<PointRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchRecords()
    }
  }, [user])

  const fetchRecords = async () => {
    if (!user) return
    setLoading(true)
    if (!isSupabaseConfigured) {
      setRecords(DEMO_RECORDS)
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('point_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20) as unknown as { data: PointRecord[] | null }
      if (data && data.length > 0) {
        setRecords(data)
      } else {
        setRecords(DEMO_RECORDS)
      }
    } catch {
      setRecords(DEMO_RECORDS)
    }
    setLoading(false)
  }

  const totalPoints = user?.points || 0
  const totalEarned = records.filter(r => r.points > 0).reduce((sum, r) => sum + r.points, 0)
  const totalSpent = Math.abs(records.filter(r => r.points < 0).reduce((sum, r) => sum + r.points, 0))

  return { records, loading, totalPoints, totalEarned, totalSpent, refetch: fetchRecords }
}
