import type { NextRequest } from 'next/server'
import type { z } from 'zod'
import { MAX_JSON_BYTES } from './constants'
import { apiError, isSameOrigin } from './http'
import { getClientIp, rateLimit } from './rate-limit'
import { getRequestSession, type RequestSession } from './session'

export type GuardContext = {
  ip: string
  scope: string
  session: RequestSession | null
  demo: boolean
  userId?: string
}

type BaseGuardOptions = {
  scope: string
  limit?: number
  windowMs?: number
  requireSession?: boolean
  maxBytes?: number
}

type JsonGuardOptions<T> = BaseGuardOptions & {
  schema: z.ZodType<T>
}

type FormGuardOptions = BaseGuardOptions

type JsonHandler<T> = (
  request: NextRequest,
  data: T,
  context: GuardContext
) => Promise<Response>

type FormHandler = (
  request: NextRequest,
  formData: FormData,
  context: GuardContext
) => Promise<Response>

const DEFAULT_LIMIT = 20
const DEFAULT_WINDOW_MS = 60_000

function tooManyRequests(retryAfter: number, remaining = 0): Response {
  return apiError('Too many requests. Please slow down and try again shortly.', 429, {
    'Retry-After': String(retryAfter),
    'X-RateLimit-Remaining': String(remaining),
  })
}

function checkRateLimit(
  request: NextRequest,
  options: BaseGuardOptions,
  session: RequestSession | null
): Response | null {
  const ip = getClientIp(request.headers)
  const limit = options.limit ?? DEFAULT_LIMIT
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS

  const byIp = rateLimit(`${options.scope}:ip:${ip}`, limit, windowMs)
  if (!byIp.ok) return tooManyRequests(byIp.retryAfter)

  if (session?.userId) {
    const byUser = rateLimit(`${options.scope}:user:${session.userId}`, limit, windowMs)
    if (!byUser.ok) return tooManyRequests(byUser.retryAfter)
  }

  return null
}

async function preflight(
  request: NextRequest,
  options: BaseGuardOptions
): Promise<Response | GuardContext> {
  if (!isSameOrigin(request)) {
    return apiError('Cross-site request blocked.', 403)
  }

  const requireSession = options.requireSession !== false
  const session = await getRequestSession(request)

  if (requireSession && !session) {
    return apiError('Authentication required. Please sign in again.', 401)
  }

  const limited = checkRateLimit(request, options, session)
  if (limited) return limited

  return {
    ip: getClientIp(request.headers),
    scope: options.scope,
    session,
    demo: Boolean(session?.demo),
    userId: session?.userId,
  }
}

function finalize(response: Response, limit: number): Response {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-RateLimit-Limit', String(limit))
  return response
}

async function readJson(request: NextRequest, maxBytes: number): Promise<Response | unknown> {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    return apiError('Content-Type must be application/json.', 415)
  }

  const declared = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(declared) && declared > maxBytes) {
    return apiError('Request body is too large.', 413)
  }

  const raw = await request.text()
  if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
    return apiError('Request body is too large.', 413)
  }
  if (!raw) {
    return apiError('Request body is required.', 400)
  }

  try {
    return JSON.parse(raw)
  } catch {
    return apiError('Invalid JSON body.', 400)
  }
}

function logFailure(scope: string, error: unknown) {
  const requestId = crypto.randomUUID()
  console.error(`[api:${scope}] request ${requestId} failed`, error)
  return apiError(`Something went wrong. Please try again. (ref: ${requestId})`, 500)
}

export function withJsonGuard<T>(
  options: JsonGuardOptions<T>,
  handler: JsonHandler<T>
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest) => {
    const pre = await preflight(request, options)
    if (pre instanceof Response) return pre

    try {
      const body = await readJson(request, options.maxBytes ?? MAX_JSON_BYTES)
      if (body instanceof Response) return body

      const parsed = options.schema.safeParse(body)
      if (!parsed.success) {
        return apiError('Invalid request. Please check the submitted fields.', 400)
      }

      const response = await handler(request, parsed.data, pre)
      return finalize(response, options.limit ?? DEFAULT_LIMIT)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return apiError('The request timed out. Please try again.', 504)
      }
      return logFailure(options.scope, error)
    }
  }
}

type GetHandler = (
  request: NextRequest,
  context: GuardContext
) => Promise<Response>

export function withGetGuard(
  options: BaseGuardOptions,
  handler: GetHandler
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest) => {
    const pre = await preflight(request, options)
    if (pre instanceof Response) return pre

    try {
      const response = await handler(request, pre)
      return finalize(response, options.limit ?? DEFAULT_LIMIT)
    } catch (error) {
      return logFailure(options.scope, error)
    }
  }
}

export function withFormGuard(
  options: FormGuardOptions,
  handler: FormHandler
): (request: NextRequest) => Promise<Response> {
  return async (request: NextRequest) => {
    const pre = await preflight(request, options)
    if (pre instanceof Response) return pre

    try {
      const contentType = request.headers.get('content-type') || ''
      if (!contentType.includes('multipart/form-data')) {
        return apiError('Content-Type must be multipart/form-data.', 415)
      }

      const declared = Number(request.headers.get('content-length') || 0)
      const maxBytes = options.maxBytes ?? MAX_JSON_BYTES
      if (Number.isFinite(declared) && declared > maxBytes) {
        return apiError('Upload is too large.', 413)
      }

      const formData = await request.formData()
      const response = await handler(request, formData, pre)
      return finalize(response, options.limit ?? DEFAULT_LIMIT)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        return apiError('The request timed out. Please try again.', 504)
      }
      return logFailure(options.scope, error)
    }
  }
}
