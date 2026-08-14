import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyStudentToken } from './lib/jwt'
import { updateSession } from './lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Update Supabase session for teacher, admin & auth routes
  const supabaseResponse = await updateSession(request)

  // If updateSession decided to redirect (e.g. unauthorized teacher/admin or logged in going to login), return that redirect
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
  }

  // 2. Protect admin routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    // Requires authenticated teacher/admin
    const isAuth = request.cookies.get('sb-access-token') || request.cookies.get('supabase-auth-token')
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Protect student routes (excluding entry page)
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
