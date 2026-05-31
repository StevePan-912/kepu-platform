import { NextRequest, NextResponse } from 'next/server'
import { getDecisionSuggestions } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/decision
 * 获取智慧决策建议列表（按 priority 降序）
 * Query params:
 *   - type?: string  建议类型筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? undefined

    const { data, error } = await getDecisionSuggestions(type)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/decision', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
