import { GoogleGenerativeAI } from '@google/generative-ai'

export const AI_TIMEOUT_MS = 45_000

export class MissingApiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not configured')
    this.name = 'MissingApiKeyError'
  }
}

export function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new MissingApiKeyError()
  return new GoogleGenerativeAI(apiKey)
}

export function aiRequestOptions(): { signal: AbortSignal } {
  return { signal: AbortSignal.timeout(AI_TIMEOUT_MS) }
}

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'TimeoutError') ||
    (error instanceof Error && error.name === 'AbortError')
  )
}
