export const DEMO_COOKIE = 'muwaazaf_demo_session'
export const LEGACY_DEMO_COOKIE = 'demo_mode'
export const DEMO_TTL_SECONDS = 60 * 60 * 24

export const IS_PROD = process.env.NODE_ENV === 'production'

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/scout',
  '/coach',
  '/simulation',
  '/application',
  '/rights',
  '/benchmark',
  '/resources',
  '/profile',
  '/tracker',
  '/interview-prep',
  '/skillsets',
  '/reset-password',
]

export const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export const PUBLIC_API_PREFIXES = ['/api/auth/']

export const MAX_JSON_BYTES = 512 * 1024
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
