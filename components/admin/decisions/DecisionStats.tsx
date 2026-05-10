'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, CheckCircle, Zap, BookOpen, MapPin } from 'lucide-react'
import type { AdminDecisionSuggestion } from '@/lib/supabase/admin/types'
import { getDecisionSuggestions } from '@/lib/supabase/admin/queries'

export function DecisionStats() {
  const [suggestions, setSuggestions] = useState<AdminDecisionSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // 获取大量数据以统计全量
      const { data, error } = await getDecisionSuggestions({ page: 1, pageSize: 1000 })
      if (!error && data?.data) {
        setSuggestions(data.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const total = suggestions.length
  const active = suggestions.filter(s => s.is_active).length
  const activityCount = suggestions.filter(s => s.type === 'activity').length
  const contentCount = suggestions.filter(s => s.type === 'content').length
  const locationCount = suggestions.filter(s => s.type === 'location').length

  const cards = [
    {
      label: '建议总数',
      value: total,
      icon: Lightbulb,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: '激活建议',
      value: active,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: '活动类',
      value: activityCount,
      icon: Zap,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '内容类',
      value: contentCount,
      icon: BookOpen,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: '位置类',
      value: locationCount,
      icon: MapPin,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
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
