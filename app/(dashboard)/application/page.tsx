'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/lib/store/interview-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Loader2, Wand2, Briefcase, Copy, Download, UserCircle, CheckCircle2, UploadCloud } from 'lucide-react'

const TONES = ['Professional', 'Creative', 'Highly Technical', 'Aggressive / Confident']

export default function CoverLetterPage() {
  const router = useRouter()
  const { cvText, cvFileName, jobText, setInterviewData } = useInterviewStore()
  
  const [localJobText, setLocalJobText] = useState(jobText || '')
  const [selectedTone, setSelectedTone] = useState(TONES[0])
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const jobFileInputRef = useRef<HTMLInputElement>(null)

  const handleJobFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setLocalJobText(event.target?.result as string || '')
    }
    reader.readAsText(file)
  }

  const generateLetter = async () => {
    if (!cvText) {
      setError("Please upload your CV in your Profile first.")
      return
    }
    if (!localJobText) {
      setError("Please paste the Job Description.")
      return
    }

    // Save JD globally in case they want to use it for Interview Prep later
    setInterviewData({ jobText: localJobText })

    setIsGenerating(true)
    setError('')
    setCoverLetter('')

    try {
      const res = await fetch('/api/agents/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobText: localJobText, tone: selectedTone })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setCoverLetter(data.coverLetter)
    } catch (err: any) {
      setError(err.message || "Failed to generate cover letter.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 animate-fade-in w-full pb-4">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 shrink-0">
        <div className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cover Letter AI</h1>
          <p className="text-sm text-slate-500 mt-1">Generate highly-targeted cover letters based on your uploaded CV.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Left Col: Inputs */}
        <div className="flex flex-col min-h-0 h-full overflow-y-auto pr-2 space-y-3 pb-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-3 pb-2">
              <CardTitle className="text-base text-slate-800">1. Your Resume</CardTitle>
              <CardDescription className="text-xs">We will use the CV you uploaded to your profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-3">
              {cvText ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-700" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Active Resume Ready</p>
                      <p className="text-xs text-slate-500">{cvFileName || 'Uploaded via matcher'}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/profile')} className="text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white">
                    Change
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <UserCircle className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <p className="font-semibold text-slate-700 mb-3 text-sm">No CV Found</p>
                  <Button size="sm" onClick={() => router.push('/profile')} className="bg-slate-900 hover:bg-slate-800 text-white">
                    Upload CV in Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm shrink-0">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-3 pb-2">
              <CardTitle className="text-base text-slate-800">2. Job & Tone</CardTitle>
              <CardDescription className="text-xs">Paste the target JD so the AI can tailor your letter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 block">Job Description</label>
                  <div>
                    <input 
                      type="file" 
                      accept=".txt,.pdf,.doc,.docx" 
                      className="hidden" 
                      ref={jobFileInputRef}
                      onChange={handleJobFileUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => jobFileInputRef.current?.click()}
                      className="h-8 text-xs bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    >
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload File
                    </Button>
                  </div>
                </div>
                <Textarea 
                  placeholder="Paste the job description here..."
                  className="h-20 min-h-0 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-400 text-xs"
                  value={localJobText}
                  onChange={(e) => setLocalJobText(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">3. Select Tone</label>
                <div className="flex flex-wrap gap-2.5">
                  {TONES.map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                        selectedTone === tone 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-600 mt-3 font-medium bg-red-50 border border-red-100 inline-block px-3 py-1.5 rounded-md text-sm">{error}</p>}

              <Button 
                onClick={generateLetter} 
                disabled={isGenerating || !cvText || !localJobText} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 text-sm font-semibold mt-2"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
                {isGenerating ? 'Drafting Masterpiece...' : 'Generate Cover Letter'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Output Editor */}
        <div className="flex flex-col min-h-0 h-full">
          <Card className="flex-1 flex flex-col border-none shadow-xl bg-slate-50 overflow-hidden">
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="font-semibold">Generated Document</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleCopy} disabled={!coverLetter}>
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                {/* Future: Add PDF download logic here */}
                <Button size="sm" variant="outline" disabled={!coverLetter} className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1 relative min-h-0 flex flex-col">
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-700">Writing your cover letter...</p>
                  <p className="text-sm text-slate-500">Mapping your achievements to the JD.</p>
                </div>
              )}
              
              {coverLetter ? (
                <Textarea 
                  className="flex-1 w-full min-h-0 border-none bg-transparent p-6 text-slate-700 leading-relaxed resize-none focus-visible:ring-0 rounded-none shadow-inner"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <FileText className="w-16 h-16 mb-4 opacity-20" />
                  <p>Your AI-generated cover letter will appear here.</p>
                  <p className="text-sm mt-2 max-w-sm">You can edit the final document directly before copying or exporting it.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
