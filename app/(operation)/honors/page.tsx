'use client'

import { useState, useEffect, useTransition } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { HonorBoard } from '@/components/honors/HonorBoard'
import { BadgeCollection } from '@/components/honors/BadgeCollection'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'
import { Trophy, Sparkles, Award } from 'lucide-react'

// Mock 排行榜数据（Supabase 未连接时展示）
const MOCK_TOP_USERS: User[] = [
  {
    id: 'mock-1',
    phone: '138****1001',
    nickname: '星空探索者',
    role: 'resident',
    points: 3680,
    honor_level: 'navigator',
    avatar_url: null,
    created_at: '2025-09-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    phone: '138****1002',
    nickname: '自然观察家',
    role: 'resident',
    points: 2940,
    honor_level: 'navigator',
    avatar_url: null,
    created_at: '2025-08-15',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    phone: '138****1003',
    nickname: '科学小达人',
    role: 'resident',
    points: 2350,
    honor_level: 'explorer',
    avatar_url: null,
    created_at: '2025-10-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    phone: '138****1004',
    nickname: '化石猎人',
    role: 'resident',
    points: 1870,
    honor_level: 'explorer',
    avatar_url: null,
    created_at: '2025-11-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    phone: '138****1005',
    nickname: '科普小百科',
    role: 'resident',
    points: 1520,
    honor_level: 'explorer',
    avatar_url: null,
    created_at: '2025-12-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    phone: '138****1006',
    nickname: '绿叶守护者',
    role: 'resident',
    points: 1240,
    honor_level: 'spreader',
    avatar_url: null,
    created_at: '2026-01-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-7',
    phone: '138****1007',
    nickname: '天文爱好者',
    role: 'resident',
    points: 980,
    honor_level: 'spreader',
    avatar_url: null,
    created_at: '2026-02-01',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-8',
    phone: '138****1008',
    nickname: '社区科普员',
    role: 'resident',
    points: 760,
    honor_level: 'spreader',
    avatar_url: null,
    created_at: '2026-03-01',
    updated_at: new Date().toISOString(),
  },
]

export default function HonorsPage() {
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [period, setPeriod] = useState<'quarterly' | 'yearly'>('quarterly')
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  const fetchTopUsers = async () => {
    setLoading(true)

    if (!isSupabaseConfigured) {
      setTopUsers(MOCK_TOP_USERS)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('users')
      .select('*')
      .neq('honor_level', null)
      .order('points', { ascending: false })
      .limit(10)

    if (data && data.length > 0) {
      setTopUsers(data)
    } else {
      setTopUsers(MOCK_TOP_USERS)
    }
    setLoading(false)
  }

  useEffect(() => {
    startTransition(() => {
      fetchTopUsers()
    })
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
              period === 'quarterly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            季度榜单
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              period === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
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
