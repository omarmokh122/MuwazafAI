'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, MailCheck, PlayCircle } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { PasswordField } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient, isAuthConfigured } from '@/lib/supabase/client'
import { signupSchema, zodFieldErrors, type FieldErrors } from '@/lib/auth/validation'
import { useUserProfile } from '@/lib/store/user-profile'

const TARGET_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Product Manager',
  'Project Manager',
  'UI/UX Designer',
  'Graphic Designer',
  'Marketing Manager',
  'Digital Marketing Specialist',
  'Sales Executive',
  'Business Development',
  'HR Specialist',
  'Financial Analyst',
  'Accountant',
  'Operations Manager',
  'Customer Success Manager',
  'Content Writer',
  'Civil Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  'Architect',
  'Teacher / Lecturer',
  'Healthcare Professional',
  'Legal Counsel',
  'Administrative Assistant',
  'Other',
]

const FIELDS = [
  'Technology & IT',
  'Finance & Banking',
  'Healthcare & Medical',
  'Education & Training',
  'Engineering',
  'Marketing & Advertising',
  'Sales & Retail',
  'Human Resources',
  'Legal & Compliance',
  'Construction & Real Estate',
  'Hospitality & Tourism',
  'Media & Communications',
  'Government & Public Sector',
  'NGO & Non-Profit',
  'Manufacturing',
  'Transportation & Logistics',
  'Telecommunications',
  'Energy & Utilities',
  'Agriculture & Food',
  'Other',
]

const selectClassName =
  'h-12 w-full rounded-xl border border-el-border-light bg-white px-3 text-[15px] text-el-black shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-black/20'

export default function SignupPage() {
  const router = useRouter()
  const authConfigured = isAuthConfigured()
  const { setProfile } = useUserProfile()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [field, setField] = useState('')

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = window.setTimeout(() => setResendCooldown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendCooldown])

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setResendMessage('')

    const parsed = signupSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      targetRole,
      field,
    })

    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error))
      return
    }
    setFieldErrors({})

    const supabase = createClient()
    if (!supabase) {
      setError('Account creation is not configured in this environment. Use the interactive demo instead.')
      return
    }

    setIsLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: {
            full_name: parsed.data.fullName,
            target_role: parsed.data.targetRole || null,
            field: parsed.data.field || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (signUpError) {
        const message = signUpError.message.toLowerCase()
        if (message.includes('rate limit') || message.includes('too many')) {
          setError('Too many attempts. Please wait a moment and try again.')
        } else if (message.includes('already registered') || message.includes('already exists')) {
          setError('That email cannot be used to create a new account. Try signing in instead.')
        } else {
          setError('We could not create your account right now. Please check your details and try again.')
        }
        return
      }

      setProfile({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        targetRole: parsed.data.targetRole || '',
        field: parsed.data.field || '',
      })

      if (data.session) {
        router.replace('/dashboard')
        router.refresh()
        return
      }

      setPendingEmail(parsed.data.email)
      setResendCooldown(60)
    } catch {
      setError('We could not create your account right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return
    const supabase = createClient()
    if (!supabase) return

    setResending(true)
    setResendMessage('')
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })
      setResendMessage(
        resendError ? 'Could not resend the email. Please try again shortly.' : 'Confirmation email sent.'
      )
      if (!resendError) setResendCooldown(60)
    } catch {
      setResendMessage('Could not resend the email. Please try again shortly.')
    } finally {
      setResending(false)
    }
  }

  const handleDemo = async () => {
    setError('')
    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data.error || 'Demo mode is unavailable right now.')
        return
      }
      window.location.assign('/dashboard')
    } catch {
      setError('Could not start the demo. Please try again.')
    }
  }

  if (pendingEmail) {
    return (
      <AuthShell
        eyebrow="Almost there"
        title="Check your inbox."
        subtitle="Confirm your email address to activate your Muwaazaf account."
        bullets={['Secure email confirmation', 'No password is stored in your browser', 'Your workspace opens after verification']}
        footer={
          <p className="text-center text-[13px] text-el-dark-gray">
            Already confirmed?{' '}
            <Link href="/login" className="font-semibold text-el-black underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        }
      >
        <div className="rounded-2xl border border-el-border-light bg-el-near-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-el-black">
            <MailCheck className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-el-dark-gray">
            We sent a confirmation link to
          </p>
          <p className="mt-1 break-all text-[15px] font-semibold text-el-black">{pendingEmail}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-el-warm-gray">
            The link expires for security. Check your spam folder if it does not arrive within a
            few minutes.
          </p>

          {resendMessage ? (
            <p role="status" className="mt-4 text-[12px] font-medium text-emerald-700">
              {resendMessage}
            </p>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="mt-5 h-11 w-full rounded-xl border-el-border-light bg-white text-[13px] font-medium text-el-black shadow-none hover:bg-el-light-gray"
          >
            {resending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend confirmation email'}
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Your career, elevated."
      subtitle="Create a private workspace for CV matching, applications, and interview practice."
      bullets={[
        'Free to start — no credit card required',
        'Your CV and workspace stay in your browser',
        'Built for the Lebanese and MENA job market',
      ]}
      footer={
        <div className="space-y-4">
          {!authConfigured ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleDemo}
              className="h-12 w-full rounded-xl border-el-border-light bg-el-near-white text-[14px] font-medium text-el-black shadow-none hover:bg-el-light-gray"
            >
              <PlayCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Explore the interactive demo
            </Button>
          ) : null}

          <p className="text-center text-[13px] text-el-dark-gray">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-el-black underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSignup} noValidate className="space-y-4">
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"
          >
            {error}
          </div>
        ) : null}

        {!authConfigured ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
            Account creation is not configured on this deployment. The interactive demo is
            fully available.
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[13px] font-medium text-el-black">
            Full name
          </Label>
          <Input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Omar Mokhtar"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.fullName)}
            className="h-12 rounded-xl border-el-border-light bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-el-black/20"
          />
          {fieldErrors.fullName ? (
            <p role="alert" className="text-xs font-medium text-red-600">{fieldErrors.fullName}</p>
          ) : null}
        </div>

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
            className="h-12 rounded-xl border-el-border-light bg-white text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-el-black/20"
          />
          {fieldErrors.email ? (
            <p role="alert" className="text-xs font-medium text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          autoComplete="new-password"
          showStrength
        />

        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="targetRole" className="text-[13px] font-medium text-el-black">
              Target role <span className="font-normal text-el-warm-gray">(optional)</span>
            </Label>
            <select
              id="targetRole"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              className={selectClassName}
            >
              <option value="">Select a role</option>
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field" className="text-[13px] font-medium text-el-black">
              Industry <span className="font-normal text-el-warm-gray">(optional)</span>
            </Label>
            <select
              id="field"
              value={field}
              onChange={(event) => setField(event.target.value)}
              className={selectClassName}
            >
              <option value="">Select an industry</option>
              {FIELDS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-el-warm-gray">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
          We use your details only to operate your workspace. You can clear all local data at any
          time from your profile.
        </p>

        <Button
          type="submit"
          disabled={isLoading || !authConfigured}
          className="h-12 w-full rounded-xl bg-el-black text-[14px] font-semibold text-white shadow-none transition-colors hover:bg-el-dark-gray disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  )
}
