import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { verifyStudentToken } from './lib/jwt'
import { updateSession } from './lib/supabase/middleware'
import { isIPBlocked, blockIP } from './lib/block-ip'
import { rateLimit, resolveRateLimitPreset } from './lib/rate-limit'

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
  // Auth limits (LOGIN/REGISTER) apply ONLY to actual submissions (POST).
  // GET page loads and RSC/link prefetch must not consume the auth-attempt
  // budget or trigger the 24h auto-IP-block during normal navigation.
  const limitPreset = resolveRateLimitPreset(request.method, pathname)

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

  // 5. Protect /teacher/admin/* routes (admin JWT check)
  // Note: updateSession above already handles Supabase auth redirect
  const ADMIN_SESSION_COOKIE = 'admin_session'

  if (pathname.startsWith('/teacher/admin') && pathname !== '/teacher/admin/login') {
    // If updateSession didn't redirect, user is Supabase-authenticated.
    // Now check admin JWT cookie.
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL('/teacher/admin/login', request.url))
    }

    // Verify admin JWT is valid
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
      const { payload } = await jwtVerify(adminToken, secret)
      if ((payload as Record<string, unknown>).isAdmin !== true) {
        throw new Error('Not admin')
      }
    } catch {
      return NextResponse.redirect(new URL('/teacher/admin/login', request.url))
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
