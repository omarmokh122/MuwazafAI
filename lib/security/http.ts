import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { IS_PROD, LEGACY_DEMO_COOKIE } from './constants'

export const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
}

function buildCsp(): string {
  const isDev = process.env.NODE_ENV !== 'production'
  const scriptExtra = isDev ? " 'unsafe-eval'" : ''
  const connectExtra = isDev ? ' ws: wss:' : ''

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${scriptExtra}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https://*.supabase.co wss://*.supabase.co${connectExtra}`,
    "frame-src 'self' https://*.supabase.co",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(IS_PROD ? ["upgrade-insecure-requests"] : []),
  ].join('; ')
}

const CSP = buildCsp()

export function applySecurityHeaders<T extends Response>(
  response: T,
  options: { noindex?: boolean } = {}
): T {
  const headers = response.headers

  headers.set('Content-Security-Policy', CSP)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('X-DNS-Prefetch-Control', 'off')
  headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()'
  )
  headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  headers.set('Cross-Origin-Resource-Policy', 'same-origin')

  if (IS_PROD) {
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
  if (options.noindex) {
    headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  if (response instanceof NextResponse) {
    response.cookies.set(LEGACY_DEMO_COOKIE, '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD,
    })
  }

  return response
}

export function json(
  data: unknown,
  init: { status?: number; headers?: Record<string, string> } = {}
): NextResponse {
  return NextResponse.json(data, {
    status: init.status ?? 200,
    headers: { ...NO_STORE_HEADERS, ...init.headers },
  })
}

export function apiError(
  message: string,
  status: number,
  headers: Record<string, string> = {}
): NextResponse {
  return json({ error: message }, { status, headers })
}

export { getClientIp } from './rate-limit'

export function isSameOrigin(request: NextRequest | Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return false

  const origin = request.headers.get('origin')
  if (!origin) return true
  if (origin === 'null') return false

  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = (forwardedHost ? forwardedHost.split(',')[0] : request.headers.get('host'))?.trim()
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
