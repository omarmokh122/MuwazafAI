type Bucket = { count: number; resetAt: number }

type RateLimitStore = Map<string, Bucket>

const globalStore = globalThis as typeof globalThis & {
  __muwaazafRateLimit?: RateLimitStore
}

const store: RateLimitStore = (globalStore.__muwaazafRateLimit ??= new Map())
const MAX_BUCKETS = 20_000

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfter: number
  resetAt: number
}

function sweep(now: number) {
  if (store.size < MAX_BUCKETS) return
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
  if (store.size >= MAX_BUCKETS) {
    const overflow = store.size - Math.floor(MAX_BUCKETS * 0.8)
    let removed = 0
    for (const key of store.keys()) {
      store.delete(key)
      if (++removed >= overflow) break
    }
  }
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, retryAfter: 0, resetAt }
  }

  existing.count += 1
  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      resetAt: existing.resetAt,
    }
  }

  return {
    ok: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfter: 0,
    resetAt: existing.resetAt,
  }
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'

  return (
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    headers.get('x-vercel-forwarded-for') ||
    'unknown'
  )
}
