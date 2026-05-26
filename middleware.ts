import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMIT_AUTH } from '@/lib/utils/rate-limit'

/**
 * Next.js Middleware
 * 全局请求预处理：路由保护 + 速率限制
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ============================================================
  // 速率限制：认证接口（防暴力破解）
  // ============================================================
  if (pathname.startsWith('/api/auth/')) {
    const identifier = getRateLimitIdentifier(request, pathname)
    const result = checkRateLimit({
      identifier,
      maxRequests: RATE_LIMIT_AUTH.maxRequests,
      windowSeconds: RATE_LIMIT_AUTH.windowSeconds,
    })

    if (result.limited) {
      return NextResponse.json(
        {
          success: false,
          error: '请求过于频繁，请稍后再试',
          retry_after: result.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(result.resetInSeconds),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
          },
        }
      )
    }
  }

  // ============================================================
  // 管理员路由保护（无 token → 重定向登录）
  // ============================================================
  if (pathname.startsWith('/admin')) {
    // 静态资源放行
    if (pathname.startsWith('/admin/_next') || pathname.includes('.')) {
      return NextResponse.next()
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const cookieToken = request.cookies.get('sb-access-token')?.value

    if (!token && !cookieToken) {
      const loginUrl = new URL('/', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ============================================================
  // 安全头
  // ============================================================
  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

/**
 * 匹配路径：
 * - /api/auth/* 认证接口限流
 * - /admin/* 管理后台（不含静态资源和API）
 */
export const config = {
  matcher: ['/api/auth/:path*', '/admin/:path*'],
}
