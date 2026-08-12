import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyStudentToken } from './lib/jwt'
import { updateSession } from './lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Update Supabase session for teacher routes & auth
  const supabaseResponse = await updateSession(request)

  // If updateSession decided to redirect (e.g. unauthorized teacher or logged in going to login), return that redirect
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
  }

  // 2. Protect student routes (excluding entry page)
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
