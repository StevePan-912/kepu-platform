'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPinned } from 'lucide-react'
import type { HotAreaItem } from '@/lib/supabase/admin/types'
import { getHotAreas } from '@/lib/supabase/admin/queries'

export function HotAreaAnalysis() {
  const [data, setData] = useState<HotAreaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data: result, error } = await getHotAreas(10)
      if (!error && result) setData(result)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPinned className="w-4 h-4" />
          热门区域分析
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            加载中...
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            暂无区域活动数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="area"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [String(value), '活动次数']}
                labelFormatter={(label) => `区域: ${label}`}
              />
              <Bar
                dataKey="activityCount"
                name="活动次数"
                fill="#4a6fa5"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
