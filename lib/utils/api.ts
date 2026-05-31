import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 成功响应
export function apiSuccess<T>(data: T, message?: string, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message },
    { status }
  )
}

// 错误响应
export function apiError(error: string, status = 400) {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status }
  )
}

// 从 Request 中获取 Supabase session token
export function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}
