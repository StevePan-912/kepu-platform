/**
 * 居民端专用查询函数
 * 为成员2（居民端UI）和成员3（数据展示）提供封装好的数据查询
 */
import { supabase } from '@/lib/supabase/client'
import type {
  ResidentPortrait,
  ResidentSearchProfile,
  PointTrendItem,
  ResidentPreference,
  ResidentActivitySummary,
} from './types'

// ============================================================
// 居民画像（综合查询）
// ============================================================

/**
 * 获取居民完整画像
 * 并行查询用户基础信息、行为统计、积分流水、志愿记录、兑换记录
 */
export async function getResidentPortrait(
  userId: string
): Promise<{ data: ResidentPortrait | null; error: string | null }> {
  try {
    const [
      userRes,
      activitiesRes,
      pointsRes,
      volunteerRes,
      exchangesRes,
    ] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single() as unknown as { data: any; error: any },
      supabase.from('user_activities').select('action, created_at').eq('user_id', userId) as unknown as { data: { action: string; created_at: string }[] | null; error: any },
      supabase.from('point_records').select('points, created_at').eq('user_id', userId) as unknown as { data: { points: number; created_at: string }[] | null; error: any },
      supabase.from('volunteer_records').select('status, task_id').eq('user_id', userId) as unknown as { data: { status: string; task_id: string }[] | null; error: any },
      supabase.from('exchanges').select('status').eq('user_id', userId) as unknown as { data: { status: string }[] | null; error: any },
    ])

    if (userRes.error) throw userRes.error
    const user = userRes.data

    // 行为分解统计
    const activityBreakdown: Record<string, number> = {}
    let lastActiveAt: string | null = null
    const activities = activitiesRes.data ?? []
    for (const act of activities) {
      activityBreakdown[act.action] = (activityBreakdown[act.action] ?? 0) + 1
      if (!lastActiveAt || act.created_at > lastActiveAt) {
        lastActiveAt = act.created_at
      }
    }

    // 积分流水统计
    const pointRecords = pointsRes.data ?? []
    const totalEarned = pointRecords.filter((p) => p.points > 0).reduce((s, p) => s + p.points, 0)
    const totalSpent = pointRecords.filter((p) => p.points < 0).reduce((s, p) => s + Math.abs(p.points), 0)

    // 志愿参与统计
    const volunteerRecords = volunteerRes.data ?? []
    const tasksCompleted = volunteerRecords.filter((r) => r.status === 'completed').length

    // 兑换统计
    const exchanges = exchangesRes.data ?? []
    const pendingExchanges = exchanges.filter((e) => e.status === 'pending').length

    return {
      data: {
        user_id: userId,
        nickname: user.nickname,
        phone: user.phone,
        role: user.role,
        points: user.points,
        honor_level: user.honor_level,
        created_at: user.created_at,
        total_activities: activities.length,
        activity_breakdown: activityBreakdown,
        last_active_at: lastActiveAt,
        total_earned_points: totalEarned,
        total_spent_points: totalSpent,
        point_records_count: pointRecords.length,
        volunteer_tasks_joined: volunteerRecords.length,
        volunteer_tasks_completed: tasksCompleted,
        total_exchanges: exchanges.length,
        pending_exchanges: pendingExchanges,
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

/**
 * 批量获取居民活跃度摘要（用于排行榜 / 成员3数据展示）
 * @param limit 最多返回条数，默认 50
 */
export async function getResidentActivitySummaries(
  limit = 50
): Promise<{ data: ResidentActivitySummary[] | null; error: string | null }> {
  try {
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, nickname, honor_level, points')
      .order('points', { ascending: false })
      .limit(limit) as unknown as { data: { id: string; nickname: string; honor_level: string | null; points: number }[] | null; error: any }

    if (userErr) throw userErr

    const userIds = (users ?? []).map((u) => u.id)
    if (!userIds.length) return { data: [], error: null }

    // 批量查最后活跃时间
    const { data: activities } = await supabase
      .from('user_activities')
      .select('user_id, created_at')
      .in('user_id', userIds)
      .order('created_at', { ascending: false }) as unknown as { data: { user_id: string; created_at: string }[] | null; error: any }

    // 每用户最后活跃时间 & 活动总数
    const lastActiveMap = new Map<string, string>()
    const countMap = new Map<string, number>()
    for (const act of activities ?? []) {
      if (!lastActiveMap.has(act.user_id)) {
        lastActiveMap.set(act.user_id, act.created_at)
      }
      countMap.set(act.user_id, (countMap.get(act.user_id) ?? 0) + 1)
    }

    const result: ResidentActivitySummary[] = (users ?? []).map((u) => ({
      user_id: u.id,
      nickname: u.nickname,
      honor_level: u.honor_level,
      points: u.points,
      total_activities: countMap.get(u.id) ?? 0,
      last_active_at: lastActiveMap.get(u.id) ?? null,
    }))

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ============================================================
// 搜索行为分析
// ============================================================

/**
 * 获取用户搜索画像（热门词 + 偏好分类）
 */
export async function getResidentSearchProfile(
  userId: string,
  topN = 10
): Promise<{ data: ResidentSearchProfile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('keyword')
      .eq('user_id', userId)
      .eq('action', 'search')
      .not('keyword', 'is', null) as unknown as { data: { keyword: string | null }[] | null; error: any }

    if (error) throw error

    const keywordCount: Record<string, number> = {}
    for (const act of data ?? []) {
      const kw = act.keyword!
      keywordCount[kw] = (keywordCount[kw] ?? 0) + 1
    }

    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([keyword, count]) => ({ keyword, count }))

    return {
      data: {
        user_id: userId,
        top_keywords: topKeywords,
        search_count: (data ?? []).length,
        categories_interested: [],  // 需要关联资源表时扩展
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ============================================================
// 积分趋势
// ============================================================

/**
 * 获取用户积分变化趋势（按天，最近 N 天）
 */
export async function getResidentPointTrend(
  userId: string,
  days = 30
): Promise<{ data: PointTrendItem[] | null; error: string | null }> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('point_records')
      .select('points, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true }) as unknown as { data: { points: number; created_at: string }[] | null; error: any }

    if (error) throw error

    // 按日期分组
    const dayMap = new Map<string, { earned: number; spent: number }>()
    for (const record of data ?? []) {
      const date = record.created_at.split('T')[0]
      const cur = dayMap.get(date) ?? { earned: 0, spent: 0 }
      if (record.points > 0) cur.earned += record.points
      else cur.spent += Math.abs(record.points)
      dayMap.set(date, cur)
    }

    // 补全连续日期
    const result: PointTrendItem[] = []
    for (let i = 0; i <= days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - days + i)
      const dateStr = d.toISOString().split('T')[0]
      const { earned, spent } = dayMap.get(dateStr) ?? { earned: 0, spent: 0 }
      result.push({ date: dateStr, earned, spent, net: earned - spent })
    }

    return { data: result, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

// ============================================================
// 科普偏好分析
// ============================================================

/**
 * 获取居民科普偏好（浏览资源的分类/类型分布）
 */
export async function getResidentPreference(
  userId: string,
  days = 30
): Promise<{ data: ResidentPreference | null; error: string | null }> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('user_activities')
      .select('duration, resources:resource_id(category, type)')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .not('resource_id', 'is', null) as unknown as { data: any[] | null; error: any }

    if (error) throw error

    const catCount: Record<string, number> = {}
    const typeCount: Record<string, number> = {}
    let totalDuration = 0
    const total = (data ?? []).length

    for (const act of data ?? []) {
      const res = act.resources as { category: string; type: string } | null
      if (res?.category) catCount[res.category] = (catCount[res.category] ?? 0) + 1
      if (res?.type) typeCount[res.type] = (typeCount[res.type] ?? 0) + 1
      totalDuration += act.duration ?? 0
    }

    const toPercent = (count: number) =>
      total > 0 ? Math.round((count / total) * 1000) / 10 : 0

    return {
      data: {
        user_id: userId,
        favorite_categories: Object.entries(catCount)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => ({ category, count, percentage: toPercent(count) })),
        favorite_types: Object.entries(typeCount)
          .sort((a, b) => b[1] - a[1])
          .map(([type, count]) => ({ type, count, percentage: toPercent(count) })),
        total_view_duration: totalDuration,
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}
