'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UserActivity } from '@/lib/supabase/types'
import { formatDateTime } from '@/lib/utils/format'
import { Headphones, Smartphone, Search, MessageCircle, Calendar, ClipboardList } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ActivityTimelineProps {
  userId: string
}

export function ActivityTimeline({ userId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    const { data } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) setActivities(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchActivities()
  }, [userId])

  const actionLabels: Record<string, { icon: LucideIcon; label: string }> = {
    play_audio: { icon: Headphones, label: '播放音频' },
    scan_ar: { icon: Smartphone, label: 'AR扫码' },
    search: { icon: Search, label: '搜索' },
    feedback: { icon: MessageCircle, label: '反馈' },
    join_activity: { icon: Calendar, label: '活动报名' },
  }

  if (loading) {
    return (
      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-background rounded-lg p-8 text-center text-muted-foreground">
        暂无行为记录
      </div>
    )
  }

  return (
    <div className="bg-background rounded-lg ring-1 ring-border p-4">
      <div className="space-y-4">
        {activities.map((activity) => {
          const config = actionLabels[activity.action] ?? { icon: ClipboardList, label: activity.action }
          const IconComponent = config.icon

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-foreground">{config.label}</p>
                {activity.keyword && (
                  <p className="text-sm text-muted-foreground">关键词：{activity.keyword}</p>
                )}
                {activity.duration && (
                  <p className="text-sm text-muted-foreground">时长：{activity.duration}秒</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{formatDateTime(activity.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
