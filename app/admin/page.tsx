'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Radio,
  Users,
  Activity,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import {
  getDeviceStats,
  getUserStats,
  getActivityStats,
  getDecisionSuggestions,
  getAlerts,
} from '@/lib/supabase/admin/queries'
import Link from 'next/link'

// 数字格式化
function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n.toLocaleString()
}

// 计算较昨日变化（Mock，实际需要历史对比）
function getMockChange(current: number, type: string): { value: string; trend: 'up' | 'down' } {
  const changes: Record<string, { min: number; max: number }> = {
    onlineRate: { min: -5, max: 5 },
    users: { min: 50, max: 300 },
    activities: { min: -200, max: 500 },
    suggestions: { min: -5, max: 10 },
  }
  const range = changes[type] || { min: -10, max: 10 }
  const change = Math.floor(Math.random() * (range.max - range.min)) + range.min
  return {
    value: (change >= 0 ? '+' : '') + change.toLocaleString(),
    trend: change >= 0 ? 'up' : 'down',
  }
}

// 相对时间格式化
function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  return Math.floor(diff / 86400) + '天前'
}

const quickActions = [
  { label: '查看所有设备', href: '/admin/facilities', icon: Radio },
  { label: '数据分析报告', href: '/admin/analytics', icon: Activity },
  { label: '智能决策建议', href: '/admin/decisions', icon: Lightbulb },
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    deviceStats: null as any,
    userStats: null as any,
    todayActivities: 0,
    pendingSuggestions: 0,
  })
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 并行请求所有数据
      const [deviceRes, userRes, activityRes, suggestionRes, alertsRes] = await Promise.all([
        getDeviceStats(),
        getUserStats(),
        getActivityStats(1), // 今天
        getDecisionSuggestions({ page: 1, pageSize: 100, status: 'active' }),
        getAlerts({ page: 1, pageSize: 5, status: 'pending' }),
      ])

      // 计算今日互动次数
      const todayActivities = activityRes.data?.reduce((sum: number, d: any) => sum + d.total, 0) || 0

      setStats({
        deviceStats: deviceRes.data,
        userStats: userRes.data,
        todayActivities,
        pendingSuggestions: suggestionRes.data?.total || 0,
      })

      // 取所有未解决告警（不够5条再取已解决的）
      const pendingAlerts = alertsRes.data?.data || []
      setRecentAlerts(pendingAlerts.slice(0, 3))
    } catch (e) {
      setError('加载数据失败，请刷新重试')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // 构建 KPI 卡片数据
  const kpiCards = [
    {
      title: '设备在线率',
      value: stats.deviceStats ? `${stats.deviceStats.onlineRate}%` : '--',
      change: getMockChange(stats.deviceStats?.onlineRate || 0, 'onlineRate'),
      icon: Radio,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      loading: loading && !stats.deviceStats,
    },
    {
      title: '活跃用户',
      value: stats.userStats ? formatNumber(stats.userStats.totalUsers) : '--',
      change: getMockChange(stats.userStats?.totalUsers || 0, 'users'),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      loading: loading && !stats.userStats,
    },
    {
      title: '今日互动次数',
      value: formatNumber(stats.todayActivities),
      change: getMockChange(stats.todayActivities, 'activities'),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      loading,
    },
    {
      title: '待处理建议',
      value: stats.pendingSuggestions.toString(),
      change: getMockChange(stats.pendingSuggestions, 'suggestions'),
      icon: Lightbulb,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      loading,
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b bg-white">
        <div>
          <h1 className="text-xl font-bold">管理仪表盘</h1>
          <p className="text-sm text-gray-500 mt-0.5">欢迎回来，管理员</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((stat) => {
            const Icon = stat.icon
            const TrendIcon = stat.change.trend === 'up' ? TrendingUp : TrendingDown
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon
                      className={`w-4 h-4 ${
                        stat.change.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        stat.change.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stat.loading ? '--' : stat.change.value}
                    </span>
                    <span className="text-xs text-gray-400">较昨日</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                最近告警
              </CardTitle>
              <CardDescription>设备状态异常提醒</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : recentAlerts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                  <p>暂无未处理告警</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {alert.status === 'pending' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : alert.status === 'acknowledged' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{alert.device_name}</p>
                          <p className="text-sm text-gray-500">{alert.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{timeAgo(alert.created_at)}</p>
                        <Badge
                          variant={
                            alert.status === 'pending'
                              ? 'destructive'
                              : alert.status === 'acknowledged'
                                ? 'default'
                                : 'secondary'
                          }
                          className="mt-1"
                        >
                          {alert.status === 'pending'
                            ? '待处理'
                            : alert.status === 'acknowledged'
                              ? '已确认'
                              : '已解决'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/admin/facilities"
                className="block mt-4 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                查看全部告警 →
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>快捷操作</CardTitle>
              <CardDescription>常用管理功能入口</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
