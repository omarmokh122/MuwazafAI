'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileSearch, Loader2, CheckCircle2, AlertCircle, Target, UploadCloud, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/lib/store/interview-store'

interface CVMatchResult {
  score: number
  matching: string[]
  gaps: string[]
  analysis: string
}

export default function CVMatcherPage() {
  const router = useRouter()
  const [cvText, setCvText] = useState('')
  const [jobText, setJobText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CVMatchResult | null>(null)
  const [selectedSavedJobId, setSelectedSavedJobId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const { savedJobDescriptions, setInterviewData } = useInterviewStore()

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      // Very basic text extraction for demo purposes
      setCvText(event.target?.result as string || '')
    }
    reader.readAsText(file) // For a real app, use a PDF parser API
  }

  const handleScan = async () => {
    setLoading(true)
    setInterviewData({ cvText, jobText })
    
    try {
      const response = await fetch('/api/agents/cv-matcher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cvText, jobText })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze CV')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
      setResult({
        score: 0,
        matching: [],
        gaps: [],
        analysis: "An error occurred while analyzing the CV. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl">
          <FileSearch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">CV Matcher</h1>
          <p className="text-slate-500">Compare your CV with a job description and get a clear view of fit, strengths, and gaps.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>Upload your CV, then paste a fresh job description or choose one you already saved.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Your CV</Label>
                  <div>
                    <input 
                      type="file" 
                      accept=".txt,.pdf,.doc,.docx" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    >
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload File
                    </Button>
                  </div>
                </div>
                <Textarea 
                  placeholder="Or paste your CV content here..." 
                  className="min-h-[160px] border-slate-200 focus-visible:ring-cyan-500"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                />
              </div>
              {savedJobDescriptions.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">Saved Job Descriptions</Label>
                    <Sparkles className="h-4 w-4 text-cyan-600" />
                  </div>
                  <select
                    value={selectedSavedJobId}
                    onChange={(e) => {
                      const nextId = e.target.value
                      setSelectedSavedJobId(nextId)
                      const saved = savedJobDescriptions.find((item) => item.id === nextId)
                      setJobText(saved?.text || '')
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">Choose a saved description</option>
                    {savedJobDescriptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs leading-5 text-slate-500">
                    Choose a job description from the tracker, or paste a new one below.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea 
                  placeholder="Paste the job description here..." 
                  className="min-h-[160px] border-slate-200 focus-visible:ring-cyan-500"
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleScan} 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={loading || !cvText || !jobText}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning Profile...</>
                ) : (
                  <><FileSearch className="mr-2 h-4 w-4" /> Run Skill Analysis</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={`h-full border-slate-200 shadow-sm ${!result && !loading ? 'opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>The result will appear here, and we’ll scroll to it once the scan finishes.</CardDescription>
            </CardHeader>
            <CardContent ref={resultRef}>
              {loading ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-slate-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-cyan-600" />
                  <p>Analyzing the match...</p>
                  <p className="text-sm">Comparing skills and reading the fit.</p>
                </div>
              ) : result ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">Fit score</p>
                        <div className="mt-1 text-5xl font-bold text-slate-900">{result.score}%</div>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{result.analysis}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
                        <div className="rounded-2xl border border-white bg-white p-3 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Matches</div>
                          <div className="mt-1 text-xl font-semibold text-emerald-600">{result.matching.length}</div>
                        </div>
                        <div className="rounded-2xl border border-white bg-white p-3 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Gaps</div>
                          <div className="mt-1 text-xl font-semibold text-rose-600">{result.gaps.length}</div>
                        </div>
                      </div>
                    </div>
                    <Progress value={result.score} className="mt-5 h-3 bg-white [&>div]:bg-cyan-500" />
                  </div>

                  <Tabs defaultValue="gaps" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                      <TabsTrigger value="gaps" className="data-[state=active]:bg-white">Missing Skills ({result.gaps.length})</TabsTrigger>
                      <TabsTrigger value="matches" className="data-[state=active]:bg-white">Matching ({result.matching.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gaps" className="mt-4">
                      {result.gaps.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.gaps.map((skill: string, i: number) => (
                            <Badge key={i} variant="destructive" className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
                              <AlertCircle className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No skill gaps found! You are a perfect match.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="matches" className="mt-4">
                      {result.matching.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.matching.map((skill: string, i: number) => (
                            <Badge key={i} variant="outline" className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No matching skills found.</p>
                      )}
                    </TabsContent>
                  </Tabs>

                  {result.gaps.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-sm font-medium mb-4 text-slate-700">Next Step</p>
                      <Button 
                        onClick={() => {
                          useInterviewStore.getState().setInterviewData({
                            cvText,
                            jobText,
                            gaps: result.gaps,
                            matching: result.matching
                          })
                          router.push('/interview-prep')
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Target className="mr-2 h-4 w-4" /> Send gaps to Interview Prep
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  Run an analysis to see results here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
