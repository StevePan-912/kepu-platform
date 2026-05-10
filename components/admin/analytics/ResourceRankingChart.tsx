'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getResourceRanking } from '@/lib/supabase/admin/queries'

interface RankingItem {
  id: string
  title: string
  category: string
  type: string
  interactionCount: number
}

/** 截断过长的标题 */
function trunc(str: string, len = 8) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

export function ResourceRankingChart() {
  const [data, setData] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: result, error } = await getResourceRanking(10)
      if (!error && result) setData(result as RankingItem[])
      setLoading(false)
    }
    fetchData()
  }, [])

  // Recharts 横向柱状图需要数据倒序（第1名显示在顶部）
  const chartData = useMemo(() => [...data].reverse(), [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">资源互动排行 TOP 10</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            加载中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-400">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey={(d: any) => trunc(d.title, 10)}
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, _name, props: any) => [
                  value,
                  props.payload.title,
                ]}
              />
              <Bar
                dataKey="interactionCount"
                name="互动次数"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
