import { NextRequest, NextResponse } from 'next/server'
import { recordActivity, getUserActivities, getActivityStats, upsertHotWord } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

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
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const body = await request.json()
    const { action_type, search_keyword, duration_seconds } = body

    if (!action_type) return NextResponse.json(apiError('缺少参数 action_type'), { status: 400 })

    // 记录行为
    const { error } = await recordActivity({
      user_id: user.id,
      action_type,
      search_keyword: search_keyword ?? null,
      duration_seconds: duration_seconds ?? null,
    })
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    // 如果是搜索行为，同步更新热词
    if (action_type === 'search' && search_keyword) {
      await upsertHotWord(search_keyword, 'daily')
      await upsertHotWord(search_keyword, 'weekly')
    }

    return NextResponse.json(apiSuccess({ message: '记录成功' }), { status: 201 })
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
