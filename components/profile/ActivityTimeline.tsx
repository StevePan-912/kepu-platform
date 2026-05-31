'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UserActivity } from '@/lib/supabase/types'
import { formatDateTime } from '@/lib/utils/format'

interface ActivityTimelineProps {
  userId: string
}

export function ActivityTimeline({ userId }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [userId])

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

  const actionLabels: Record<string, { icon: string; label: string }> = {
    play_audio: { icon: '🔊', label: '播放音频' },
    scan_ar: { icon: '📱', label: 'AR扫码' },
    search: { icon: '🔍', label: '搜索' },
    feedback: { icon: '💬', label: '反馈' },
    activity_join: { icon: '📅', label: '活动报名' },
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        加载中...
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        暂无行为记录
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-4">
        {activities.map((activity) => {
          const config = actionLabels[activity.action] ?? { icon: '📋', label: activity.action }
          
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <span className="text-lg">{config.icon}</span>
              <div className="flex-1">
                <p className="text-gray-900">{config.label}</p>
                {activity.keyword && (
                  <p className="text-sm text-gray-500">关键词：{activity.keyword}</p>
                )}
                {activity.duration && (
                  <p className="text-sm text-gray-500">时长：{activity.duration}秒</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(activity.created_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
