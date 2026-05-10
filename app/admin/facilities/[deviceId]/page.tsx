'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Radio,
  Monitor,
  Smartphone,
  Star,
  MapPin,
  Battery,
  Clock,
  Activity,
  Settings,
  History,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { getDeviceById } from '@/lib/supabase/admin/queries'

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

const statusConfig: Record<string, { label: string; color: string; bgColor: string; badgeVariant: 'default' | 'destructive' | 'secondary' }> = {
  online: { label: '在线', color: 'text-green-600', bgColor: 'bg-green-50', badgeVariant: 'default' },
  offline: { label: '离线', color: 'text-red-600', bgColor: 'bg-red-50', badgeVariant: 'destructive' },
  maintenance: { label: '维护中', color: 'text-yellow-600', bgColor: 'bg-yellow-50', badgeVariant: 'secondary' },
}

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

export default function DeviceDetailPage() {
  const params = useParams()
  const deviceId = params.deviceId as string

  const [device, setDevice] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDevice = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getDeviceById(deviceId)
    if (fetchError) {
      setError(fetchError)
    } else {
      setDevice(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (deviceId) fetchDevice()
  }, [deviceId])

  // 加载中骨架
  if (loading) {
    return (
      <div>
        <div className="p-4 lg:p-6 border-b bg-white">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/facilities"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 space-y-2">
              <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="h-8 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !device) {
    return (
      <div>
        <div className="p-4 lg:p-6 border-b bg-white">
          <Link
            href="/admin/facilities"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="p-4 lg:p-6">
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
            <p className="text-lg font-medium mb-2">
              {error ? '设备数据加载失败' : '设备不存在'}
            </p>
            {error && <p className="text-sm text-gray-400 mb-4">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={fetchDevice}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重新加载
              </Button>
              <Link
                href="/admin/facilities"
                className="inline-flex items-center px-4 h-9 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                返回设备列表
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const TypeIcon = deviceTypeIcons[device.type] ?? Radio
  const statusInfo = statusConfig[device.status] ?? statusConfig.offline

  return (
    <div>
      {/* Header */}
      <div className="p-4 lg:p-6 border-b bg-white">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/facilities"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <TypeIcon className="w-6 h-6 text-gray-600" />
              <h1 className="text-xl font-semibold">{device.name}</h1>
              <Badge variant={statusInfo.badgeVariant}>
                <span
                  className={`w-2 h-2 rounded-full mr-1 ${
                    device.status === 'online'
                      ? 'bg-green-500'
                      : device.status === 'offline'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                />
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">{device.location ?? '—'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              配置
            </Button>
            <Button variant="outline" size="sm" onClick={fetchDevice}>
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* 统计卡 */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* 电量 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">电池电量</CardTitle>
              <Battery
                className={`w-5 h-5 ${
                  (device.battery_level ?? 100) < 20 ? 'text-red-500' : 'text-green-500'
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{device.battery_level ?? '—'}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (device.battery_level ?? 100) < 20 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${device.battery_level ?? 0}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 设备类型 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">设备类型</CardTitle>
              <TypeIcon className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {deviceTypeLabels[device.type] ?? device.type}
              </div>
              <p className="text-xs text-gray-400 mt-1">设备分类</p>
            </CardContent>
          </Card>

          {/* 最后活跃 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">最后活跃</CardTitle>
              <Clock className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {device.last_active ? formatLastActive(device.last_active) : '—'}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {device.last_active
                  ? new Date(device.last_active).toLocaleString('zh-CN')
                  : ''}
              </p>
            </CardContent>
          </Card>

          {/* 安装时间 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">安装时间</CardTitle>
              <Activity className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {device.created_at
                  ? new Date(device.created_at).toLocaleDateString('zh-CN')
                  : '—'}
              </div>
              <p className="text-xs text-gray-400 mt-1">设备注册日期</p>
            </CardContent>
          </Card>
        </div>

        {/* 设备信息 */}
        <Card>
          <CardHeader>
            <CardTitle>设备信息</CardTitle>
            <CardDescription>设备基本信息和位置详情</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">设备ID</p>
                <p className="font-medium font-mono text-sm break-all">{device.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">设备名称</p>
                <p className="font-medium">{device.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">设备类型</p>
                <p className="font-medium">{deviceTypeLabels[device.type] ?? device.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">当前状态</p>
                <p className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">电量</p>
                <p
                  className={`font-medium ${
                    (device.battery_level ?? 100) < 20 ? 'text-red-500' : ''
                  }`}
                >
                  {device.battery_level ?? '—'}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">安装日期</p>
                <p className="font-medium">
                  {device.created_at
                    ? new Date(device.created_at).toLocaleDateString('zh-CN')
                    : '—'}
                </p>
              </div>
            </div>

            {/* 位置信息 */}
            {(device.location || device.lat || device.lng) && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">地理位置</p>
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{device.location ?? '未知位置'}</span>
                </div>
                {(device.lat || device.lng) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 ml-6">
                    {device.lat && <span>纬度: {device.lat}</span>}
                    {device.lng && <span>经度: {device.lng}</span>}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
