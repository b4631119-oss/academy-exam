import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyStudentToken } from './lib/jwt'
import { updateSession } from './lib/supabase/middleware'
import { isIPBlocked, blockIP } from './lib/block-ip'
import { rateLimit, RATE_LIMIT_PRESETS } from './lib/rate-limit'

function getClientIP(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }
  const xRealIP = request.headers.get('x-real-ip')
  if (xRealIP) {
    return xRealIP.trim()
  }
  return '127.0.0.1'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)

  // 1. IP Blocklist Check (Return 403 Forbidden)
  if (isIPBlocked(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'Доступ заблокирован. Подозрение на DDoS / Взлом.' }),
      { status: 403, headers: { 'content-type': 'application/json' } }
    )
  }

  // 2. Request Payload Size Validation (Max 1MB)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 1024 * 1024) {
    return new NextResponse(
      JSON.stringify({ error: 'Размер запроса превышает допустимый лимит (1MB)' }),
      { status: 413, headers: { 'content-type': 'application/json' } }
    )
  }

  // 3. Rate Limiting Check (Return 429 Too Many Requests)
  let limitPreset = RATE_LIMIT_PRESETS.API_GENERAL
  if (pathname.startsWith('/login')) {
    limitPreset = RATE_LIMIT_PRESETS.LOGIN
  } else if (pathname.startsWith('/register')) {
    limitPreset = RATE_LIMIT_PRESETS.REGISTER
  }

  const rlResult = rateLimit(`${ip}:${pathname}`, limitPreset.limit, limitPreset.windowMs)
  if (!rlResult.allowed) {
    // If client severely exceeds limit, block IP automatically
    if (rlResult.remaining === 0) {
      blockIP(ip, `DDoS атака на маршрут ${pathname}`)
    }
    return new NextResponse(
      JSON.stringify({ error: 'Слишком много запросов. Доступ временно ограничен.' }),
      { status: 429, headers: { 'content-type': 'application/json' } }
    )
  }

  // 4. Update Supabase session for teacher, admin & auth routes
  const supabaseResponse = await updateSession(request)

  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
  }

  // 5. Protect admin routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    const isAuth = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token')
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 6. Protect student routes (excluding entry page)
  if (pathname.startsWith('/student/') && pathname !== '/student/enter') {
    const token = request.cookies.get('studentToken')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/student/enter', request.url))
    }

    const payload = await verifyStudentToken(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/student/enter', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
