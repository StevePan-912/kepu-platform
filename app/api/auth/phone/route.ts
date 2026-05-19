import { NextRequest, NextResponse } from 'next/server'
import { signInWithPhone, verifyOtp } from '@/lib/supabase/auth'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * POST /api/auth/phone
 * 手机号登录 - 发送 OTP
 * Body: { phone: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body
    if (!phone) return NextResponse.json(apiError('缺少参数 phone'), { status: 400 })

    // 手机号格式简单校验（支持 +86 或 11 位数字）
    const phoneRegex = /^(\+?86)?1[3-9]\d{9}$/
    const normalized = phone.replace(/\s/g, '')
    if (!phoneRegex.test(normalized)) {
      return NextResponse.json(apiError('手机号格式不正确'), { status: 400 })
    }

    const { error } = await signInWithPhone(normalized)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess({ message: '验证码已发送' }))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
