import { NextRequest, NextResponse } from 'next/server'
import { getResidentActivitySummaries } from '@/lib/supabase/resident'
import { groupByDate, calcPeriodGrowth, daysAgoISO } from '@/lib/utils/stats'
import { createServerClient } from '@/lib/supabase/client'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/stats/residents
 * 居民活跃度统计（管理后台数据大屏 / 成员3数据层使用）
 * Query params:
 *   - days?: number  统计时间窗口，默认 14（用于环比对比）
 *   - limit?: number  排行榜条数，默认 20
 *
 * 需要 admin 角色
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    // 验证管理员权限
    const serviceClient = createServerClient()
    const { data: userRecord } = await serviceClient
      .from('users').select('role').eq('id', user.id).single()
    if (userRecord?.role !== 'admin') {
      return NextResponse.json(apiError('权限不足'), { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') ?? '14', 10), 90)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)

    // 并行查询
    const [activitiesRes, summariesRes] = await Promise.all([
      serviceClient
        .from('user_activities')
        .select('created_at, action_type')
        .gte('created_at', daysAgoISO(days)),
      getResidentActivitySummaries(limit),
    ])

    // 活跃趋势（按天）
    const trend = groupByDate(activitiesRes.data ?? [], days)
    const growth = calcPeriodGrowth(trend)

    return NextResponse.json(apiSuccess({
      period_days: days,
      activity_trend: trend,
      growth,
      leaderboard: summariesRes.data ?? [],
    }))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
