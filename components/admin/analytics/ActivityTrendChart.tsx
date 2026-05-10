'use client'

import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdminActivityStats } from '@/lib/supabase/admin/types'
import { getActivityStats } from '@/lib/supabase/admin/queries'

const LINE_CONFIG: { key: string; label: string; color: string; strokeDasharray?: string }[] = [
  { key: 'playAudio',   label: '音频播放', color: '#3b82f6' },
  { key: 'scanAr',       label: 'AR扫描',   color: '#10b981' },
  { key: 'search',       label: '内容搜索',  color: '#f59e0b' },
  { key: 'feedback',     label: '反馈提交',  color: '#ef4444' },
  { key: 'activityJoin', label: '活动参与',  color: '#8b5cf6' },
  { key: 'total',        label: '总计',      color: '#6b7280', strokeDasharray: '4 4' },
]

export function ActivityTrendChart() {
  const [days, setDays] = useState(7)
  const [data, setData] = useState<AdminActivityStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: result, error } = await getActivityStats(days)
      if (!error && result) setData(result)
      setLoading(false)
    }
    fetchData()
  }, [days])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">活动趋势</CardTitle>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">近7天</SelectItem>
            <SelectItem value="30">近30天</SelectItem>
            <SelectItem value="90">近90天</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            加载中...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => d.slice(5)}  // MM-DD
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {LINE_CONFIG.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color}
                  strokeDasharray={line.strokeDasharray}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
