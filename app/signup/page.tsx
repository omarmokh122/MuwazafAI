'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Upload, FileText, CheckCircle2, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserProfile } from '@/lib/store/user-profile'
import { useInterviewStore } from '@/lib/store/interview-store'

/* ─── Dot Grid Canvas (follows mouse) ────────────────────────── */
function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    const gap = 28
    const baseRadius = 1.5
    const maxRadius = 4
    const influence = 140

    for (let x = gap; x < canvas.offsetWidth; x += gap) {
      for (let y = gap; y < canvas.offsetHeight; y += gap) {
        const dx = x - mouse.current.x
        const dy = y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        const t = Math.max(0, 1 - dist / influence)
        const radius = baseRadius + (maxRadius - baseRadius) * t
        const alpha = 0.12 + 0.4 * t

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.fill()
      }
    }

    animRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
  }

  const handleMouseLeave = () => {
    mouse.current = { x: -1000, y: -1000 }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  )
}

/* ─── Custom Select Component ────────────────────────── */
function SelectDropdown({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="space-y-2" ref={ref}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 ${
            value ? 'text-slate-900 border-slate-300' : 'text-slate-400 border-slate-200'
          }`}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl ${
                  value === opt ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-600'
                }`}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Options Data ────────────────────────── */
const CURRENT_POSITIONS = [
  'Unemployed',
  'Student',
  'Fresh Graduate',
  'Intern',
  'Junior Employee',
  'Mid-Level Professional',
  'Senior Professional',
  'Team Lead',
  'Manager',
  'Director',
  'VP / Executive',
  'Freelancer / Consultant',
  'Business Owner',
]

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

/* ─── Main Page ────────────────────────── */
export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [currentPosition, setCurrentPosition] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [field, setField] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvUploading, setCvUploading] = useState(false)
  const [cvSuccess, setCvSuccess] = useState(false)
  const [cvError, setCvError] = useState('')
  const [parsedCvText, setParsedCvText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { setProfile } = useUserProfile()
  const { setInterviewData } = useInterviewStore()

  const handleCvFile = async (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const validExtensions = ['.pdf', '.doc', '.docx']
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      setCvError('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setCvError('File size must be less than 10MB')
      return
    }

    setCvFile(file)
    setCvError('')
    setCvUploading(true)
    setCvSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/parse-cv', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to process file')

      setParsedCvText(data.text)
      setCvSuccess(true)
    } catch (err: any) {
      setCvError(err.message || 'Failed to process file. Please try again.')
      setCvFile(null)
    } finally {
      setCvUploading(false)
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Save all signup data to the central profile store
    setProfile({
      fullName: nameValue,
      email: emailValue,
      currentPosition,
      targetRole,
      field,
      cvText: parsedCvText,
      cvFileName: cvFile?.name || null,
    })

    // Also feed CV into the interview store so other features can use it
    if (parsedCvText) {
      setInterviewData({ cvText: parsedCvText, cvFileName: cvFile?.name || null })
    }

    setTimeout(() => {
      document.cookie = 'demo_mode=true; path=/; max-age=86400'
      window.location.href = '/dashboard'
    }, 1200)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* ─── Left Panel: White with interactive dot grid ─── */}
      <div className="hidden lg:flex w-[45%] relative items-center justify-center p-16 overflow-hidden bg-white border-r border-slate-100">
        <DotGrid />

        <div className="relative z-10 max-w-md">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#0F172A" />
                <path d="M12 28V14l8 6 8-6v14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Muwaazaf</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-slate-900 mb-5 leading-[1.15] tracking-tight">
            Your career,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-900">
              elevated.
            </span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-10">
            AI-powered tools to match your CV, craft cover letters, and prepare for interviews — all in one platform.
          </p>

          <div className="space-y-4">
            {[
              'Smart CV matching with job descriptions',
              'AI-generated cover letters in seconds',
              'Mock interview simulation with feedback',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-600 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Form ─── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10 overflow-y-auto">
        <div className="mx-auto w-full max-w-lg">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-slate-500 mt-1.5 text-sm">Get started for free — no credit card required.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Omar Mokhtar" required className="h-12 rounded-xl" value={nameValue} onChange={(e) => setNameValue(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="h-12 rounded-xl" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min 8 characters" required className="h-12 rounded-xl" />
            </div>

            {/* Dropdown selects */}
            <div className="grid grid-cols-2 gap-4">
              <SelectDropdown
                id="current-position"
                label="Current Position"
                placeholder="Select your status"
                options={CURRENT_POSITIONS}
                value={currentPosition}
                onChange={setCurrentPosition}
              />
              <SelectDropdown
                id="target-role"
                label="Target Role"
                placeholder="Role you're seeking"
                options={TARGET_ROLES}
                value={targetRole}
                onChange={setTargetRole}
              />
            </div>

            <SelectDropdown
              id="field"
              label="Industry / Field"
              placeholder="Select your field"
              options={FIELDS}
              value={field}
              onChange={setField}
            />

            {/* CV Upload */}
            <div className="space-y-2">
              <Label>Upload CV <span className="text-slate-400 font-normal">(optional)</span></Label>
              {cvFile && cvSuccess ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="p-2 bg-white rounded-lg">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{cvFile.name}</p>
                    <p className="text-xs text-emerald-600">Parsed successfully</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCvFile(null)
                      setCvSuccess(false)
                      if (fileRef.current) fileRef.current.value = ''
                    }}
                    className="p-1 rounded-md hover:bg-emerald-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => !cvUploading && fileRef.current?.click()}
                  className={`flex items-center gap-3 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-all ${
                    cvUploading
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {cvUploading ? (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {cvUploading ? 'Processing...' : 'Click to upload PDF, DOC or DOCX'}
                    </p>
                    <p className="text-xs text-slate-400">Max file size: 10MB</p>
                  </div>
                </div>
              )}
              {cvError && (
                <p className="text-red-500 text-xs font-medium mt-1">{cvError}</p>
              )}
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleCvFile(f)
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all mt-2 shadow-lg shadow-slate-900/10"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-slate-900 hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
