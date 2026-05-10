'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { getAlerts, updateAlertStatus } from '@/lib/supabase/admin/queries'
import type { AdminAlertRecord } from '@/lib/supabase/admin/types'

const alertTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  offline: { label: '离线告警', color: 'text-red-600', bgColor: 'bg-red-50' },
  low_battery: { label: '电量低', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  maintenance: { label: '维护模式', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  error: { label: '异常告警', color: 'text-orange-600', bgColor: 'bg-orange-50' },
}

const statusConfig: Record<string, { label: string; variant: 'destructive' | 'default' | 'secondary'; icon: React.ElementType }> = {
  pending: { label: '待处理', variant: 'destructive', icon: AlertCircle },
  acknowledged: { label: '已确认', variant: 'default', icon: Clock },
  resolved: { label: '已解决', variant: 'secondary', icon: CheckCircle2 },
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 7 }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function AlarmTable() {
  const [alerts, setAlerts] = useState<AdminAlertRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // 筛选状态
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const pageSize = 20

  const fetchAlerts = useCallback(async (currentPage = 1) => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getAlerts({
      page: currentPage,
      pageSize,
      alertType: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    })
    if (fetchError) {
      setError(fetchError)
    } else if (data) {
      setAlerts(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }, [typeFilter, statusFilter])

  useEffect(() => {
    setPage(1)
    fetchAlerts(1)
  }, [fetchAlerts])

  // 客户端搜索（搜索设备名+告警信息）
  const filteredAlerts = alerts.filter((alert) => {
    if (!search) return true
    return (
      alert.device_name?.toLowerCase().includes(search.toLowerCase()) ||
      alert.message?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleAcknowledge = async (alertId: string) => {
    setUpdatingId(alertId)
    const { error: updateError } = await updateAlertStatus(alertId, 'acknowledged')
    if (!updateError) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
      )
    }
    setUpdatingId(null)
  }

  const handleResolve = async (alertId: string) => {
    setUpdatingId(alertId)
    const { error: updateError } = await updateAlertStatus(alertId, 'resolved')
    if (!updateError) {
      const now = new Date().toISOString()
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alertId ? { ...a, status: 'resolved', resolved_at: now } : a
        )
      )
    }
    setUpdatingId(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              告警记录
            </CardTitle>
            {!loading && (
              <span className="text-sm text-gray-400">共 {total} 条</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索设备名称..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 pl-9"
              />
            </div>

            {/* 告警类型 */}
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? 'all')}>
              <SelectTrigger className="w-full md:w-36">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="告警类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="offline">离线告警</SelectItem>
                <SelectItem value="low_battery">电量低</SelectItem>
                <SelectItem value="maintenance">维护模式</SelectItem>
                <SelectItem value="error">异常告警</SelectItem>
              </SelectContent>
            </Select>

            {/* 状态筛选 */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? 'all')}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="acknowledged">已确认</SelectItem>
                <SelectItem value="resolved">已解决</SelectItem>
              </SelectContent>
            </Select>

            {/* 刷新 */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchAlerts(page)}
              disabled={loading}
              title="刷新"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>数据加载失败：{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-red-600"
              onClick={() => fetchAlerts(page)}
            >
              重试
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>告警类型</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>告警信息</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>发生时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SkeletonRows />
            ) : filteredAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50 text-green-500" />
                    <p>没有找到匹配的告警记录</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAlerts.map((alert) => {
                const typeConfig = alertTypeConfig[alert.alert_type] ?? {
                  label: alert.alert_type,
                  color: 'text-gray-600',
                  bgColor: 'bg-gray-50',
                }
                const statusInfo = statusConfig[alert.status] ?? {
                  label: alert.status,
                  variant: 'secondary' as const,
                  icon: Clock,
                }
                const StatusIcon = statusInfo.icon
                const isUpdating = updatingId === alert.id

                return (
                  <TableRow
                    key={alert.id}
                    className={alert.status === 'pending' ? 'bg-red-50/50' : ''}
                  >
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${typeConfig.bgColor}`}
                      >
                        <AlertTriangle className={`w-4 h-4 ${typeConfig.color}`} />
                        <span className={`text-sm font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{alert.device_name}</TableCell>
                    <TableCell className="text-gray-600">{alert.message}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {formatTime(alert.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            确认
                          </Button>
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleResolve(alert.id)}
                          >
                            处理
                          </Button>
                        </div>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleResolve(alert.id)}
                        >
                          完成
                        </Button>
                      )}
                      {alert.status === 'resolved' && (
                        <span className="text-sm text-gray-400">
                          {alert.resolved_at ? `已解决 ${formatTime(alert.resolved_at)}` : '已解决'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* 分页 */}
        {!loading && total > pageSize && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-500">
              共 {total} 条，第 {page} / {Math.ceil(total / pageSize)} 页
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / pageSize)}
                onClick={() => setPage((p) => p + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
