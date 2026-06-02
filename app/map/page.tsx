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
    address: '展览路街道文化中心门口',
    latitude: 39.9338,
    longitude: 116.3490,
    type: 'audio_station',
    status: 'online',
    battery_level: 82,
    last_active_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-002',
    name: '展览路智慧资讯屏A',
    address: '展览路地铁站出口',
    latitude: 39.9355,
    longitude: 116.3475,
    type: 'screen',
    status: 'online',
    battery_level: 100,
    last_active_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-003',
    name: 'AR探境点-古生物',
    address: '展览路社区花园北角',
    latitude: 39.9308,
    longitude: 116.3525,
    type: 'ar_point',
    status: 'online',
    battery_level: 67,
    last_active_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-004',
    name: '星空角观测站',
    address: '展览路公园观景台',
    latitude: 39.9298,
    longitude: 116.3542,
    type: 'star_corner',
    status: 'maintenance',
    battery_level: 45,
    last_active_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-005',
    name: '展览路点播盒2号',
    address: '居委会服务点',
    latitude: 39.9362,
    longitude: 116.3540,
    type: 'audio_station',
    status: 'offline',
    battery_level: 12,
    last_active_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-006',
    name: 'AR探境点-天文',
    address: '展览路小学操场',
    latitude: 39.9315,
    longitude: 116.3465,
    type: 'ar_point',
    status: 'online',
    battery_level: 91,
    last_active_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
