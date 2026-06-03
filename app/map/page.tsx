import type { Metadata } from 'next'
import { getDevices } from '@/lib/supabase/queries'
import type { Device } from '@/lib/supabase/types'
import { MapPageClient } from './MapPageClient'

export const metadata: Metadata = {
  title: '资源地图 - 科普漫步',
  description: '查看周边科普设施点位、实时状态与科普内容',
}

// Mock 数据（Supabase 未连接时的展示数据，坐标对应真实地标）
const MOCK_DEVICES: Device[] = [
  {
    id: 'dev-001',
    name: '科普点播盒·北京展览馆',
    address: '西城区展览馆路·北京展览馆南门广场',
    latitude: 39.9389,
    longitude: 116.3380,
    type: 'audio_station',
    status: 'online',
    battery_level: 82,
    last_active_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-002',
    name: '智慧资讯屏·车公庄西站',
    address: '西城区车公庄大街·车公庄西地铁站A口',
    latitude: 39.9311,
    longitude: 116.3380,
    type: 'screen',
    status: 'online',
    battery_level: 100,
    last_active_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-003',
    name: 'AR探境·动物园科普馆',
    address: '西城区西直门外大街137号·北京动物园科普馆',
    latitude: 39.9386,
    longitude: 116.3333,
    type: 'ar_point',
    status: 'online',
    battery_level: 67,
    last_active_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-004',
    name: '星空角·西外文化广场',
    address: '西城区西直门外·西外文化休闲广场',
    latitude: 39.9408,
    longitude: 116.3388,
    type: 'star_corner',
    status: 'maintenance',
    battery_level: 45,
    last_active_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-005',
    name: '科普点播盒·百万庄社区',
    address: '西城区百万庄中里·社区服务站门前',
    latitude: 39.9305,
    longitude: 116.3390,
    type: 'audio_station',
    status: 'offline',
    battery_level: 12,
    last_active_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev-006',
    name: 'AR探境·展览路一小',
    address: '西城区百万庄中里7号·展览路第一小学',
    latitude: 39.9315,
    longitude: 116.3440,
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
