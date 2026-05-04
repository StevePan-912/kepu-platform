'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { PointRecord } from '../supabase/types'
import { useUser } from './useUser'

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
    const { data } = await supabase
      .from('point_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) {
      setRecords(data)
    }
    setLoading(false)
  }

  const totalPoints = user?.points || 0
  const totalEarned = records.filter(r => r.points > 0).reduce((sum, r) => sum + r.points, 0)
  const totalSpent = Math.abs(records.filter(r => r.points < 0).reduce((sum, r) => sum + r.points, 0))

  return { records, loading, totalPoints, totalEarned, totalSpent, refetch: fetchRecords }
}