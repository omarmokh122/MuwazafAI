'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/lib/store/interview-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Loader2, Wand2, Briefcase, Copy, Download, UserCircle, CheckCircle2 } from 'lucide-react'

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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-fuchsia-600 text-white rounded-xl shadow-lg shadow-fuchsia-200">
          <Briefcase className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cover Letter AI</h1>
          <p className="text-slate-500">Generate highly-targeted cover letters based on your uploaded CV.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Your Resume</CardTitle>
              <CardDescription>We will use the CV you uploaded to your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              {cvText ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-emerald-800 text-sm">Active Resume Ready</p>
                      <p className="text-xs text-emerald-600">{cvFileName || 'Uploaded via matcher'}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/profile')} className="text-emerald-700 hover:bg-emerald-100">
                    Change
                  </Button>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <UserCircle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                  <p className="font-semibold text-amber-800 mb-4">No CV Found</p>
                  <Button onClick={() => router.push('/profile')} className="bg-amber-600 hover:bg-amber-700">
                    Upload CV in Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. The Job Description</CardTitle>
              <CardDescription>Paste the target JD so the AI can tailor your letter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
                value={localJobText}
                onChange={(e) => setLocalJobText(e.target.value)}
              />
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">3. Select Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTone === tone 
                          ? 'bg-fuchsia-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <Button 
                onClick={generateLetter} 
                disabled={isGenerating || !cvText || !localJobText} 
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 h-12 text-lg mt-4"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
                {isGenerating ? 'Drafting Masterpiece...' : 'Generate Cover Letter'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Output Editor */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col border-none shadow-xl bg-slate-50 overflow-hidden">
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
            <CardContent className="p-0 flex-1 relative min-h-[500px]">
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin mb-4" />
                  <p className="font-bold text-slate-700">Writing your cover letter...</p>
                  <p className="text-sm text-slate-500">Mapping your achievements to the JD.</p>
                </div>
              )}
              
              {coverLetter ? (
                <Textarea 
                  className="w-full h-full min-h-[500px] border-none bg-transparent p-8 text-slate-700 leading-relaxed resize-none focus-visible:ring-0 rounded-none shadow-inner"
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
