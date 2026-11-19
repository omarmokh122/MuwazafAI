'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient, isAuthConfigured } from '@/lib/supabase/client'
import { resetRequestSchema } from '@/lib/auth/validation'

export default function ForgotPasswordPage() {
  const authConfigured = isAuthConfigured()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    const parsed = resetRequestSchema.safeParse({ email })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Enter a valid email address.')
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError('Password reset is not configured in this environment.')
      return
    }

    setIsLoading(true)
    try {
      await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })
      // Always show the same result to avoid revealing which emails are registered.
      setSent(true)
      setCooldown(60)
    } catch {
      setError('We could not send the reset email right now. Please try again shortly.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password."
      subtitle="We will email you a secure link to choose a new password."
      bullets={[
        'Links are single-use and time-limited',
        'We never reveal whether an email is registered',
        'Your workspace data stays untouched',
      ]}
      footer={
        <p className="text-center text-[13px] text-el-dark-gray">
          Remembered it?{' '}
          <Link href="/login" className="font-semibold text-el-black underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-el-border-light bg-el-near-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-el-black">
            <MailCheck className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-[16px] font-semibold text-el-black">Check your inbox</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-el-dark-gray">
            If an account exists for that address, a reset link is on its way. The link expires
            shortly for security.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSent(false)
              setCooldown(0)
            }}
            className="mt-5 h-11 w-full rounded-xl border-el-border-light bg-white text-[13px] font-medium text-el-black shadow-none hover:bg-el-light-gray"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Use a different email
          </Button>
          {cooldown > 0 ? (
            <p className="mt-3 text-center text-[11px] text-el-warm-gray">
              You can request another link in {cooldown}s.
            </p>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          ) : null}

          {!authConfigured ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
              Password reset is not configured on this deployment.
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
              className="h-12 rounded-xl border-el-border-light bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-el-black/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || cooldown > 0 || !authConfigured}
            className="h-12 w-full rounded-xl bg-el-black text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-el-dark-gray disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : cooldown > 0 ? (
              `Try again in ${cooldown}s`
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
