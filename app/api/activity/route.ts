import { NextRequest, NextResponse } from 'next/server'
import { recordActivity, getUserActivities, getActivityStats, upsertHotWord } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/utils/rate-limit'

/**
 * GET /api/activity
 * 获取当前用户的行为记录
 * Query params:
 *   - limit?: number  默认 50
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)

    const { data, error } = await getUserActivities(user.id, limit)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/activity', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}

/**
 * POST /api/activity
 * 上报用户行为（搜索/浏览/设备扫码等）
 * Body: {
 *   action_type: string
 *   search_keyword?: string
 *   duration_seconds?: number
 *   resource_id?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = checkRateLimit({
      identifier: getRateLimitIdentifier(request, '/api/activity'),
      maxRequests: 30,
      windowSeconds: 60
    })
    if (rateLimitResult.limited) {
      return NextResponse.json({ success: false, error: '请求过于频繁，请稍后再试' }, { status: 429 })
    }

    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const body = await request.json()
    const { action_type, search_keyword, duration_seconds, resource_id } = body as { action_type?: string; search_keyword?: string; duration_seconds?: number; resource_id?: string }

    if (!action_type) return NextResponse.json(apiError('缺少参数 action_type'), { status: 400 })

    const VALID_ACTIONS = ['play_audio', 'scan_ar', 'search', 'feedback', 'join_activity', 'view_resource']
    if (action_type && !VALID_ACTIONS.includes(action_type)) {
      return NextResponse.json(apiError('无效的行为类型'), { status: 400 })
    }
    if (search_keyword && search_keyword.length > 200) {
      return NextResponse.json(apiError('搜索关键词过长'), { status: 400 })
    }

    // 记录行为
    const { error } = await recordActivity({
      user_id: user.id,
      action: action_type as 'play_audio' | 'scan_ar' | 'search' | 'feedback' | 'join_activity' | 'view_resource',
      keyword: search_keyword ?? null,
      duration: duration_seconds ?? null,
      resource_id: resource_id ?? null,
    })
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    // 如果是搜索行为，同步更新热词
    if (action_type === 'search' && search_keyword) {
      await upsertHotWord(search_keyword, 'daily')
      await upsertHotWord(search_keyword, 'weekly')
    }

    return NextResponse.json(apiSuccess({ message: '记录成功' }), { status: 201 })
  } catch (err) {
    console.error('[API Route Error]', '/api/activity', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
