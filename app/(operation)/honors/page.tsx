'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { HonorBoard } from '@/components/honors/HonorBoard'
import { BadgeCollection } from '@/components/honors/BadgeCollection'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'

export default function HonorsPage() {
  const [topUsers, setTopUsers] = useState<User[]>([])
  const [period, setPeriod] = useState<'quarterly' | 'yearly'>('quarterly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopUsers()
  }, [period])

  const fetchTopUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .neq('honor_level', null)
      .order('points', { ascending: false })
      .limit(10)
    
    if (data) setTopUsers(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-6">
        <h1 className="text-xl font-bold">荣誉殿堂</h1>
        <p className="text-sm opacity-80 mt-1">科普探索者 · 传播者 · 领航者</p>
      </div>

      {/* 时间周期选择 */}
      <div className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('quarterly')}
            className={`px-4 py-2 rounded-lg text-sm ${
              period === 'quarterly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            季度榜单
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-sm ${
              period === 'yearly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'
            }`}
          >
            年度榜单
          </button>
        </div>
      </div>

      {/* 荣誉榜单 */}
      <div className="px-4 py-2">
        <HonorBoard users={topUsers} loading={loading} />
      </div>

      {/* 荣誉徽章说明 */}
      <div className="px-4 py-4">
        <BadgeCollection />
      </div>

      {/* 激励说明 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">专属激励</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🥇</span>
              <span className="text-sm text-gray-600">年度领航者：与科学家面对面交流</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🌟</span>
              <span className="text-sm text-gray-600">优先参与天文馆夜场观测</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              <span className="text-sm text-gray-600">社区宣传栏、小程序首页公示表彰</span>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
