import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/supabase/auth'
import { upsertUser } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * POST /api/auth/verify
 * 验证 OTP，完成手机号登录
 * Body: { phone: string; token: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, token } = body
    if (!phone || !token) {
      return NextResponse.json(apiError('缺少参数 phone 或 token'), { status: 400 })
    }

    const { data, error } = await verifyOtp(phone, token)
    if (error) return NextResponse.json(apiError('验证码错误或已过期'), { status: 400 })

    const user = data.user
    if (user) {
      // 首次登录自动创建用户记录
      await upsertUser({
        id: user.id,
        phone: user.phone ?? null,
        nickname: null,
        role: 'resident',
        points: 0,
      })
    }

    return NextResponse.json(apiSuccess({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: user?.id,
        phone: user?.phone,
      },
    }))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
