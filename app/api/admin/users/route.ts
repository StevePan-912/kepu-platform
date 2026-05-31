import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/client'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

/**
 * GET /api/admin/users
 * 管理员专用 - 获取用户列表
 * Query params:
 *   - role?: string  按角色筛选
 *   - limit?: number  默认 50，最多 200
 *   - offset?: number  分页偏移
 */
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const serviceClient = createServerClient()
    const { data: userRecord, error: roleError } = await serviceClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null; error: any }
    if (roleError || userRecord?.role !== 'admin') {
      return NextResponse.json(apiError('权限不足'), { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') ?? undefined
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200)
    const offset = parseInt(searchParams.get('offset') ?? '0', 10)

    let query = serviceClient
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (role) query = query.eq('role', role)

    const { data, error, count } = await query
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess({ items: data, total: count, limit, offset }))
  } catch (err) {
    console.error('[API Route Error]', '/api/admin/users', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}

/**
 * PATCH /api/admin/users
 * 管理员专用 - 修改用户角色
 * Body: { user_id: string; role: 'resident' | 'admin' | 'volunteer' }
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    if (!token) return NextResponse.json(apiError('未登录'), { status: 401 })

    const userClient = createUserServerClient(token)
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return NextResponse.json(apiError('认证失败'), { status: 401 })

    const serviceClient = createServerClient()
    const { data: userRecord } = await serviceClient
      .from('users').select('role').eq('id', user.id).single() as { data: { role: string } | null; error: any }
    if (userRecord?.role !== 'admin') {
      return NextResponse.json(apiError('权限不足'), { status: 403 })
    }

    const body = await request.json()
    const { user_id, role } = body
    if (!user_id || !role) return NextResponse.json(apiError('缺少参数 user_id 或 role'), { status: 400 })

    const validRoles = ['resident', 'admin', 'volunteer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(apiError('无效的角色值'), { status: 400 })
    }

    const { data, error } = await (serviceClient
      .from('users') as any).update({ role }).eq('id', user_id).select().single() as { data: any; error: any }
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/admin/users', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
