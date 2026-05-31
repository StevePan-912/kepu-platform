import { NextRequest, NextResponse } from 'next/server'
import { getResources } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/resources
 * 查询科普资源列表
 * Query params:
 *   - category?: string  按分类筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') ?? undefined

    const { data, error } = await getResources(category)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/resources', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
