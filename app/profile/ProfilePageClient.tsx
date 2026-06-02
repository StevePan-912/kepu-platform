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
        { id: '1', user_id: user.id, action: 'play_audio', resource_id: null, device_id: null, keyword: null, duration: 120, created_at: '2026-05-26T10:00:00Z' },
        { id: '2', user_id: user.id, action: 'scan_ar', resource_id: null, device_id: null, keyword: null, duration: null, created_at: '2026-05-25T15:30:00Z' },
        { id: '3', user_id: user.id, action: 'search', resource_id: null, device_id: null, keyword: '恐龙', duration: null, created_at: '2026-05-25T14:00:00Z' },
        { id: '4', user_id: user.id, action: 'feedback', resource_id: null, device_id: null, keyword: null, duration: null, created_at: '2026-05-24T09:00:00Z' },
        { id: '5', user_id: user.id, action: 'join_activity', resource_id: null, device_id: null, keyword: null, duration: null, created_at: '2026-05-23T16:00:00Z' },
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg">
            <UserIcon className="h-12 w-12 text-background" />
          </div>
          <h2 className="text-xl font-bold text-foreground">登录科普漫步</h2>
          <p className="mt-2 text-sm text-muted-foreground">登录后查看个人中心、积分记录和行为历史</p>
          <button
            onClick={() => loginDemo()}
            className="mt-6 w-full max-w-xs rounded-2xl bg-primary py-3 text-sm font-medium text-background shadow-lg transition hover:shadow-xl active:scale-95"
          >
            体验登录
          </button>
          <p className="mt-3 text-xs text-muted-foreground">演示模式将使用虚拟用户数据</p>
        </div>
      </div>
    )
  }

  // 加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 个人信息卡 */}
      <ProfileCard user={user!} onLogout={handleLogout} />

      {/* 统计概览 */}
      <div className="mx-4 mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: Coins, label: '积分', value: totalPoints, color: 'text-warning' },
          { icon: Trophy, label: '荣誉', value: user?.honor_level === 'leader' ? '领航者' : user?.honor_level === 'communicator' ? '传播者' : '探索者', color: 'text-primary' },
          { icon: Clock, label: '互动', value: activities.length || '-', color: 'text-success' },
          { icon: Award, label: '等级', value: user?.honor_level === 'leader' ? 'Lv.3' : user?.honor_level === 'communicator' ? 'Lv.2' : 'Lv.1', color: 'text-primary' },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center rounded-xl bg-background p-3 ring-1 ring-border">
            <item.icon className={`mb-1.5 h-5 w-5 ${item.color}`} />
            <span className="text-sm font-bold text-foreground">{item.value}</span>
            <span className="mt-0.5 text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 快捷入口 */}
      <div className="mx-4 mt-4 rounded-2xl bg-background p-4 ring-1 ring-border">
        <h3 className="mb-3 text-sm font-semibold text-foreground">快捷入口</h3>
        <div className="space-y-1">
          {[
            { icon: ShoppingBag, label: '积分商城', desc: '用积分兑换礼品', href: '/mall' },
            { icon: Coins, label: '积分记录', desc: '查看积分收支明细', tab: 'points' as Tab },
            { icon: Clock, label: '行为历史', desc: '查看科普互动记录', tab: 'activity' as Tab },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.tab ? setActiveTab(item.tab) : null}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-accent"
            >
              {item.href ? (
                <a href={item.href} className="flex w-full items-center gap-3 text-left no-underline text-inherit">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 区域：积分记录 / 行为历史 */}
      <div className="mx-4 mt-4">
        <div className="mb-3 flex rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab('points')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === 'points' ? 'bg-background text-primary ring-1 ring-border' : 'text-muted-foreground'
            }`}
          >
            <Coins className="h-4 w-4" />
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === 'activity' ? 'bg-background text-primary ring-1 ring-border' : 'text-muted-foreground'
            }`}
          >
            <Clock className="h-4 w-4" />
            行为历史
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {activeTab === 'points' ? '积分收支明细' : '科普互动记录'}
          </h3>
          <span className="text-xs text-muted-foreground">
            {activeTab === 'points' ? `共 ${pointRecords.length} 条` : `共 ${activities.length} 条`}
          </span>
        </div>

        {activeTab === 'points' ? (
          pointsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">加载中...</p>
            </div>
          ) : pointRecords.length === 0 ? (
            <div className="rounded-2xl bg-background p-8 text-center ring-1 ring-border text-muted-foreground">
              <Coins className="mx-auto mb-3 h-12 w-12 text-muted-foreground opacity-40" />
              <p className="text-sm">暂无积分记录</p>
              <p className="mt-1 text-xs text-muted-foreground opacity-60">参与科普活动即可获取积分</p>
            </div>
          ) : (
            <PointHistory records={pointRecords} />
          )
        ) : (
          activitiesLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
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
