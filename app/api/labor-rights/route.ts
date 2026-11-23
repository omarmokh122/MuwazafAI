import { timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'
import { withGetGuard } from '@/lib/security/api-guard'
import { apiError, json } from '@/lib/security/http'
import { getLaborRightsCategories, syncLaborLaw } from '@/lib/labor-rights-helper'
import { describeError, logEvent } from '@/lib/observability/logger'

export const runtime = 'nodejs'
export const maxDuration = 60

function matchesAdminSecret(provided: string | null): boolean {
  const expected = process.env.ADMIN_SECRET
  if (!expected || !provided) return false

  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  if (providedBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(providedBuffer, expectedBuffer)
}

export const GET = withGetGuard(
  {
    scope: 'labor-rights',
    limit: 30,
    windowMs: 60_000,
  },
  async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const wantsSync = searchParams.get('sync') === 'true' || searchParams.get('force') === 'true'

    if (wantsSync) {
      if (!matchesAdminSecret(request.headers.get('x-admin-secret'))) {
        return apiError('Syncing labor-law data is restricted to administrators.', 403)
      }

      try {
        const force = searchParams.get('force') === 'true'
        const result = await syncLaborLaw(force)
        return json({
          success: result.synced,
          message: result.message,
          synced: result.synced,
        })
      } catch (error) {
        await logEvent('error', 'labor_law_sync_route_failed', { error: describeError(error) })
        return apiError('Failed to sync labor-law data.', 500)
      }
    }

    try {
      const categories = await getLaborRightsCategories()
      return json(categories)
    } catch (error) {
      await logEvent('error', 'labor_law_read_failed', { error: describeError(error) })
      return apiError('Failed to load labor-rights data.', 500)
    }
  }
)
