import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { DEMO_COOKIE } from './constants'
import { verifyDemoToken } from './demo-session'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && url.startsWith('https://'))
}

export type RequestSession = {
  demo: boolean
  userId?: string
  email?: string
}

export async function getRequestSession(request: NextRequest): Promise<RequestSession | null> {
  const isDemo = await verifyDemoToken(request.cookies.get(DEMO_COOKIE)?.value)
  if (isDemo) return { demo: true }

  if (!isSupabaseConfigured()) return null

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // Read-only check in route handlers; proxy owns cookie refreshes.
          },
        },
      }
    )

    const { data } = await supabase.auth.getUser()
    if (data.user) {
      return {
        demo: false,
        userId: data.user.id,
        email: data.user.email ?? undefined,
      }
    }
  } catch {
    return null
  }

  return null
}
