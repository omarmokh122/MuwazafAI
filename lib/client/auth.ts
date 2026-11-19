import { createClient } from '@/lib/supabase/client'

const WORKSPACE_KEYS = [
  'muwaazaf-interview-storage',
  'muwaazaf-user-profile',
  'muwaazaf_tracker_jobs',
]

export function clearLocalWorkspace(): void {
  if (typeof window === 'undefined') return

  for (const key of WORKSPACE_KEYS) {
    window.localStorage.removeItem(key)
  }

  for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith('muwaazaf')) window.localStorage.removeItem(key)
  }

  window.sessionStorage.clear()
}

export async function signOutEverywhere(): Promise<void> {
  const supabase = createClient()
  if (supabase) {
    try {
      await supabase.auth.signOut()
    } catch {
      // Ignore: local cleanup below still removes all session state.
    }
  }

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
  } catch {
    // Redirect still clears the client-side workspace.
  }

  clearLocalWorkspace()
  window.location.href = '/'
}

export function authErrorMessage(code?: string | null): string | null {
  switch (code) {
    case 'auth':
      return 'That sign-in link is invalid or has expired. Please try again.'
    case 'session':
      return 'Your session expired. Please sign in again.'
    default:
      return null
  }
}
