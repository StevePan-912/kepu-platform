import { NextRequest, NextResponse } from 'next/server'
import { getActivityStats } from '@/lib/supabase/queries'
import { createServerClient } from '@/lib/supabase/client'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/admin/stats
 * 管理员专用 - 获取平台统计数据
 * Query params:
 *   - days?: number  统计最近 N 天，默认 7
 *
 * 需要 Admin 角色（middleware 已做路由保护，此处做双重校验）
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    // 双重验证：确认是 admin 角色
    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const serviceClient = createServerClient()
    const { data: userRecord, error: roleError } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null; error: any }

    if (roleError || userRecord?.role !== 'admin') {
      return NextResponse.json(apiError('权限不足'), { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') ?? '7', 10), 90)

    // 并行拉取各维度统计
    const [activityRes, usersRes, resourcesRes, devicesRes] = await Promise.all([
      getActivityStats(days),
      serviceClient.from('users').select('id, role, created_at', { count: 'exact' }) as any,
      serviceClient.from('resources').select('id', { count: 'exact' }) as any,
      serviceClient.from('devices').select('id, status', { count: 'exact' }) as any,
    ])

    // 按日期聚合行为数据
    const activityByDate: Record<string, number> = {}
    if (activityRes.data) {
      for (const row of (activityRes.data as any[])) {
        const date = row.created_at.split('T')[0]
        activityByDate[date] = (activityByDate[date] ?? 0) + 1
      }
    }

    const onlineDevices = (devicesRes.data as any[])?.filter((d: any) => d.status === 'online').length ?? 0

    return NextResponse.json(apiSuccess({
      period_days: days,
      total_users: usersRes.count ?? 0,
      total_resources: resourcesRes.count ?? 0,
      total_devices: devicesRes.count ?? 0,
      online_devices: onlineDevices,
      activity_trend: activityByDate,
    }))
  } catch (err) {
    console.error('[API Route Error]', '/api/admin/stats', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
