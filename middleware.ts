import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    let user = null

    // Only attempt Supabase auth if env vars are properly set
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      })
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    const { pathname } = request.nextUrl
    const protectedRoutes = ['/dashboard', '/scout', '/coach', '/simulation', '/application', '/rights', '/benchmark', '/resources', '/profile', '/tracker', '/interview-prep', '/skillsets']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    const isDemoMode = request.cookies.get('demo_mode')?.value === 'true'

    // Redirect unauthenticated users to login
    if (!user && !isDemoMode && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if ((user || isDemoMode) && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (error: any) {
    // Silently continue — don't crash the Edge Runtime
    console.log('Middleware auth skip:', error?.message)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
