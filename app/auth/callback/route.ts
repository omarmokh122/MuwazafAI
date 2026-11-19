import { NextResponse, type NextRequest } from 'next/server'
import { safeRedirectPath } from '@/lib/security/redirect'
import { applySecurityHeaders } from '@/lib/security/http'
import { isSupabaseConfigured } from '@/lib/security/session'
import { createClient } from '@/lib/supabase/server'

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
      return applySecurityHeaders(
        NextResponse.redirect(new URL(next, request.url))
      )
    }

    console.error('[auth:callback] code exchange failed', error.message)
  } catch (error) {
    console.error('[auth:callback] unexpected failure', error)
  }

  return applySecurityHeaders(
    NextResponse.redirect(new URL('/login?error=auth', request.url))
  )
}
