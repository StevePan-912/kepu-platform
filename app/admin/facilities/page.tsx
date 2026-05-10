'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/admin/layout'
import { DeviceStatusList } from '@/components/admin/facilities/DeviceStatusList'
import { AlarmTable } from '@/components/admin/facilities/AlarmTable'
import { DeviceMap } from '@/components/admin/facilities/DeviceMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Radio, AlertTriangle, Activity } from 'lucide-react'
import { getDeviceStats, getAlertStats } from '@/lib/supabase/admin/queries'

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  valueColor,
}: {
  title: string
  value: string | number
  sub: string
  icon: React.ElementType
  valueColor?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <Icon className="w-5 h-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor ?? ''}`}>{value}</div>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </CardContent>
    </Card>
  )
}

export default function FacilitiesPage() {
  const [deviceStats, setDeviceStats] = useState<{
    total: number
    online: number
    offline: number
    maintenance: number
    onlineRate: number
  } | null>(null)
  const [alertStats, setAlertStats] = useState<{
    pending: number
  } | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true)
      const [deviceResult, alertResult] = await Promise.all([
        getDeviceStats(),
        getAlertStats(),
      ])
      if (deviceResult.data) setDeviceStats(deviceResult.data)
      if (alertResult.data) setAlertStats(alertResult.data)
      setStatsLoading(false)
    }
    fetchStats()
  }, [])

  // 统计卡数值（加载中显示 —）
  const totalVal = statsLoading ? '—' : deviceStats?.total ?? '—'
  const onlineVal = statsLoading ? '—' : deviceStats?.online ?? '—'
  const onlineRate = statsLoading ? '' : `在线率 ${deviceStats?.onlineRate ?? 0}%`
  const pendingVal = statsLoading ? '—' : alertStats?.pending ?? '—'

  return (
    <div>
      <AdminHeader title="设施监控" subtitle="实时监控所有设备状态" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* 统计卡 */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="设备总数"
            value={totalVal}
            sub="展览路街道"
            icon={Radio}
          />
          <StatCard
            title="在线设备"
            value={onlineVal}
            sub={onlineRate}
            icon={Activity}
            valueColor="text-green-600"
          />
          <StatCard
            title="待处理告警"
            value={pendingVal}
            sub="待处理告警"
            icon={AlertTriangle}
            valueColor={
              !statsLoading && (alertStats?.pending ?? 0) > 0 ? 'text-orange-600' : ''
            }
          />
        </div>

        {/* 主内容 Tabs */}
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">设备列表</TabsTrigger>
            <TabsTrigger value="alerts">告警记录</TabsTrigger>
            <TabsTrigger value="map">设备地图</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <DeviceStatusList />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AlarmTable />
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <DeviceMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
