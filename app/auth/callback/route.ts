import { NextResponse, type NextRequest } from 'next/server'
import { safeRedirectPath } from '@/lib/security/redirect'
import { applySecurityHeaders } from '@/lib/security/http'
import { isSupabaseConfigured } from '@/lib/security/session'
import { createClient } from '@/lib/supabase/server'
import { describeError, logEvent } from '@/lib/observability/logger'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = safeRedirectPath(request.nextUrl.searchParams.get('next'), '/dashboard')

  if (!code || !isSupabaseConfigured()) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL('/login?error=auth', request.url))
    )
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      logEvent('info', 'auth_callback_success', { next })
      return applySecurityHeaders(
        NextResponse.redirect(new URL(next, request.url))
      )
    }

    logEvent('warn', 'auth_callback_exchange_failed', { error: error.message })
  } catch (error) {
    logEvent('error', 'auth_callback_unexpected_failure', { error: describeError(error) })
  }

  return applySecurityHeaders(
    NextResponse.redirect(new URL('/login?error=auth', request.url))
  )
}
