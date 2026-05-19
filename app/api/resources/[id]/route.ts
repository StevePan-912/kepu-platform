import { NextRequest, NextResponse } from 'next/server'
import { getResourceById, recordActivity } from '@/lib/supabase/queries'
import { apiSuccess, apiError, getAuthToken } from '@/lib/utils/api'
import { createUserServerClient } from '@/lib/supabase/client'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/resources/[id]
 * 获取资源详情，同时记录浏览行为
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { data, error } = await getResourceById(id)
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(apiError('资源不存在'), { status: 404 })
      }
      return NextResponse.json(apiError(error.message), { status: 500 })
    }

    // 异步记录浏览行为（不阻塞响应）
    const token = getAuthToken(request)
    if (token) {
      const userClient = createUserServerClient(token)
      userClient.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          recordActivity({
            user_id: user.id,
            action_type: 'view_resource',
            search_keyword: null,
            duration_seconds: null,
          })
        }
      })
    }

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
