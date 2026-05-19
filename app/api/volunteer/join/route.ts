import { NextRequest, NextResponse } from 'next/server'
import { joinVolunteerTask, getUserVolunteerRecords } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/volunteer/join
 * 获取当前用户的志愿参与记录
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const { data, error } = await getUserVolunteerRecords(user.id)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}

/**
 * POST /api/volunteer/join
 * 报名志愿任务
 * Body: { task_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const body = await request.json()
    const { task_id } = body
    if (!task_id) return NextResponse.json(apiError('缺少参数 task_id'), { status: 400 })

    const { error } = await joinVolunteerTask(user.id, task_id)
    if (error) {
      // 重复报名（唯一约束）
      if (error.code === '23505') {
        return NextResponse.json(apiError('您已报名该任务'), { status: 409 })
      }
      return NextResponse.json(apiError(error.message), { status: 500 })
    }

    return NextResponse.json(apiSuccess({ message: '报名成功' }), { status: 201 })
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
