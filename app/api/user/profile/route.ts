import { NextRequest, NextResponse } from 'next/server'
import { getUserById, upsertUser } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/user/profile
 * 获取当前登录用户信息（需 Authorization: Bearer <token>）
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const { data, error } = await getUserById(user.id)
    if (error) {
      if (error.code === 'PGRST116') {
        // 用户在 auth 存在但 users 表尚无记录，自动初始化
        const { data: newUser, error: insertError } = await upsertUser({
          id: user.id,
          phone: user.phone ?? null,
          nickname: user.user_metadata?.nickname ?? null,
          role: 'resident',
          points: 0,
        })
        if (insertError) return NextResponse.json(apiError(insertError.message), { status: 500 })
        return NextResponse.json(apiSuccess(newUser))
      }
      return NextResponse.json(apiError(error.message), { status: 500 })
    }

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/user/profile', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}

/**
 * PATCH /api/user/profile
 * 更新当前用户昵称等基本信息
 * Body: { nickname?: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const body = await request.json()
    const allowedFields = ['nickname'] as const
    const updatePayload: Record<string, unknown> = { id: user.id }
    for (const field of allowedFields) {
      if (field in body) updatePayload[field] = body[field]
    }

    const { data, error } = await upsertUser(updatePayload as Parameters<typeof upsertUser>[0])
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/user/profile', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
