import type { Metadata } from 'next'
import { getDevices } from '@/lib/supabase/queries'
import type { Device } from '@/lib/supabase/types'
import { DEVICE_TYPES } from '@/lib/constants/categories'
import Link from 'next/link'
import { MapWrapper } from '@/components/map/MapWrapper'

export const metadata: Metadata = {
  title: '资源地图 - 科普漫步',
  description: '查看周边科普设施点位、实时状态与科普内容',
}

// Mock 数据（Supabase 未连接时的展示数据）
const MOCK_DEVICES: Device[] = [
  {
    id: 'dev-001',
    name: '展览路科普点播盒1号',
    location: '展览路街道文化中心门口',
    lat: 31.2720,
    lng: 121.5168,
    type: 'audio_station',
    status: 'online',
    battery_level: 82,
    last_active: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-002',
    name: '展览路智慧资讯屏A',
    location: '展览路地铁站出口',
    lat: 31.2735,
    lng: 121.5150,
    type: 'screen',
    status: 'online',
    battery_level: 100,
    last_active: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-003',
    name: 'AR探境点-古生物',
    location: '展览路社区花园北角',
    lat: 31.2708,
    lng: 121.5185,
    type: 'ar_point',
    status: 'online',
    battery_level: 67,
    last_active: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-004',
    name: '星空角观测站',
    location: '展览路公园观景台',
    lat: 31.2698,
    lng: 121.5172,
    type: 'star_corner',
    status: 'maintenance',
    battery_level: 45,
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-005',
    name: '展览路点播盒2号',
    location: '居委会服务点',
    lat: 31.2742,
    lng: 121.5190,
    type: 'audio_station',
    status: 'offline',
    battery_level: 12,
    last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'dev-006',
    name: 'AR探境点-天文',
    location: '展览路小学操场',
    lat: 31.2715,
    lng: 121.5155,
    type: 'ar_point',
    status: 'online',
    battery_level: 91,
    last_active: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

export default async function MapPage() {
  // 尝试从 Supabase 拉取数据，失败则使用 Mock 数据
  let devices: Device[] = MOCK_DEVICES
  try {
    const { data, error } = await getDevices()
    if (!error && data && data.length > 0) {
      devices = data
    }
  } catch {
    // Supabase 未配置，使用 Mock 数据
  }

  const onlineCount = devices.filter((d) => d.status === 'online').length
  const typeStats = Object.entries(DEVICE_TYPES).map(([key, info]) => ({
    key,
    label: info.label,
    count: devices.filter((d) => d.type === key).length,
  }))

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-xl leading-none">
          ←
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900 text-base leading-tight">资源地图</h1>
          <p className="text-xs text-gray-400">周边科普设施实时分布</p>
        </div>
        {/* 在线统计 */}
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-700">{onlineCount} 在线</span>
        </div>
      </header>

      {/* 设备类型快捷统计条 */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-4 overflow-x-auto shrink-0">
        {typeStats.map(({ key, label, count }) => (
          <div key={key} className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-semibold text-gray-800 bg-gray-100 rounded-full px-1.5 py-0.5">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* 地图主体 */}
      <div className="flex-1 relative overflow-hidden">
        <MapWrapper devices={devices} />
      </div>

      {/* 底部提示 */}
      <div className="bg-white border-t border-gray-100 px-4 py-2 text-center shrink-0">
        <p className="text-xs text-gray-400">点击地图标记查看设备详情 · 支持拖拽和缩放</p>
      </div>
    </div>
  )
}
