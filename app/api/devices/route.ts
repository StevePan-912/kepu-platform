import { NextRequest, NextResponse } from 'next/server'
import { getDevices } from '@/lib/supabase/queries'
import { apiSuccess, apiError } from '@/lib/utils/api'

/**
 * GET /api/devices
 * 查询设备点位列表
 * Query params:
 *   - status?: string  设备状态筛选（online/offline/maintenance）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined

    const { data, error } = await getDevices(status)
    if (error) return NextResponse.json(apiError(error.message), { status: 500 })

    return NextResponse.json(apiSuccess(data))
  } catch (err) {
    console.error('[API Route Error]', '/api/devices', err)
    return NextResponse.json(apiError('服务器内部错误'), { status: 500 })
  }
}
