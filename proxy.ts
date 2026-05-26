import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/profile',
  '/mall',
  '/volunteer/my',
]

const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isAdmin = ADMIN_ROUTES.some(r => pathname.startsWith(r))

  if (!isProtected && !isAdmin) {
    return NextResponse.next()
  }

  const cookieHeader = request.headers.get('cookie') ?? ''
  const hasSession = cookieHeader.includes('sb-') && cookieHeader.includes('auth-token')

  if (!hasSession) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/mall/:path*',
    '/volunteer/my/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
