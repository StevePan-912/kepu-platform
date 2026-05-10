'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
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
  Radio,
  Monitor,
  Smartphone,
  Star,
  Search,
  Filter,
  MoreHorizontal,
  Battery,
  Clock,
  MapPin,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { getDevices } from '@/lib/supabase/admin/queries'

// 设备类型映射
const deviceTypeIcons: Record<string, React.ElementType> = {
  audio_station: Radio,
  screen: Monitor,
  ar_point: Smartphone,
  star_corner: Star,
}

const deviceTypeLabels: Record<string, string> = {
  audio_station: '语音导览点',
  screen: '资讯屏',
  ar_point: 'AR互动点',
  star_corner: '星空角',
}

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-red-500',
  maintenance: 'bg-yellow-500',
}

const statusLabels: Record<string, string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护中',
}

// 格式化最后活跃时间
function formatLastActive(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}小时前`
  return `${Math.floor(diffHours / 24)}天前`
}

// 骨架屏占位行
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

export function DeviceStatusList() {
  const [devices, setDevices] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 筛选条件（客户端筛选，数据量小时更流畅）
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const pageSize = 20

  const fetchDevices = useCallback(async (currentPage = 1) => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getDevices({ page: currentPage, pageSize })
    if (fetchError) {
      setError(fetchError)
    } else if (data) {
      setDevices(data.data)
      setTotal(data.total)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDevices(page)
  }, [fetchDevices, page])

  // 客户端筛选
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name?.toLowerCase().includes(search.toLowerCase()) ||
      device.location?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || device.type === typeFilter
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle>设备状态列表</CardTitle>
            {!loading && (
              <span className="text-sm text-gray-400">共 {total} 台</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索设备名称或位置..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 pl-9"
              />
            </div>

            {/* 类型筛选 */}
            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val ?? 'all')}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="设备类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="audio_station">语音导览点</SelectItem>
                <SelectItem value="screen">资讯屏</SelectItem>
                <SelectItem value="ar_point">AR互动点</SelectItem>
                <SelectItem value="star_corner">星空角</SelectItem>
              </SelectContent>
            </Select>

            {/* 状态筛选 */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? 'all')}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
                <SelectItem value="maintenance">维护中</SelectItem>
              </SelectContent>
            </Select>

            {/* 刷新 */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchDevices(page)}
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
              className="ml-auto text-red-600 hover:text-red-700"
              onClick={() => fetchDevices(page)}
            >
              重试
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>设备名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>电量</TableHead>
              <TableHead>最后活跃</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <SkeletonRows />
            ) : filteredDevices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{error ? '加载失败，请重试' : '没有找到匹配的设备'}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDevices.map((device) => {
                const TypeIcon = deviceTypeIcons[device.type] ?? Radio
                return (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            statusColors[device.status] ?? 'bg-gray-400'
                          }`}
                        />
                        <span className="font-medium">{device.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <TypeIcon className="w-4 h-4" />
                        <span>{deviceTypeLabels[device.type] ?? device.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{device.location ?? '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          device.status === 'online'
                            ? 'default'
                            : device.status === 'offline'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {statusLabels[device.status] ?? device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Battery
                          className={`w-4 h-4 ${
                            device.battery_level < 20 ? 'text-red-500' : 'text-green-500'
                          }`}
                        />
                        <span
                          className={
                            device.battery_level < 20 ? 'text-red-500 font-medium' : ''
                          }
                        >
                          {device.battery_level ?? '—'}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {device.last_active ? formatLastActive(device.last_active) : '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/facilities/${device.id}`}
                          className="inline-flex items-center px-3 h-9 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          查看详情
                        </Link>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
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
