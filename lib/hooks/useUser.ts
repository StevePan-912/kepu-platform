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
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single() as unknown as { data: User | null; error: any }
      if (!error && data) {
        setUser(data)
      } else {
        // Supabase 不可用时使用 mock 数据
        setUser(DEMO_USER)
      }
    } catch {
      // 网络或配置错误时使用 mock 数据
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
