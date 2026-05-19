'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/layout/NavBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { PointHistory } from '@/components/profile/PointHistory'
import { ActivityTimeline } from '@/components/profile/ActivityTimeline'
import { useUser } from '@/lib/hooks/useUser'
import { usePoints } from '@/lib/hooks/usePoints'
import { supabase } from '@/lib/supabase/client'
import type { Exchange, VolunteerRecord } from '@/lib/supabase/types'

export default function ProfilePage() {
  const { user, loginDemo, logout } = useUser()
  const { records } = usePoints()
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [volunteerRecords, setVolunteerRecords] = useState<VolunteerRecord[]>([])
  const [activeTab, setActiveTab] = useState<'points' | 'activities' | 'exchanges'>('points')

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return
    
    // 获取兑换记录
    const { data: exchangesData } = await supabase
      .from('exchanges')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    // 获取志愿者记录
    const { data: volunteerData } = await supabase
      .from('volunteer_records')
      .select('*')
      .eq('user_id', user.id)
    
    if (exchangesData) setExchanges(exchangesData)
    if (volunteerData) setVolunteerRecords(volunteerData)
  }

  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <NavBar />
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <p className="text-gray-500 mb-2">登录后查看个人信息</p>
          <p className="text-sm text-gray-400 mb-6">体验积分、荣誉和志愿者系统</p>
          <button
            onClick={() => loginDemo()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            登录体验（演示模式）
          </button>
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <NavBar />
      
      {/* 用户信息卡片 */}
      <ProfileCard user={user} onLogout={logout} />

      {/* 统计概览 */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-500">{user.points}</p>
            <p className="text-xs text-gray-500">积分</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-500">{records.length}</p>
            <p className="text-xs text-gray-500">行为</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-orange-500">{exchanges.length}</p>
            <p className="text-xs text-gray-500">兑换</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-500">
              {volunteerRecords.reduce((sum, r) => sum + (r.hours || 0), 0)}
            </p>
            <p className="text-xs text-gray-500">志愿时长</p>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="px-4 py-2">
        <div className="flex bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              activeTab === 'points' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              activeTab === 'activities' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            行为记录
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`flex-1 py-2 rounded-lg text-sm ${
              activeTab === 'exchanges' ? 'bg-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            兑换记录
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4 py-2">
        {activeTab === 'points' && <PointHistory records={records} />}
        {activeTab === 'activities' && <ActivityTimeline userId={user.id} />}
        {activeTab === 'exchanges' && (
          <div className="space-y-3">
            {exchanges.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                暂无兑换记录
              </div>
            ) : (
              exchanges.map((exchange) => (
                <div key={exchange.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">商品兑换</p>
                      <p className="text-sm text-gray-500">
                        消耗 {exchange.points_spent} 积分
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      exchange.status === 'completed' ? 'bg-green-100 text-green-600' :
                      exchange.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {exchange.status === 'completed' ? '已完成' :
                       exchange.status === 'pending' ? '待处理' : '已取消'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
