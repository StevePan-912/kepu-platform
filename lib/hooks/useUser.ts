'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { User } from '../supabase/types'

const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  phone: '13800138000',
  nickname: '科普体验用户',
  role: 'resident',
  points: 1280,
  honor_level: 'explorer',
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-05-31T00:00:00Z',
}

/** 检测 Supabase 是否已配置真实凭据 */
const isSupabaseConfigured = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  return url.startsWith('https://') && !url.includes('placeholder')
})()

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const demoUserId = localStorage.getItem('demo_user_id')
    if (demoUserId) {
      fetchUser(demoUserId)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (userId: string) => {
    setLoading(true)
    if (!isSupabaseConfigured) {
      // 无有效 Supabase 配置，直接使用 mock 数据（秒级响应）
      setUser(DEMO_USER)
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single() as unknown as { data: User | null; error: any }
      if (!error && data) {
        setUser(data)
      } else {
        setUser(DEMO_USER)
      }
    } catch {
      setUser(DEMO_USER)
    }
    setLoading(false)
  }

  const loginDemo = async (userId: string = '00000000-0000-0000-0000-000000000001') => {
    localStorage.setItem('demo_user_id', userId)
    await fetchUser(userId)
  }

  const logout = () => {
    localStorage.removeItem('demo_user_id')
    setUser(null)
  }

  return { user, loading, loginDemo, logout, refetch: () => user && fetchUser(user.id) }
}
