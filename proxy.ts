import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  AUTH_ROUTES,
  DEMO_COOKIE,
  PROTECTED_ROUTES,
  PUBLIC_API_PREFIXES,
} from '@/lib/security/constants'
import { verifyDemoToken } from '@/lib/security/demo-session'
import {
  apiError,
  applySecurityHeaders,
  isSameOrigin,
} from '@/lib/security/http'
import { isSupabaseConfigured } from '@/lib/security/session'

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => /^sb-.+-auth-token(\.\d+)?$/.test(cookie.name))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isApi = pathname.startsWith('/api/')
  const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isProtectedPage = isProtectedRoute(pathname)
  const isAuthPage = AUTH_ROUTES.includes(pathname)
  const needsSession = isProtectedPage || isAuthPage || (isApi && !isPublicApi)

  if (isApi && STATE_CHANGING_METHODS.has(request.method) && !isSameOrigin(request)) {
    return applySecurityHeaders(apiError('Cross-site request blocked.', 403))
  }

  let response = NextResponse.next({ request })
  let user = null

  const isDemo = await verifyDemoToken(request.cookies.get(DEMO_COOKIE)?.value)

  if (!isDemo && needsSession && isSupabaseConfigured() && hasSupabaseAuthCookie(request)) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              response = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch (error) {
      console.error('[proxy] Supabase session check failed', error)
    }
  }

  const isAuthenticated = Boolean(user) || isDemo

  if (!isAuthenticated && isProtectedPage) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('redirect', `${pathname}${search}`)
    return applySecurityHeaders(NextResponse.redirect(redirectUrl))
  }

  if (isAuthenticated && isAuthPage) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    redirectUrl.search = ''
    return applySecurityHeaders(NextResponse.redirect(redirectUrl))
  }

  if (isDemo && pathname === '/reset-password') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.search = ''
    return applySecurityHeaders(NextResponse.redirect(redirectUrl))
  }

  if (isApi && !isPublicApi && !isAuthenticated) {
    return applySecurityHeaders(
      apiError('Authentication required. Please sign in again.', 401),
      { noindex: true }
    )
  }

  return applySecurityHeaders(response, {
    noindex: isApi || isProtectedPage,
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
