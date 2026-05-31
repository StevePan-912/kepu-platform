import { NextRequest, NextResponse } from 'next/server'
import { getHotWords } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/hot-words
 * 获取热词榜单
 * Query params:
 *   - period?: 'daily' | 'weekly'  默认 weekly
 *   - limit?: number  默认 30，最多 50
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') ?? 'weekly'
    if (!['daily', 'weekly'].includes(period)) {
      return NextResponse.json(apiError('无效的period参数'), { status: 400 })
    }
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30', 10), 50)

    const { data, error } = await getHotWords(period, limit)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/hot-words', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
