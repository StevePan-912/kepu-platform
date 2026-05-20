/**
 * 居民端专用类型定义
 * 供成员2（前端居民端）和成员3（数据展示层）使用
 */

// 居民画像（综合用户行为、积分、荣誉数据）
export interface ResidentPortrait {
  // 基础信息
  user_id: string
  nickname: string | null
  phone: string | null
  role: string
  points: number
  honor_level: string | null
  created_at: string

  // 行为统计
  total_activities: number
  activity_breakdown: Record<string, number>  // { search: 5, view_resource: 10, ... }
  last_active_at: string | null

  // 积分统计
  total_earned_points: number    // 历史累计获得积分
  total_spent_points: number     // 历史累计消费积分
  point_records_count: number

  // 志愿参与
  volunteer_tasks_joined: number
  volunteer_tasks_completed: number

  // 商城兑换
  total_exchanges: number
  pending_exchanges: number
}

// 用户活跃度摘要（轻量版，用于列表展示）
export interface ResidentActivitySummary {
  user_id: string
  nickname: string | null
  honor_level: string | null
  points: number
  total_activities: number
  last_active_at: string | null
}

// 用户搜索行为分析
export interface ResidentSearchProfile {
  user_id: string
  top_keywords: { keyword: string; count: number }[]
  search_count: number
  categories_interested: string[]
}

// 积分变化趋势（按天）
export interface PointTrendItem {
  date: string
  earned: number
  spent: number
  net: number
}

// 居民科普偏好
export interface ResidentPreference {
  user_id: string
  favorite_categories: { category: string; count: number; percentage: number }[]
  favorite_types: { type: string; count: number; percentage: number }[]
  total_view_duration: number  // 总阅览时长（秒）
}
