import { z } from 'zod'
import { withJsonGuard } from '@/lib/security/api-guard'
import {
  DEMO_COOKIE,
  IS_PROD,
  LEGACY_DEMO_COOKIE,
} from '@/lib/security/constants'
import { json } from '@/lib/security/http'
import { isSupabaseConfigured } from '@/lib/security/session'
import { createClient } from '@/lib/supabase/server'
import { describeError, logEvent } from '@/lib/observability/logger'

export const runtime = 'nodejs'

const emptyBodySchema = z.object({}).strict()

export const POST = withJsonGuard(
  {
    scope: 'auth:logout',
    schema: emptyBodySchema,
    requireSession: false,
    limit: 20,
    windowMs: 60_000,
    maxBytes: 1024,
  },
  async () => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient()
        await supabase.auth.signOut()
      } catch (error) {
        logEvent('error', 'auth_logout_failed', { error: describeError(error) })
      }
    }

    logEvent('info', 'auth_logout')

    const response = json({ ok: true })

    for (const name of [DEMO_COOKIE, LEGACY_DEMO_COOKIE]) {
      response.cookies.set(name, '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PROD,
      })
    }

    return response
  }
)
