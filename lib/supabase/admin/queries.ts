// @ts-nocheck
import { supabase } from '@/lib/supabase/client'
import type {
  AdminDeviceStats,
  AdminActivityStats,
  AdminUserStats,
  AdminAlertRecord,
  AdminDecisionSuggestion,
  AdminResourceStats,
  AdminUserGrowthStats,
  CategoryDistributionItem,
  PaginationParams,
  PaginatedResponse,
} from './types'

// ==================== 设备管理 ====================

/**
 * 获取设备统计信息
 */
export async function getDeviceStats(): Promise<{ data: AdminDeviceStats | null; error: string | null }> {
  try {
    const { data, count, error } = await supabase
      .from('devices')
      .select('status')

    if (error) throw error

    const stats = {
      total: count || 0,
      online: 0,
      offline: 0,
      maintenance: 0,
      onlineRate: 0,
    }

    data?.forEach((device) => {
      if (device.status === 'online') stats.online++
      else if (device.status === 'offline') stats.offline++
      else if (device.status === 'maintenance') stats.maintenance++
    })

    stats.onlineRate = stats.total > 0 ? Math.round((stats.online / stats.total) * 1000) / 10 : 0

    return { data: stats, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 获取设备列表（支持分页）
 */
export async function getDevices(
  params: PaginationParams = { page: 1, pageSize: 20 }
): Promise<{ data: PaginatedResponse<any> | null; error: string | null }> {
  try {
    const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('devices')
      .select('*', { count: 'exact' })

    // 排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // 分页
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 获取单个设备详情
 */
export async function getDeviceById(
  deviceId: string
): Promise<{ data: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 用户统计 ====================

/**
 * 获取用户统计信息
 */
export async function getUserStats(): Promise<{ data: AdminUserStats | null; error: string | null }> {
  try {
    // 获取用户总数和积分平均
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('points, honor_level, created_at')

    if (usersError) throw usersError

    // 统计今日新用户
    const today = new Date().toISOString().split('T')[0]
    const newUsersToday = users?.filter(
      (u) => u.created_at?.startsWith(today)
    ).length || 0

    // 计算荣誉等级分布
    const honorDistribution = { explorer: 0, communicator: 0, leader: 0 }
    let totalPoints = 0

    users?.forEach((user) => {
      if (user.honor_level === 'explorer') honorDistribution.explorer++
      else if (user.honor_level === 'communicator') honorDistribution.communicator++
      else if (user.honor_level === 'leader') honorDistribution.leader++
      totalPoints += user.points || 0
    })

    return {
      data: {
        totalUsers: users?.length || 0,
        activeUsers: users?.length || 0, // TODO: 需要基于最近活动时间计算
        newUsersToday,
        avgPoints: users?.length ? Math.round(totalPoints / users.length) : 0,
        honorDistribution,
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 活动统计 ====================

/**
 * 获取活动统计数据
 */
export async function getActivityStats(
  days: number = 7
): Promise<{ data: AdminActivityStats[] | null; error: string | null }> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('user_activities')
      .select('action_type, created_at')
      .gte('created_at', startDate.toISOString())

    if (error) throw error

    // 按日期分组统计
    const statsMap = new Map<string, AdminActivityStats>()

    data?.forEach((activity) => {
      const date = activity.created_at.split('T')[0]
      if (!statsMap.has(date)) {
        statsMap.set(date, {
          date,
          playAudio: 0,
          scanAr: 0,
          search: 0,
          feedback: 0,
          activityJoin: 0,
          total: 0,
        })
      }

      const stats = statsMap.get(date)!
      switch (activity.action_type) {
        case 'play_audio':
          stats.playAudio++
          break
        case 'scan_ar':
          stats.scanAr++
          break
        case 'search':
          stats.search++
          break
        case 'feedback':
          stats.feedback++
          break
        case 'activity_join':
          stats.activityJoin++
          break
      }
      stats.total++
    })

    // 转换为数组并排序
    const result = Array.from(statsMap.values()).sort(
      (a, b) => a.date.localeCompare(b.date)
    )

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 决策建议 ====================

/**
 * 获取决策建议列表
 */
export async function getDecisionSuggestions(
  params: PaginationParams = { page: 1, pageSize: 20 }
): Promise<{ data: PaginatedResponse<AdminDecisionSuggestion> | null; error: string | null }> {
  try {
    const { page, pageSize } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('decision_suggestions')
      .select('*', { count: 'exact' })
      .order('priority', { ascending: false })
      .range(from, to)

    if (error) throw error

    return {
      data: {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 更新决策建议状态
 */
export async function updateSuggestionStatus(
  suggestionId: string,
  isActive: boolean
): Promise<{ data: any | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('decision_suggestions')
      .update({ is_active: isActive })
      .eq('id', suggestionId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 告警管理 ====================

/**
 * 获取告警统计（待处理数量）
 */
export async function getAlertStats(): Promise<{ data: { pending: number; acknowledged: number; resolved: number; total: number } | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('device_alerts')
      .select('status')

    if (error) throw error

    const stats = { pending: 0, acknowledged: 0, resolved: 0, total: data?.length || 0 }
    data?.forEach((alert) => {
      if (alert.status === 'pending') stats.pending++
      else if (alert.status === 'acknowledged') stats.acknowledged++
      else if (alert.status === 'resolved') stats.resolved++
    })

    return { data: stats, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 获取告警列表（支持分页+筛选）
 */
export async function getAlerts(
  params: PaginationParams & { alertType?: string; status?: string } = { page: 1, pageSize: 20 }
): Promise<{ data: PaginatedResponse<AdminAlertRecord> | null; error: string | null }> {
  try {
    const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc', alertType, status } = params
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('device_alerts')
      .select(`
        id,
        device_id,
        alert_type,
        message,
        status,
        created_at,
        resolved_at,
        devices:devices ( name )
      `, { count: 'exact' })

    if (alertType && alertType !== 'all') {
      query = query.eq('alert_type', alertType)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' }).range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    // 拍平 device name
    const records: AdminAlertRecord[] = (data || []).map((item: any) => ({
      id: item.id,
      device_id: item.device_id,
      device_name: item.devices?.name ?? item.device_id,
      alert_type: item.alert_type,
      message: item.message,
      status: item.status,
      created_at: item.created_at,
      resolved_at: item.resolved_at ?? undefined,
    }))

    return {
      data: {
        data: records,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 更新告警状态
 */
export async function updateAlertStatus(
  alertId: string,
  status: 'acknowledged' | 'resolved'
): Promise<{ data: any | null; error: string | null }> {
  try {
    const updatePayload: Record<string, any> = { status }
    if (status === 'resolved') {
      updatePayload.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('device_alerts')
      .update(updatePayload)
      .eq('id', alertId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 资源使用排行 ====================

/**
 * 获取资源使用排行
 */
export async function getResourceRanking(
  limit: number = 10
): Promise<{ data: any[] | null; error: string | null }> {
  try {
    // 通过 user_activities 统计每个资源的互动次数
    const { data, error } = await supabase
      .from('user_activities')
      .select(`
        resource_id,
        resources:resources (
          id,
          title,
          category,
          type
        )
      `)
      .not('resource_id', 'is', null)

    if (error) throw error

    // 统计每个资源的访问次数
    const countMap = new Map<string, { count: number; resource: any }>()

    data?.forEach((activity) => {
      if (activity.resource_id && activity.resources) {
        const current = countMap.get(activity.resource_id) || { count: 0, resource: activity.resources }
        current.count++
        countMap.set(activity.resource_id, current)
      }
    })

    // 转换为数组并排序
    const result = Array.from(countMap.entries())
      .map(([id, { count, resource }]) => ({ ...resource, interactionCount: count }))
      .sort((a, b) => b.interactionCount - a.interactionCount)
      .slice(0, limit)

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 数据分析 ====================

/**
 * 获取资源统计信息（总数、分类分布、类型分布）
 */
export async function getResourceStats(): Promise<{ data: AdminResourceStats | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('category, type')

    if (error) throw error

    const categoryDistribution: Record<string, number> = {}
    const typeDistribution: Record<string, number> = {}

    data?.forEach((resource) => {
      if (resource.category) {
        categoryDistribution[resource.category] = (categoryDistribution[resource.category] || 0) + 1
      }
      if (resource.type) {
        typeDistribution[resource.type] = (typeDistribution[resource.type] || 0) + 1
      }
    })

    return {
      data: {
        total: data?.length || 0,
        categoryDistribution,
        typeDistribution,
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 获取用户增长趋势（按日新增 + 累计）
 * @param days 查询最近 N 天
 */
export async function getUserGrowthStats(
  days: number = 30
): Promise<{ data: AdminUserGrowthStats[] | null; error: string | null }> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    // 按日期聚合
    const growthMap = new Map<string, number>()
    data?.forEach((user) => {
      const date = user.created_at.split('T')[0]
      growthMap.set(date, (growthMap.get(date) || 0) + 1)
    })

    // 生成连续日期数组（补 0）
    const result: AdminUserGrowthStats[] = []
    let cumulative = 0
    for (let i = 0; i <= days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - days + i)
      const dateStr = d.toISOString().split('T')[0]
      const newUsers = growthMap.get(dateStr) || 0
      cumulative += newUsers
      result.push({ date: dateStr, newUsers, cumulativeUsers: cumulative })
    }

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 获取资源分类分布（饼图数据）
 */
export async function getCategoryDistribution(): Promise<{ data: CategoryDistributionItem[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('category')

    if (error) throw error

    const total = data?.length || 0
    const categoryCount: Record<string, number> = {}

    data?.forEach((resource) => {
      const cat = resource.category || '未分类'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })

    const result: CategoryDistributionItem[] = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count)

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ==================== 导出功能 ====================

/**
 * 导出数据为 CSV 格式
 */
export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}
