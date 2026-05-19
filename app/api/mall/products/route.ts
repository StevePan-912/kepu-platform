import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/mall/products
 * 获取积分商城商品列表（仅返回库存 > 0 且上架的商品）
 * Query params:
 *   - category?: string  按分类筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') ?? undefined

    const { data, error } = await getProducts(category)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
