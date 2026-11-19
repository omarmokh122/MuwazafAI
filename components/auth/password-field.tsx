'use client'

import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type PasswordFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
  placeholder?: string
  showStrength?: boolean
}

function scorePassword(value: string): number {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/[0-9]/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  return Math.min(4, score)
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-emerald-600',
]

export function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete = 'current-password',
  placeholder = '••••••••',
  showStrength = false,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  const errorId = `${id}-error`
  const score = scorePassword(value)

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-medium text-el-black">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-12 rounded-xl border-el-border-light bg-white pr-11 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-el-black/20',
            error && 'border-red-300 focus-visible:ring-red-200'
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-lg text-el-warm-gray transition-colors hover:bg-el-near-white hover:text-el-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-black/20"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrength && value ? (
        <div className="space-y-1.5 pt-1" aria-live="polite">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={cn(
                  'h-1 flex-1 rounded-full bg-el-border-light transition-colors',
                  index < score && STRENGTH_COLORS[score]
                )}
              />
            ))}
          </div>
          <p className="text-[11px] text-el-warm-gray">
            Password strength: <span className="font-medium text-el-dark-gray">{STRENGTH_LABELS[score]}</span>
          </p>
        </div>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
