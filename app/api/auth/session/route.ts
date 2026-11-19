import { withGetGuard } from '@/lib/security/api-guard'
import { json } from '@/lib/security/http'

export const runtime = 'nodejs'

export const GET = withGetGuard(
  {
    scope: 'auth:session',
    requireSession: false,
    limit: 120,
    windowMs: 60_000,
  },
  async (_request, context) => {
    return json({
      authenticated: Boolean(context.session),
      demo: context.demo,
      user: context.session && !context.demo
        ? { id: context.userId, email: context.session.email }
        : null,
    })
  }
)
