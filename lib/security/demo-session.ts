import { DEMO_TTL_SECONDS } from './constants'

const encoder = new TextEncoder()
let keyPromise: Promise<CryptoKey | null> | null = null

function demoSecret(): string | null {
  const configured =
    process.env.AUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.GEMINI_API_KEY

  if (configured) return configured
  return process.env.NODE_ENV === 'production'
    ? null
    : 'muwaazaf-development-only-demo-secret'
}

async function getKey(): Promise<CryptoKey | null> {
  if (!keyPromise) {
    keyPromise = (async () => {
      const secret = demoSecret()
      if (!secret) return null
      const digest = await crypto.subtle.digest(
        'SHA-256',
        encoder.encode(`muwaazaf.demo.v1:${secret}`)
      )
      return crypto.subtle.importKey(
        'raw',
        digest,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      )
    })()
  }
  return keyPromise
}

function base64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 ? '='.repeat(4 - (normalized.length % 4)) : ''
  const binary = atob(normalized + padding)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

export async function createDemoToken(ttlSeconds = DEMO_TTL_SECONDS): Promise<string | null> {
  const key = await getKey()
  if (!key) return null

  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds
  const nonce = base64Url(crypto.getRandomValues(new Uint8Array(16)))
  const payload = `v1.${expiresAt}.${nonce}`
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return `${payload}.${base64Url(new Uint8Array(signature))}`
}

export async function verifyDemoToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'v1') return false

  const expiresAt = Number(parts[1])
  const now = Math.floor(Date.now() / 1000)
  if (!Number.isFinite(expiresAt) || expiresAt < now) return false
  if (expiresAt > now + DEMO_TTL_SECONDS + 300) return false

  const key = await getKey()
  if (!key) return false

  try {
    return await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(parts[3]),
      encoder.encode(`v1.${expiresAt}.${parts[2]}`)
    )
  } catch {
    return false
  }
}
