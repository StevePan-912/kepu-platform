'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import type { User } from '../supabase/types'

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
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
    if (!error && data) {
      setUser(data)
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
