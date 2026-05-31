import { NextRequest, NextResponse } from 'next/server'
import { getVolunteerTasks } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/volunteer/tasks
 * 获取志愿者任务列表
 * Query params:
 *   - status?: 'open' | 'in_progress' | 'completed'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined

    const { data, error } = await getVolunteerTasks(status)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/volunteer/tasks', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
