import { Database } from '@/lib/supabase/types'

// Admin 模块专用类型
export interface AdminDeviceStats {
  total: number
  online: number
  offline: number
  maintenance: number
  onlineRate: number
}

export interface AdminActivityStats {
  date: string
  playAudio: number
  scanAr: number
  search: number
  feedback: number
  activityJoin: number
  total: number
}

export interface AdminUserStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  avgPoints: number
  honorDistribution: {
    explorer: number
    communicator: number
    leader: number
  }
}

export interface AdminDecisionSuggestion {
  id: string
  type: 'activity' | 'content' | 'location'
  suggestion_text: string
  priority: number
  is_active: boolean
  created_at: string
  reason?: string
}

export interface AdminAlertRecord {
  id: string
  device_id: string
  device_name: string
  alert_type: 'offline' | 'low_battery' | 'maintenance' | 'error'
  message: string
  status: 'pending' | 'acknowledged' | 'resolved'
  created_at: string
  resolved_at?: string
}

export interface AdminConfigItem {
  key: string
  label: string
  value: string | number | boolean
  type: 'text' | 'number' | 'boolean' | 'select'
  description?: string
  options?: { label: string; value: string }[]
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 资源统计
export interface AdminResourceStats {
  total: number
  categoryDistribution: Record<string, number>
  typeDistribution: Record<string, number>
}

// 用户增长趋势（按日）
export interface AdminUserGrowthStats {
  date: string
  newUsers: number
  cumulativeUsers: number
}

// 分类分布（饼图用）
export interface CategoryDistributionItem {
  category: string
  count: number
  percentage: number
}

// 热门区域分析
export interface HotAreaItem {
  area: string
  activityCount: number
  deviceCount: number
}

// 用户偏好分析
export interface UserPreferenceItem {
  category: string
  count: number
  percentage: number
}

// API 统一响应格式
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
