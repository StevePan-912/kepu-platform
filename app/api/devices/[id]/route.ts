import { NextRequest, NextResponse } from 'next/server'
import { getDeviceById } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/devices/[id]
 * 获取单个设备详情
 */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const { data, error } = await getDeviceById(id)
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(apiError('设备不存在'), { status: 404 })
      }
      return NextResponse.json(apiError(error.message), { status: 500 })
    }
    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
