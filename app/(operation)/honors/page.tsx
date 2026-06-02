'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { HonorBoard } from '@/components/honors/HonorBoard'
import { BadgeCollection } from '@/components/honors/BadgeCollection'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'
import { Trophy, Sparkles, Award } from 'lucide-react'

export default function HonorsPage() {
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [period, setPeriod] = useState<'quarterly' | 'yearly'>('quarterly')
  const [loading, setLoading] = useState(true)

  const fetchTopUsers = async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .neq('honor_level', null)
      .order('points', { ascending: false })
      .limit(10)

    if (data) setTopUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTopUsers()
  }, [period])

  return (
    <div className="min-h-screen bg-background pb-20">
      <NavBar />

      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-8">
        <h1 className="text-xl font-semibold">荣誉殿堂</h1>
        <p className="text-sm opacity-70 mt-1">科普探索者 · 传播者 · 领航者</p>
      </div>

      {/* Period selector */}
      <div className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('quarterly')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'quarterly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            季度榜单
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'yearly' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            年度榜单
          </button>
        </div>
      </div>

      {/* Honor board */}
      <div className="px-6 py-2">
        <HonorBoard users={topUsers} loading={loading} />
      </div>

      {/* Badge collection */}
      <div className="px-6 py-4">
        <BadgeCollection />
      </div>

      {/* Incentives */}
      <div className="px-6 py-4">
        <div className="bg-card rounded-xl p-5 ring-1 ring-border">
          <h3 className="font-semibold text-foreground mb-3">专属激励</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Trophy className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">年度领航者：与科学家面对面交流</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">优先参与天文馆夜场观测</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Award className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">社区宣传栏、小程序首页公示表彰</span>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
