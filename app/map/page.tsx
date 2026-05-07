import type { Metadata } from 'next'
import { getDevices } from '@/lib/supabase/queries'
import type { Device } from '@/lib/supabase/types'
import { MapPageClient } from './MapPageClient'

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
  let devices: Device[] = MOCK_DEVICES
  try {
    const { data, error } = await getDevices()
    if (!error && data && data.length > 0) {
      devices = data
    }
  } catch {
    // Supabase 未配置，使用 Mock 数据
  }

  return <MapPageClient devices={devices} />
}
