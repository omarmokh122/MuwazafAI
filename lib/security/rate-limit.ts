type Bucket = { count: number; resetAt: number }

type RateLimitStore = Map<string, Bucket>

const globalStore = globalThis as typeof globalThis & {
  __muwaazafRateLimit?: RateLimitStore
}

const store: RateLimitStore = (globalStore.__muwaazafRateLimit ??= new Map())
const MAX_BUCKETS = 20_000

const UPSTASH_KEY_PREFIX = 'muwaazaf:rl:'
const UPSTASH_TIMEOUT_MS = 1_500
const FALLBACK_WARN_INTERVAL_MS = 60_000

let lastFallbackWarnAt = 0

type UpstashConfig = { url: string; token: string }

type PipelineEntry = { result?: unknown; error?: string }

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

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
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

function cleanEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  const unquoted = trimmed.replace(/^(['"])([\s\S]*)\1$/, '$2').trim()
  return unquoted || undefined
}

function readUpstashConfig(): UpstashConfig | null {
  const rawUrl = cleanEnvValue(process.env.UPSTASH_REDIS_REST_URL)
  const token = cleanEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN)
  if (!rawUrl || !token) return null

  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`
  const url = withProtocol.replace(/\/+$/, '')
  return { url, token }
}

function normalizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9:._-]/g, '_').slice(0, 160)
}

function warnFallback(error: unknown) {
  const now = Date.now()
  if (now - lastFallbackWarnAt < FALLBACK_WARN_INTERVAL_MS) return
  lastFallbackWarnAt = now
  console.warn('[rate-limit] Upstash unavailable; using in-memory fallback', error)
}

async function postPipeline(
  config: UpstashConfig,
  body: unknown
): Promise<PipelineEntry[] | null> {
  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(UPSTASH_TIMEOUT_MS),
    cache: 'no-store',
  })
  if (!response.ok) return null
  const payload = (await response.json()) as unknown
  return Array.isArray(payload) ? (payload as PipelineEntry[]) : null
}

async function upstashRateLimit(
  config: UpstashConfig,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const redisKey = `${UPSTASH_KEY_PREFIX}${normalizeKey(key)}`
  const payload = await postPipeline(config, [
    ['INCR', redisKey],
    ['PEXPIRE', redisKey, String(windowMs), 'NX'],
    ['PTTL', redisKey],
  ])
  if (!payload) return null

  const count = Number(payload[0]?.result)
  if (!Number.isInteger(count) || count < 1) return null

  // PEXPIRE NX is unsupported on older Redis; set the TTL without NX on the first hit.
  if (payload[1]?.error && count === 1) {
    await postPipeline(config, [['PEXPIRE', redisKey, String(windowMs)]])
  }

  const ttl = Number(payload[2]?.result)
  const remainingTtl = Number.isFinite(ttl) && ttl > 0 ? ttl : windowMs
  const ok = count <= limit

  return {
    ok,
    remaining: Math.max(0, limit - count),
    retryAfter: ok ? 0 : Math.max(1, Math.ceil(remainingTtl / 1000)),
    resetAt: Date.now() + remainingTtl,
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const config = readUpstashConfig()
  if (config) {
    try {
      const result = await upstashRateLimit(config, key, limit, windowMs)
      if (result) return result
      warnFallback('unexpected Upstash response')
    } catch (error) {
      warnFallback(error)
    }
  }

  return memoryRateLimit(key, limit, windowMs)
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
