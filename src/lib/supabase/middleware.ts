import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname === '/teacher/login'
  const isTeacherRoute = pathname.startsWith('/teacher') && pathname !== '/teacher/login'

  // Optimization: Only validate user if we are on a route that cares about auth
  if (!isAuthRoute && !isTeacherRoute) {
    return supabaseResponse
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isTeacherRoute && !user) {
    // If trying to access teacher routes without being logged in, redirect to teacher login
    const url = request.nextUrl.clone()
    url.pathname = '/teacher/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    // If logged in and trying to access login/register, redirect to dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/teacher/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
