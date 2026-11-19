import { z } from 'zod'
import { withJsonGuard } from '@/lib/security/api-guard'
import {
  DEMO_COOKIE,
  DEMO_TTL_SECONDS,
  IS_PROD,
  LEGACY_DEMO_COOKIE,
} from '@/lib/security/constants'
import { createDemoToken } from '@/lib/security/demo-session'
import { apiError, json } from '@/lib/security/http'

export const runtime = 'nodejs'

const emptyBodySchema = z.object({}).strict()

export const POST = withJsonGuard(
  {
    scope: 'auth:demo',
    schema: emptyBodySchema,
    requireSession: false,
    limit: 5,
    windowMs: 10 * 60_000,
    maxBytes: 1024,
  },
  async () => {
    const token = await createDemoToken()
    if (!token) {
      return apiError(
        'Demo mode is not configured on this deployment. Please sign in with an account.',
        503
      )
    }

    const response = json({ ok: true, expiresIn: DEMO_TTL_SECONDS })

    response.cookies.set(DEMO_COOKIE, token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: DEMO_TTL_SECONDS,
    })
    response.cookies.set(LEGACY_DEMO_COOKIE, '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD,
    })

    return response
  }
)
