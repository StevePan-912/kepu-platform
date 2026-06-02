'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, BookOpen, Activity, TrendingUp } from 'lucide-react'
import type { AdminUserStats, AdminResourceStats, AdminActivityStats } from '@/lib/supabase/admin/types'
import { getUserStats } from '@/lib/supabase/admin/queries'
import { getResourceStats } from '@/lib/supabase/admin/queries'
import { getActivityStats } from '@/lib/supabase/admin/queries'

interface AnalyticsOverviewProps {
  days?: number
}

export function AnalyticsOverview({ days = 7 }: AnalyticsOverviewProps) {
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null)
  const [resourceStats, setResourceStats] = useState<AdminResourceStats | null>(null)
  const [activityStats, setActivityStats] = useState<AdminActivityStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      const [userResult, resourceResult, activityResult] = await Promise.all([
        getUserStats(),
        getResourceStats(),
        getActivityStats(days),
      ])

      if (userResult.error) setError(userResult.error)
      else setUserStats(userResult.data)

      if (resourceResult.error) setError(resourceResult.error)
      else setResourceStats(resourceResult.data)

      if (activityResult.error) setError(activityResult.error)
      else setActivityStats(activityResult.data || [])
    }

    fetchData()
  }, [days])

  const totalActivities = activityStats.reduce((sum, d) => sum + d.total, 0)
  const avgDailyActivities = activityStats.length > 0 ? Math.round(totalActivities / activityStats.length) : 0

  const cards = [
    {
      label: '总用户数',
      value: userStats?.totalUsers ?? '—',
      icon: Users,
      color: 'text-primary',
      bg: 'bg-accent',
    },
    {
      label: '总资源数',
      value: resourceStats?.total ?? '—',
      icon: BookOpen,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: `${days}天活动总数`,
      value: totalActivities,
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-accent',
    },
    {
      label: '日均活动量',
      value: avgDailyActivities,
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-3" />
              <div className="h-8 bg-muted rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
