'use client'

import { AdminHeader } from '@/components/admin/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Radio,
  Users,
  Activity,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

// 模拟数据 - 后续将从 Supabase 获取
const dashboardStats = [
  {
    title: '设备在线率',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: Radio,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: '活跃用户',
    value: '1,234',
    change: '+156',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: '今日互动次数',
    value: '3,567',
    change: '-12',
    trend: 'down',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: '待处理建议',
    value: '8',
    change: '+3',
    trend: 'up',
    icon: Lightbulb,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

const recentAlerts = [
  { id: 1, device: 'AR互动点-01', type: '离线告警', time: '5分钟前', status: 'critical' },
  { id: 2, device: '资讯屏-03', type: '电量低', time: '15分钟前', status: 'warning' },
  { id: 3, device: '星空角-02', type: '离线告警', time: '1小时前', status: 'resolved' },
]

const quickActions = [
  { label: '查看所有设备', href: '/admin/facilities', icon: Radio },
  { label: '数据分析报告', href: '/admin/analytics', icon: Activity },
  { label: '智能决策建议', href: '/admin/decisions', icon: Lightbulb },
]

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader
        title="管理仪表盘"
        subtitle="欢迎回来，管理员"
      />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
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
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon
                      className={`w-4 h-4 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {stat.change}
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
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {alert.status === 'critical' ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : alert.status === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{alert.device}</p>
                        <p className="text-sm text-gray-500">{alert.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{alert.time}</p>
                      <Badge
                        variant={
                          alert.status === 'critical'
                            ? 'destructive'
                            : alert.status === 'warning'
                              ? 'default'
                              : 'secondary'
                        }
                        className="mt-1"
                      >
                        {alert.status === 'critical'
                          ? '紧急'
                          : alert.status === 'warning'
                            ? '警告'
                            : '已解决'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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
                    <a
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </a>
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
