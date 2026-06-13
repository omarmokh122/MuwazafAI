'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileSearch, Loader2, CheckCircle2, AlertCircle, Target, UploadCloud, ArrowRight } from 'lucide-react'
import { extractSkills } from '@/lib/parsers/skills'
import { useRouter } from 'next/navigation'
import { useInterviewStore } from '@/lib/store/interview-store'
import { useUserProfile } from '@/lib/store/user-profile'

export default function CVMatcherPage() {
  const router = useRouter()
  const [cvText, setCvText] = useState('')
  const [jobText, setJobText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jobFileInputRef = useRef<HTMLInputElement>(null)
  
  const { cvText: profileCvText } = useUserProfile()

  useEffect(() => {
    if (profileCvText && !cvText) {
      setCvText(profileCvText)
    }
  }, [profileCvText])

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

  const handleJobFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setJobText(event.target?.result as string || '')
    }
    reader.readAsText(file) // For a real app, use a PDF parser API
  }

  const handleScan = async () => {
    setLoading(true)
    
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
    <div className="flex-1 flex flex-col space-y-4 animate-fade-in w-full pb-4">
      <div className="flex items-center gap-4 border-b pb-4 shrink-0">
        <div className="p-2 bg-slate-900 text-white rounded-xl shadow-sm">
          <FileSearch className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CV Matcher</h1>
          <p className="text-sm text-slate-500 mt-1">Scan your CV against live job descriptions to identify exact skill gaps.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col min-h-0 h-full">
          <Card className="flex-1 flex flex-col border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4 pb-3 shrink-0">
              <CardTitle className="text-base text-slate-800">1. Input Details</CardTitle>
              <CardDescription className="text-xs">Provide your CV text and the target job description.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4 p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-slate-700">Resume Content</Label>
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
                      className="h-8 text-xs bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    >
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload File
                    </Button>
                  </div>
                </div>
                <Textarea 
                  placeholder="Paste your CV content here..." 
                  className="flex-1 min-h-0 h-32 border-slate-200 focus-visible:ring-slate-400 bg-slate-50/50 text-sm"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-slate-700">Job Description</Label>
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
                  placeholder="Paste the target job description here..." 
                  className="flex-1 min-h-0 h-32 border-slate-200 focus-visible:ring-slate-400 bg-slate-50/50 text-sm"
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
              </div>
              <div className="mt-auto pt-2">
                <Button 
                  onClick={handleScan} 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 text-sm font-semibold shrink-0"
                  disabled={loading || !cvText || !jobText}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Match...</>
                  ) : (
                    <><Target className="mr-2 h-4 w-4" /> Calculate Fit Score</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col min-h-0 h-full">
          <Card className={`h-full border-slate-200 shadow-sm flex flex-col ${!result && !loading ? 'bg-slate-50' : 'bg-white'}`}>
            <CardHeader className={`${result || loading ? 'bg-slate-50/50 border-b border-slate-100' : ''} p-4 pb-3 shrink-0`}>
              <CardTitle className="text-base text-slate-800">2. Match Analysis</CardTitle>
              <CardDescription className="text-xs">Your ATS fit score and detailed gap analysis.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-y-auto">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 min-h-0">
                  <Loader2 className="h-10 w-10 animate-spin mb-6 text-slate-400" />
                  <p className="font-medium text-slate-700">Analyzing requirements...</p>
                  <p className="text-sm mt-2 text-slate-500 max-w-xs text-center">Parsing semantics and matching keywords against industry standards.</p>
                </div>
              ) : result ? (
                <div className="space-y-8 animate-fade-in flex-1">
                  <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-7xl font-extrabold text-slate-900 mb-2">{result.score}%</div>
                    <p className="font-semibold text-lg text-slate-600 tracking-tight">Overall Fit Score</p>
                    <Progress value={result.score} className="h-2.5 mt-6 bg-slate-200 [&>div]:bg-slate-900 w-2/3 mx-auto" />
                    <p className="text-sm text-slate-600 mt-6 leading-relaxed max-w-sm mx-auto">{result.analysis}</p>
                  </div>

                  <Tabs defaultValue="gaps" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
                      <TabsTrigger value="gaps" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Missing Skills ({result.gaps.length})</TabsTrigger>
                      <TabsTrigger value="matches" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Matching ({result.matching.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gaps" className="mt-6">
                      {result.gaps.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {result.gaps.map((skill: string, i: number) => (
                            <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm font-medium">
                              <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-red-500" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-700">No skill gaps found!</p>
                          <p className="text-xs text-slate-500 mt-1">Your profile perfectly matches the requirements.</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="matches" className="mt-6">
                      {result.matching.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {result.matching.map((skill: string, i: number) => (
                            <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-700">No matching skills found.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  {result.gaps.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 mt-auto">
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
                        className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm h-12 font-semibold"
                      >
                        Practice Missing Skills <ArrowRight className="ml-2 h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-0">
                  <Target className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium text-slate-600">Awaiting Input</p>
                  <p className="text-sm mt-1 max-w-xs text-center">Run the analysis to view your ATS score and skill gaps.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
