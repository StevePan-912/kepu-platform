'use client'

import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CategoryDistributionItem } from '@/lib/supabase/admin/types'
import { getCategoryDistribution } from '@/lib/supabase/admin/queries'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function CategoryDistributionChart() {
  const [data, setData] = useState<CategoryDistributionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: result, error } = await getCategoryDistribution()
      if (!error && result) setData(result)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">资源分类分布</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            加载中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="category"
                label={({ category, percentage }: any) => `${category} ${percentage}%`}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
