
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next()

  try {
    const { pathname } = request.nextUrl
    const protectedRoutes = ['/dashboard', '/scout', '/coach', '/simulation', '/application', '/rights', '/benchmark', '/resources', '/profile']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    const isDemoMode = request.cookies.get('demo_mode')?.value === 'true'

    if (!isDemoMode && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (isDemoMode && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (error: any) {
    console.log('Middleware error:', error?.message)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
