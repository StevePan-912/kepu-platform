import { NextRequest, NextResponse } from 'next/server'
import { getResidentPortrait, getResidentSearchProfile, getResidentPointTrend, getResidentPreference } from '@/lib/supabase/resident'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/user/portrait
 * 获取当前登录用户的完整居民画像
 * Query params:
 *   - days?: number  积分趋势/偏好分析时间窗口，默认 30
 *   - include?: string  逗号分隔，选择性加载模块
 *     可选值: portrait,search,points,preference（默认全部）
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') ?? '30', 10), 90)
    const include = (searchParams.get('include') ?? 'portrait,search,points,preference').split(',')

    // 按需并行加载各模块
    const [portraitRes, searchRes, pointsRes, prefRes] = await Promise.all([
      include.includes('portrait') ? getResidentPortrait(user.id) : Promise.resolve(null),
      include.includes('search') ? getResidentSearchProfile(user.id) : Promise.resolve(null),
      include.includes('points') ? getResidentPointTrend(user.id, days) : Promise.resolve(null),
      include.includes('preference') ? getResidentPreference(user.id, days) : Promise.resolve(null),
    ])

    return NextResponse.json(apiSuccess({
      portrait: portraitRes?.data ?? null,
      search_profile: searchRes?.data ?? null,
      point_trend: pointsRes?.data ?? null,
      preference: prefRes?.data ?? null,
    }))
  } catch (err) {
    console.error('[API Route Error]', '/api/user/portrait', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
