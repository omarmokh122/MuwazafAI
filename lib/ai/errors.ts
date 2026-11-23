import { ZodError } from 'zod'
import { apiError } from '@/lib/security/http'
import { describeError, logEvent } from '@/lib/observability/logger'
import { isAbortError, MissingApiKeyError } from './gemini'

export async function aiErrorResponse(scope: string, error: unknown): Promise<Response> {
  const requestId = crypto.randomUUID()
  await logEvent(error instanceof MissingApiKeyError ? 'warn' : 'error', 'ai_failure', {
    scope,
    requestId,
    error: describeError(error),
  })

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
