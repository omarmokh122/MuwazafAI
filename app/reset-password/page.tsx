'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { createClient, isAuthConfigured } from '@/lib/supabase/client'
import { resetPasswordSchema, zodFieldErrors, type FieldErrors } from '@/lib/auth/validation'

type SessionState = 'checking' | 'ready' | 'expired' | 'unconfigured'

export default function ResetPasswordPage() {
  const router = useRouter()
  const authConfigured = isAuthConfigured()

  const [sessionState, setSessionState] = useState<SessionState>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function checkSession() {
      if (!authConfigured) {
        if (active) setSessionState('unconfigured')
        return
      }

      const supabase = createClient()
      if (!supabase) {
        if (active) setSessionState('unconfigured')
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!active) return
      setSessionState(data.session ? 'ready' : 'expired')
    }

    checkSession()
    return () => {
      active = false
    }
  }, [authConfigured])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword })
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error))
      return
    }
    setFieldErrors({})

    const supabase = createClient()
    if (!supabase) {
      setError('Password reset is not configured in this environment.')
      return
    }

    setIsLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: parsed.data.password,
      })

      if (updateError) {
        setError(
          updateError.message.toLowerCase().includes('rate limit')
            ? 'Too many attempts. Please wait a moment and try again.'
            : 'We could not update your password. The reset link may have expired.'
        )
        return
      }

      await supabase.auth.signOut()
      router.replace('/login?reset=success')
      router.refresh()
    } catch {
      setError('We could not update your password right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Choose a new password."
      subtitle="Use a unique password you have not used elsewhere."
      bullets={[
        'Minimum 8 characters with a letter and a number',
        'The reset link can only be used once',
        'You will be signed out of other sessions',
      ]}
      footer={
        <p className="text-center text-[13px] text-el-dark-gray">
          Need a new link?{' '}
          <Link href="/forgot-password" className="font-semibold text-el-black underline-offset-4 hover:underline">
            Request another email
          </Link>
        </p>
      }
    >
      {sessionState === 'checking' ? (
        <div className="flex items-center gap-3 rounded-2xl border border-el-border-light bg-el-near-white p-6 text-[13px] text-el-dark-gray">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Verifying your reset link…
        </div>
      ) : sessionState === 'expired' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500">
            <ShieldAlert className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-[16px] font-semibold text-amber-900">This link has expired</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-amber-800">
            Reset links are single-use and time-limited. Request a fresh email to continue.
          </p>
          <Button asChild className="mt-5 h-11 w-full rounded-xl bg-el-black text-[13px] font-medium text-white shadow-none hover:bg-el-dark-gray">
            <Link href="/forgot-password">Request a new link</Link>
          </Button>
        </div>
      ) : sessionState === 'unconfigured' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
          Password reset is not configured on this deployment.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          ) : null}

          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            autoComplete="new-password"
            showStrength
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-el-black text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-el-dark-gray disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Updating password…
              </>
            ) : (
              'Update password'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
