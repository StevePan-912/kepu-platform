'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getUserById, upsertUser } from '@/lib/supabase/queries'
import { signInAnonymously, signOut } from '@/lib/supabase/auth'
import type { User } from '@/lib/supabase/types'
import type { Session } from '@supabase/supabase-js'

interface UseUserReturn {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  isVolunteer: boolean
  loginDemo: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async (userId: string) => {
    const { data } = await getUserById(userId)
    setUser(data ?? null)
  }, [])

  const refreshUser = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    if (currentSession?.user) {
      await fetchUser(currentSession.user.id)
    }
  }, [fetchUser])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }: any) => {
      setSession(s)
      if (s?.user) {
        fetchUser(s.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, s: any) => {
      setSession(s)
      if (s?.user) {
        fetchUser(s.user.id)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchUser])

  const loginDemo = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await signInAnonymously()
      if (error) throw error
      if (data.user) {
        await upsertUser({
          id: data.user.id,
          nickname: `探索者_${data.user.id.slice(0, 6)}`,
          role: 'resident',
          points: 0,
          honor_level: 'explorer',
        })
        await fetchUser(data.user.id)
      }
    } finally {
      setLoading(false)
    }
  }, [fetchUser])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setSession(null)
  }, [])

  return {
    user,
    session,
    loading,
    isAdmin: user?.role === 'admin',
    isVolunteer: user?.role === 'volunteer' || user?.role === 'admin',
    loginDemo,
    logout,
    refreshUser,
  }
}
