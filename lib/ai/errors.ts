import { ZodError } from 'zod'
import { apiError } from '@/lib/security/http'
import { isAbortError, MissingApiKeyError } from './gemini'

export function aiErrorResponse(scope: string, error: unknown): Response {
  const requestId = crypto.randomUUID()
  console.error(`[ai:${scope}] request ${requestId} failed`, error)

  if (error instanceof MissingApiKeyError) {
    return apiError('AI features are not configured on this deployment.', 503)
  }
  if (isAbortError(error)) {
    return apiError('The AI request timed out. Please try again.', 504)
  }
  if (error instanceof ZodError || error instanceof SyntaxError) {
    return apiError('The AI returned an unexpected response. Please try again.', 502)
  }

  return apiError(`Something went wrong. Please try again. (ref: ${requestId})`, 500)
}
