'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2, PlayCircle } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient, isAuthConfigured } from '@/lib/supabase/client'
import { loginSchema, zodFieldErrors, type FieldErrors } from '@/lib/auth/validation'
import { safeRedirectPath } from '@/lib/security/redirect'
import { authErrorMessage } from '@/lib/client/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authConfigured = isAuthConfigured()

  const redirectTo = safeRedirectPath(searchParams.get('redirect'))
  const queryError = authErrorMessage(searchParams.get('error'))
  const notice =
    searchParams.get('reset') === 'success'
      ? 'Your password was updated. Sign in with your new password.'
      : ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const displayedError = error || queryError

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error))
      return
    }
    setFieldErrors({})

    const supabase = createClient()
    if (!supabase) {
      setError('Account sign-in is not configured in this environment. Use the interactive demo below.')
      return
    }

    setIsLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      })

      if (signInError) {
        const message = signInError.message.toLowerCase()
        if (message.includes('invalid login')) {
          setError('Incorrect email or password.')
        } else if (message.includes('email not confirmed')) {
          setError('Please confirm your email address before signing in.')
        } else if (message.includes('rate limit') || message.includes('too many')) {
          setError('Too many attempts. Please wait a moment and try again.')
        } else {
          setError('We could not sign you in right now. Please try again.')
        }
        return
      }

      router.replace(redirectTo)
      router.refresh()
    } catch {
      setError('We could not sign you in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemo = async () => {
    setError('')
    setIsDemoLoading(true)

    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(
          response.status === 429
            ? 'Too many demo sessions from this network. Please try again later.'
            : data.error || 'Demo mode is unavailable right now.'
        )
        return
      }

      window.location.assign(redirectTo)
    } catch {
      setError('Could not start the demo. Please try again.')
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where you left off."
      subtitle="Your CV, applications, and interview practice in one private workspace."
      bullets={[
        'AI CV matching, cover letters, and mock interviews',
        'Your workspace data is stored in your browser',
        'Signed sessions and encrypted transport by default',
      ]}
      footer={
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-el-warm-gray">
            <span className="h-px flex-1 bg-el-border-light" />
            or
            <span className="h-px flex-1 bg-el-border-light" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemo}
            disabled={isDemoLoading || isLoading}
            className="h-12 w-full rounded-xl border-el-border-light bg-el-near-white text-[14px] font-medium text-el-black shadow-none hover:bg-el-light-gray"
          >
            {isDemoLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {isDemoLoading ? 'Starting demo…' : 'Explore the interactive demo'}
          </Button>

          <p className="text-center text-[13px] text-el-dark-gray">
            New to Muwaazaf?{' '}
            <Link
              href="/signup"
              className="font-semibold text-el-black underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleLogin} noValidate className="space-y-5">
        {notice ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800"
          >
            {notice}
          </div>
        ) : null}

        {displayedError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
          >
            {displayedError}
          </div>
        ) : null}

        {!authConfigured ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
            Account sign-in is not configured on this deployment. The interactive demo is
            fully available.
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[13px] font-medium text-el-black">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className="h-12 rounded-xl border-el-border-light bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-el-black/20"
          />
          {fieldErrors.email ? (
            <p id="email-error" role="alert" className="text-xs font-medium text-red-600">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-[13px]">
          <Link
            href="/forgot-password"
            className="font-medium text-el-dark-gray underline-offset-4 hover:text-el-black hover:underline"
          >
            Forgot password?
          </Link>
          <span className="text-el-warm-gray">Secure sign-in</span>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isDemoLoading || !authConfigured}
          className="h-12 w-full rounded-xl bg-el-black text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-el-dark-gray disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
