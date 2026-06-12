'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Search, Upload, Loader2, DollarSign, Globe, MapPin, TrendingUp, Sparkles, Building2, CheckCircle2, FileText, X, ArrowLeft, Bot, User, Send } from 'lucide-react'

type BenchmarkData = {
  roleName: string
  summary: string
  localRange: { min: string; max: string; average: string }
  remoteRange: { min: string; max: string; average: string }
  seniorityMultipliers: { level: string; multiplier: string; description: string }[]
  premiumSkills: { skill: string; bumpAmount: string; reason: string }[]
}

const predefinedRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "Product Designer (UI/UX)",
  "Digital Marketing Manager",
  "HR Manager",
  "Financial Analyst",
  "Operations Manager",
  "Sales Executive",
  "Customer Success Manager",
  "Cybersecurity Analyst",
  "Cloud Architect"
]

export default function SalaryBenchmarkPage() {
  // Benchmark State
  const [activeTab, setActiveTab] = useState('search')
  const [jobTitle, setJobTitle] = useState('')
  const [jdText, setJdText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null)

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I am your AI Compensation Analyst. Generate a benchmark on the left, and ask me for negotiation strategies or market context!" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const runBenchmark = async (mode: 'title' | 'jd', descriptionText: string = '') => {
    if (mode === 'title' && !jobTitle.trim()) return
    if (mode === 'jd' && !descriptionText.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/agents/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          jobTitle: mode === 'title' ? jobTitle : undefined,
          jobDescription: mode === 'jd' ? descriptionText : undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate benchmark')

      setBenchmark(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleJdSubmit = async () => {
    if (file) {
      setLoading(true)
      setError('')
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const uploadRes = await fetch('/api/parse-cv', {
          method: 'POST',
          body: formData
        })
        
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to parse document')
        
        await runBenchmark('jd', uploadData.text)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    } else if (jdText.trim()) {
      await runBenchmark('jd', jdText)
    }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return

    const userMessage = { role: 'user' as const, content: chatInput.trim() }
    setMessages(prev => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/agents/benchmark-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: benchmark // Pass the current benchmark so the AI knows what the user is looking at
        })
      })

      if (!response.ok) throw new Error('Failed to fetch response')
      
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble analyzing the data right now. Please try again later."
      }])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 animate-fade-in w-full pb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Salary Benchmark</h1>
            <p className="text-sm text-slate-500 mt-1">AI-driven compensation analysis for the Lebanese and MENA markets.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Benchmark Analysis Area */}
        <div className="lg:col-span-3 flex flex-col min-h-0 relative">
          {!benchmark ? (
            <div className="w-full pt-4 h-full overflow-y-auto pr-2 pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="search">Select Role</TabsTrigger>
                  <TabsTrigger value="upload">Analyze Job Description</TabsTrigger>
                </TabsList>
                
                {/* Tab: Search */}
                <TabsContent value="search">
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Benchmark</CardTitle>
                      <CardDescription>Select a common role to get instant market rates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form 
                        onSubmit={(e) => { e.preventDefault(); runBenchmark('title'); }}
                        className="flex gap-3"
                      >
                        <div className="relative flex-1">
                          <Select onValueChange={setJobTitle} value={jobTitle} disabled={loading}>
                            <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 focus:ring-slate-400">
                              <SelectValue placeholder="Select a job title..." />
                            </SelectTrigger>
                            <SelectContent>
                              {predefinedRoles.map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" disabled={!jobTitle || loading} className="h-12 px-6 bg-slate-900 text-white shrink-0">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze Market'}
                        </Button>
                      </form>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Upload */}
                <TabsContent value="upload">
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Deep JD Analysis</CardTitle>
                      <CardDescription>Upload or paste a Job Description to get a benchmark based on exact requirements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {!file ? (
                        <div 
                          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            accept=".pdf,.docx" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                          />
                          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm">Upload Job Description</h3>
                          <p className="text-xs text-slate-500 mt-1">PDF or DOCX (Max 5MB)</p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {!file && (
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or paste text</span></div>
                        </div>
                      )}

                      {!file && (
                        <textarea
                          placeholder="Paste the job description here..."
                          className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                          value={jdText}
                          onChange={(e) => setJdText(e.target.value)}
                          disabled={loading}
                        />
                      )}

                      <Button 
                        className="w-full h-12 bg-slate-900 text-white" 
                        onClick={handleJdSubmit}
                        disabled={loading || (!file && !jdText.trim())}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {loading ? 'Analyzing Market Data...' : 'Generate Exact Benchmark'}
                      </Button>
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex flex-col min-h-0 h-full overflow-y-auto pr-2 pb-2 space-y-4 animate-in fade-in slide-in-from-bottom-4 pt-1">
              <div className="flex items-center justify-between shrink-0 mb-2">
                <Button variant="ghost" size="sm" onClick={() => setBenchmark(null)} className="text-slate-500 hover:text-slate-900 -ml-2">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
                </Button>
              </div>

              <div className="text-left space-y-1 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">{benchmark.roleName}</h2>
                <p className="text-slate-500 text-xs leading-relaxed">{benchmark.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Local Market Card */}
                <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-blue-50 rounded-md">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Lebanon (On-site)</h3>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{benchmark.localRange.average}</span>
                      <span className="text-xs font-medium text-slate-500 mb-1">/ mo</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block mt-2">
                      Range: {benchmark.localRange.min} - {benchmark.localRange.max}
                    </p>
                  </CardContent>
                </Card>

                {/* Remote Market Card */}
                <Card className="border-slate-200 shadow-sm bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-emerald-50 rounded-md">
                        <Globe className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Remote (MENA/Global)</h3>
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{benchmark.remoteRange.average}</span>
                      <span className="text-xs font-medium text-slate-500 mb-1">/ mo</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block mt-2">
                      Range: {benchmark.remoteRange.min} - {benchmark.remoteRange.max}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Seniority Multipliers */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4 pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-slate-700" /> Seniority Multipliers
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {benchmark.seniorityMultipliers.map((tier, idx) => (
                      <div key={idx} className="p-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                        <div className="w-12 shrink-0 pt-0.5">
                          <span className="inline-block px-1.5 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded">
                            {tier.multiplier}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{tier.level}</h4>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{tier.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Premium Skills */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="border-b border-slate-100 bg-amber-50/30 p-4 pb-3">
                  <CardTitle className="text-sm flex items-center text-amber-700">
                    <Sparkles className="w-4 h-4 mr-2" /> Premium Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 gap-3">
                  {benchmark.premiumSkills.map((skill, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-bl-md">
                        {skill.bumpAmount}
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs mb-1.5 pr-8">{skill.skill}</h4>
                      <p className="text-[10px] text-slate-600 leading-snug">{skill.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
            </div>
          )}
        </div>

        {/* Right Column: AI Consultant Chat */}
        <div className="lg:col-span-2 flex flex-col min-h-0 h-full border-l border-slate-200 pl-6 pb-2">
          <Card className="flex-1 flex flex-col border-slate-200 shadow-sm relative overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white border-b border-slate-800 shrink-0 p-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Negotiation Coach</CardTitle>
                  <CardDescription className="text-slate-300 text-[10px] mt-0.5">Ask me to analyze the benchmark on the left</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`p-2.5 rounded-xl text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[11px]" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%] flex-row">
                    <div className="shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-xs">
                      <Loader2 className="w-3 h-3 animate-spin" /> Analyzing market...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                className="flex items-center gap-2"
              >
                <Input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="e.g. How do I ask for the upper range?"
                  className="bg-slate-50 border-slate-200 focus-visible:ring-slate-400 text-xs h-10"
                  disabled={chatLoading}
                />
                <Button type="submit" disabled={!chatInput.trim() || chatLoading} size="icon" className="h-10 w-10 bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
