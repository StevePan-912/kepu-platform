'use client'

import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserPreferenceItem } from '@/lib/supabase/admin/types'
import { getUserPreferences } from '@/lib/supabase/admin/queries'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6']

export function UserPreferenceAnalysis() {
  const [data, setData] = useState<UserPreferenceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: result, error } = await getUserPreferences(30)
      if (!error && result) setData(result)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">📊 用户偏好分析（近30天）</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            加载中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            暂无偏好数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} 次`, String(name)]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
