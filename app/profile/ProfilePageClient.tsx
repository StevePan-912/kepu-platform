'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { usePoints } from '@/lib/hooks/usePoints'
import { getPointRecords, getUserActivities } from '@/lib/supabase/queries'
import { ProfileCard, PointHistory, ActivityTimeline } from '@/components/profile'
import type { PointRecord, UserActivity } from '@/lib/supabase/types'
import {
  Coins,
  Trophy,
  Clock,
  ShoppingBag,
  Award,
  ChevronRight,
  User as UserIcon,
  Loader2,
} from 'lucide-react'

type Tab = 'points' | 'activity'

export default function ProfilePageClient() {
  const { user, loading, loginDemo, logout } = useUser()
  const { totalPoints, records: pointRecords, loading: pointsLoading, refetch: refetchPoints } = usePoints()
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('points')

  const fetchActivities = useCallback(async () => {
    if (!user) return
    setActivitiesLoading(true)
    const { data, error } = await getUserActivities(user.id, 20)
    if (!error && data) {
      setActivities(data as UserActivity[])
    } else {
      // 演示数据
      setActivities([
        { id: '1', user_id: user.id, action_type: 'play_audio', search_keyword: null, duration_seconds: 120, created_at: '2026-05-26T10:00:00Z' },
        { id: '2', user_id: user.id, action_type: 'scan_ar', search_keyword: null, duration_seconds: null, created_at: '2026-05-25T15:30:00Z' },
        { id: '3', user_id: user.id, action_type: 'search', search_keyword: '恐龙', duration_seconds: null, created_at: '2026-05-25T14:00:00Z' },
        { id: '4', user_id: user.id, action_type: 'feedback', search_keyword: null, duration_seconds: null, created_at: '2026-05-24T09:00:00Z' },
        { id: '5', user_id: user.id, action_type: 'activity_join', search_keyword: null, duration_seconds: null, created_at: '2026-05-23T16:00:00Z' },
      ] as unknown as UserActivity[])
    }
    setActivitiesLoading(false)
  }, [user])

  useEffect(() => {
    if (user && activeTab === 'activity') {
      fetchActivities()
    }
  }, [user, activeTab, fetchActivities])

  const handleLogout = () => {
    logout()
  }

  // 未登录状态
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <UserIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">登录科普漫步</h2>
          <p className="mt-2 text-sm text-gray-500">登录后查看个人中心、积分记录和行为历史</p>
          <button
            onClick={() => loginDemo()}
            className="mt-6 w-full max-w-xs rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 py-3 text-sm font-medium text-white shadow-lg transition hover:shadow-xl active:scale-95"
          >
            体验登录
          </button>
          <p className="mt-3 text-xs text-gray-400">演示模式将使用虚拟用户数据</p>
        </div>
      </div>
    )
  }

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 个人信息卡 */}
      <ProfileCard user={user!} onLogout={handleLogout} />

      {/* 统计概览 */}
      <div className="mx-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: Coins, label: '积分', value: totalPoints, color: 'text-amber-500' },
          { icon: Trophy, label: '荣誉', value: user?.honor_level === 'leader' ? '领航者' : user?.honor_level === 'communicator' ? '传播者' : '探索者', color: 'text-blue-500' },
          { icon: Clock, label: '互动', value: activities.length || '-', color: 'text-emerald-500' },
          { icon: Award, label: '等级', value: user?.honor_level === 'leader' ? 'Lv.3' : user?.honor_level === 'communicator' ? 'Lv.2' : 'Lv.1', color: 'text-purple-500' },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center rounded-xl bg-white p-3 shadow-sm">
            <item.icon className={`mb-1.5 h-5 w-5 ${item.color}`} />
            <span className="text-sm font-bold text-gray-800">{item.value}</span>
            <span className="mt-0.5 text-xs text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">快捷入口</h3>
        <div className="space-y-1">
          {[
            { icon: ShoppingBag, label: '积分商城', desc: '用积分兑换礼品', href: '/mall' },
            { icon: Coins, label: '积分记录', desc: '查看积分收支明细', tab: 'points' as Tab },
            { icon: Clock, label: '行为历史', desc: '查看科普互动记录', tab: 'activity' as Tab },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.tab ? setActiveTab(item.tab) : null}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
            >
              {item.href ? (
                <a href={item.href} className="flex w-full items-center gap-3 text-left no-underline text-inherit">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <item.icon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </a>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <item.icon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 区域：积分记录 / 行为历史 */}
      <div className="mx-4 mt-4">
        <div className="mb-3 flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === 'points' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Coins className="h-4 w-4" />
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === 'activity' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Clock className="h-4 w-4" />
            行为历史
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">
            {activeTab === 'points' ? '积分收支明细' : '科普互动记录'}
          </h3>
          <span className="text-xs text-gray-400">
            {activeTab === 'points' ? `共 ${pointRecords.length} 条` : `共 ${activities.length} 条`}
          </span>
        </div>

        {activeTab === 'points' ? (
          pointsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm">加载中...</p>
            </div>
          ) : pointRecords.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm text-gray-400">
              <Coins className="mx-auto mb-3 h-12 w-12 text-gray-200" />
              <p className="text-sm">暂无积分记录</p>
              <p className="mt-1 text-xs text-gray-300">参与科普活动即可获取积分</p>
            </div>
          ) : (
            <PointHistory records={pointRecords} />
          )
        ) : (
          activitiesLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm">加载中...</p>
            </div>
          ) : (
            <ActivityTimeline userId={user!.id} />
          )
        )}
      </div>
    </div>
  )
}
