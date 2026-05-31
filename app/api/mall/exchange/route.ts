import { NextRequest, NextResponse } from 'next/server'
import { createExchange, getUserExchanges } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/utils/rate-limit'

/**
 * GET /api/mall/exchange
 * 获取当前用户的兑换记录
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const { data, error } = await getUserExchanges(user.id)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/mall/exchange', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}

/**
 * POST /api/mall/exchange
 * 用积分兑换商品
 * Body: { product_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = checkRateLimit({
      identifier: getRateLimitIdentifier(request, '/api/mall/exchange'),
      maxRequests: 10,
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
    const { product_id } = body
    if (!product_id) return NextResponse.json(apiError('缺少参数 product_id'), { status: 400 })

    const result = await createExchange(user.id, product_id) as { data?: any; error?: any }
    if (result.error) {
      // 业务错误（积分不足/库存不足）返回 400
      const isBizError = ['积分不足', '商品库存不足', '商品不存在'].includes(result.error.message)
      return NextResponse.json(
        apiError(result.error.message),
        { status: isBizError ? 400 : 500 }
      )
    }

    return NextResponse.json(apiSuccess(result.data), { status: 201 })
  } catch (err) {
    console.error('[API Route Error]', '/api/mall/exchange', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
