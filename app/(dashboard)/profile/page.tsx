'use client'

import { useState, useRef, useEffect } from 'react'
import { useInterviewStore } from '@/lib/store/interview-store'
import { useUserProfile } from '@/lib/store/user-profile'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileUp, FileText, Loader2, CheckCircle2, UserCircle, Shield, ChevronDown, Save } from 'lucide-react'

/* ─── Dropdown Select ────────────────────────── */
function SelectField({
  id, label, options, value, onChange, placeholder,
}: {
  id: string; label: string; options: string[]; value: string; onChange: (v: string) => void; placeholder: string
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
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            value ? 'text-slate-900 border-slate-200' : 'text-slate-400 border-slate-200'
          }`}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-xl">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50 ${
                  value === opt ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-600'
                }`}
                onClick={() => { onChange(opt); setOpen(false) }}
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

/* ─── Options ────────────────────────── */
const POSITIONS = [
  'Unemployed', 'Student', 'Fresh Graduate', 'Intern', 'Junior Employee',
  'Mid-Level Professional', 'Senior Professional', 'Team Lead', 'Manager',
  'Director', 'VP / Executive', 'Freelancer / Consultant', 'Business Owner',
]

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Analyst', 'Data Scientist', 'Product Manager', 'Project Manager',
  'UI/UX Designer', 'Graphic Designer', 'Marketing Manager', 'Digital Marketing Specialist',
  'Sales Executive', 'Business Development', 'HR Specialist', 'Financial Analyst',
  'Accountant', 'Operations Manager', 'Customer Success Manager', 'Content Writer',
  'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Architect',
  'Teacher / Lecturer', 'Healthcare Professional', 'Legal Counsel', 'Administrative Assistant', 'Other',
]

const FIELDS = [
  'Technology & IT', 'Finance & Banking', 'Healthcare & Medical', 'Education & Training',
  'Engineering', 'Marketing & Advertising', 'Sales & Retail', 'Human Resources',
  'Legal & Compliance', 'Construction & Real Estate', 'Hospitality & Tourism',
  'Media & Communications', 'Government & Public Sector', 'NGO & Non-Profit',
  'Manufacturing', 'Transportation & Logistics', 'Telecommunications',
  'Energy & Utilities', 'Agriculture & Food', 'Other',
]

/* ─── Main Page ────────────────────────── */
export default function ProfilePage() {
  const profile = useUserProfile()
  const { cvFileName: storeCvFile, setInterviewData } = useInterviewStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [role, setRole] = useState('')
  const [field, setField] = useState('')
  const [cvText, setCvText] = useState('')
  const [saved, setSaved] = useState(false)
  
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load profile data from store on mount
  useEffect(() => {
    setName(profile.fullName || '')
    setEmail(profile.email || '')
    setPosition(profile.currentPosition || '')
    setRole(profile.targetRole || '')
    setField(profile.field || '')
    setCvText(profile.cvText || storeCvFile ? profile.cvText : '') // Initialize from store
  }, [profile.fullName, profile.email, profile.currentPosition, profile.targetRole, profile.field, profile.cvText, storeCvFile])

  const handleSave = () => {
    profile.setProfile({
      fullName: name,
      email,
      currentPosition: position,
      targetRole: role,
      field,
      cvText: cvText,
    })
    setInterviewData({ cvText: cvText })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const activeCvName = profile.cvFileName || storeCvFile

  const handleFile = async (file: File) => {
    if (!file) return
    
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!['.pdf', '.docx', '.doc'].includes(ext)) {
      setError('Please upload a PDF or Word document.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Save to both stores
      setInterviewData({ cvText: data.text, cvFileName: data.fileName })
      profile.setProfile({ cvText: data.text, cvFileName: data.fileName })
      setCvText(data.text)
    } catch (err: any) {
      setError(err.message || 'Failed to process file')
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-lg font-bold">
          {profile.initials()}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-slate-500">Manage your background and CV documents globally.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Profile Info Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Your personal information and career goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@example.com"
                />
              </div>
              <SelectField
                id="profile-position"
                label="Current Position"
                options={POSITIONS}
                value={position}
                onChange={setPosition}
                placeholder="Select your status"
              />
              <SelectField
                id="profile-role"
                label="Target Role"
                options={ROLES}
                value={role}
                onChange={setRole}
                placeholder="Role you're seeking"
              />
              <SelectField
                id="profile-field"
                label="Industry / Field"
                options={FIELDS}
                value={field}
                onChange={setField}
                placeholder="Select your field"
              />
              <Button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4"
                onClick={handleSave}
              >
                {saved ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved!</span>
                ) : (
                  <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-50 border-none shadow-inner">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-slate-400 mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Privacy & Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your uploaded resume is parsed securely. The text is stored entirely locally on your device using your browser's persistent storage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CV Upload Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Resume</CardTitle>
              <CardDescription>Upload your primary CV. This will be automatically used by the Cover Letter Generator, CV Matcher, and Interview Academy.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeCvName ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        Active Resume <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </h3>
                      <p className="text-slate-600 text-sm">{activeCvName}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update File'}
                  </Button>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Drag & Drop your CV here</h3>
                  <p className="text-sm text-slate-500 mb-4">Supports PDF, DOC, and DOCX (Max 10MB)</p>
                  <Button disabled={isUploading} className="bg-violet-600 hover:bg-violet-700">
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Browse Files'}
                  </Button>
                </div>
              )}
              {error && <p className="text-red-500 mt-4 text-sm font-medium text-center">{error}</p>}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0])
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw CV Text</CardTitle>
              <CardDescription>If your file failed to upload or parsing missed something, you can manually paste or edit your CV text here.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-64 p-4 rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 text-sm font-mono text-slate-700 resize-y"
                placeholder="Paste your CV text here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleSave}>
                  {saved ? (
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved!</span>
                  ) : (
                    <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save CV Text</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
