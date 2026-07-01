'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Scale, Clock, Calendar, Shield, Briefcase, Bot, User, Send, Loader2, Sparkles, Banknote, Users, ArrowLeft, ChevronRight, RefreshCw, Languages } from 'lucide-react'

interface RightsCategory {
  id: string
  title: string
  icon: React.ReactElement<{ className?: string }>
  summary: string
  details: {
    subtitle: string
    text: string
  }[]
}

// --- Fallback Knowledge Base Data (English Only) ---
const FALLBACK_RIGHTS: RightsCategory[] = [
  {
    id: 'hours',
    title: 'Working Hours & Conditions',
    icon: <Clock className="w-6 h-6 text-slate-700" />,
    summary: 'Rules on maximum hours, rest periods, and overtime.',
    details: [
      { subtitle: 'Standard Working Hours', text: 'The standard maximum working hours are set at 48 hours per week, typically distributed over six days (8 hours/day).' },
      { subtitle: 'Rest Periods', text: 'Employees must have at least 9 hours of uninterrupted rest every 24 hours, and a weekly rest period of at least 36 uninterrupted hours.' },
      { subtitle: 'Overtime Pay', text: 'Overtime (hours worked beyond the 48-hour limit) must be compensated at an increased rate of 1.5x the regular hourly wage.' },
      { subtitle: 'Part-Time & Remote', text: 'Recent amendments officially recognize and regulate part-time, seasonal, and remote work, granting these workers proportional rights to full-time employees.' }
    ]
  },
  {
    id: 'wages',
    title: 'Minimum Wage & Compensation',
    icon: <Banknote className="w-6 h-6 text-slate-700" />,
    summary: 'Official minimum wages, daily rates, and allowances.',
    details: [
      { subtitle: 'National Minimum Wage', text: 'The national monthly minimum wage is determined by official decrees and must be sufficient to meet the essential needs of the employee and their family.' },
      { subtitle: 'Daily Workers', text: 'For employees paid on a daily basis, the law specifies a legal minimum daily rate.' },
      { subtitle: 'Transportation Allowance', text: 'Employers are legally required to pay a daily transportation allowance for each day of actual work, adjusted periodically by the Ministry of Labor.' },
      { subtitle: 'Family Allowance', text: 'Employees registered with the NSSF are eligible to receive monthly family allowances based on marital status and the number of dependent children.' }
    ]
  },
  {
    id: 'leave',
    title: 'Leave Entitlements',
    icon: <Calendar className="w-6 h-6 text-slate-700" />,
    summary: 'Annual, sick, maternity, and bereavement leave rights.',
    details: [
      { subtitle: 'Annual Leave', text: 'Employees are entitled to a minimum of 15 paid working days of annual leave after completing their first full year of continuous service.' },
      { subtitle: 'Sick Leave', text: 'Sick leave scales with tenure, providing full and half pay tiers based on the duration of service.' },
      { subtitle: 'Maternity Leave', text: 'Female employees are entitled to 10 weeks of fully paid maternity leave, covering the period before and after delivery.' },
      { subtitle: 'Bereavement Leave', text: 'Employees are entitled to 2 days of paid leave in the event of the death of an immediate family member.' }
    ]
  },
  {
    id: 'protections',
    title: 'Women & Youth Protections',
    icon: <Users className="w-6 h-6 text-slate-700" />,
    summary: 'Anti-discrimination laws and protections for youth.',
    details: [
      { subtitle: 'Equal Pay & Discrimination', text: 'The law strictly prohibits discrimination between men and women regarding wages, promotions, and professional qualifications for the same work.' },
      { subtitle: 'Hazardous Work Prohibition', text: 'Women and adolescents (under 18) are legally prohibited from engaging in dangerous or hazardous industries.' },
      { subtitle: 'Youth Employment', text: 'The employment of children under 13 is strictly forbidden. Adolescents (13-18 years old) are subject to strict limits on work hours and night shifts.' }
    ]
  },
  {
    id: 'severance',
    title: 'Termination & Severance',
    icon: <Briefcase className="w-6 h-6 text-slate-700" />,
    summary: 'Rules on firing, notice periods, and indemnity pay.',
    details: [
      { subtitle: 'End-of-Service Indemnity', text: 'If an employee resigns after 20 years or is terminated without fault, they are entitled to severance compensation, typically calculated as 1 month of their last salary for every year of service.' },
      { subtitle: 'Notice Periods', text: 'Before terminating an indefinite contract, written notice must be provided, scaling from 1 to 4 months depending on tenure.' },
      { subtitle: 'Abusive Termination', text: 'Arbitrary firing without a valid legal or economic cause entitles the worker to compensation ranging from 2 to 12 months of wages.' }
    ]
  },
  {
    id: 'disputes',
    title: 'Disputes & NSSF',
    icon: <Shield className="w-6 h-6 text-slate-700" />,
    summary: 'Arbitration councils, complaints, and social security.',
    details: [
      { subtitle: 'Labor Arbitration Council', text: 'A specialized court for individual labor disputes. It is designed to be accessible, informal, and generally free of court fees for workers.' },
      { subtitle: 'Ministry of Labor Complaints', text: 'Before going to arbitration, workers can file a grievance with the Ministry of Labor for mediation.' },
      { subtitle: 'NSSF Mandatory Registration', text: 'Employers must register all eligible employees with the NSSF within one month of employment.' }
    ]
  }
]

const iconMap: Record<string, React.ReactNode> = {
  hours: <Clock className="w-6 h-6 text-slate-700" />,
  wages: <Banknote className="w-6 h-6 text-slate-700" />,
  leave: <Calendar className="w-6 h-6 text-slate-700" />,
  protections: <Users className="w-6 h-6 text-slate-700" />,
  women_youth: <Users className="w-6 h-6 text-slate-700" />,
  severance: <Briefcase className="w-6 h-6 text-slate-700" />,
  disputes: <Shield className="w-6 h-6 text-slate-700" />
}

export default function LaborRightsPage() {
  const [rightsData, setRightsData] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [syncing, setSyncing] = useState(false)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hello! I am your AI Labor Consultant. Do you have any questions about your rights under the Lebanese Labor Law?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/labor-rights')
        if (!res.ok) throw new Error('Failed to fetch rights')
        const data = await res.json()
        if (data && data.categories) {
          setRightsData(data.categories)
        }
      } catch (e) {
        console.error('Failed to load rights data:', e)
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/labor-rights?sync=true')
      const data = await res.json()
      if (res.ok && data.success) {
        const dataRes = await fetch('/api/labor-rights')
        const freshData = await dataRes.json()
        if (freshData && freshData.categories) {
          setRightsData(freshData.categories)
        }
        alert(data.message)
      } else {
        alert(data.message || 'Sync completed but no update was required.')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to connect to sync server')
    } finally {
      setSyncing(false)
    }
  }

  const getLocalizedRights = (): RightsCategory[] => {
    if (rightsData.length === 0) {
      return FALLBACK_RIGHTS
    }
    
    return rightsData.map(cat => ({
      id: cat.id,
      title: language === 'en' ? cat.title_en : cat.title_ar,
      icon: (iconMap[cat.id] || <Shield className="w-6 h-6 text-slate-700" />) as React.ReactElement<{ className?: string }>,
      summary: language === 'en' ? cat.summary_en : cat.summary_ar,
      details: cat.details.map((det: any) => ({
        subtitle: language === 'en' ? det.subtitle_en : det.subtitle_ar,
        text: (language === 'en' ? det.text_en : det.text_ar) + (det.article ? ` (${language === 'en' ? 'Article' : 'المادة'} ${det.article})` : '')
      }))
    }))
  }

  const localizedRights = getLocalizedRights()
  const activeTopic = localizedRights.find(t => t.id === activeTopicId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/agents/labor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
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
        content: "I'm having trouble accessing my legal database right now. Please try again later."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 animate-fade-in w-full pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-1.5 bg-slate-900 rounded-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            Labor Rights Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">Empower yourself with knowledge. Understand your rights under the Lebanese Labor Law.</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLanguage(lang => lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Languages className="w-4 h-4 text-slate-500" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            {syncing ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <RefreshCw className="w-4 h-4 text-slate-500" />
            )}
            <span>Sync with Gov PDF</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Knowledge Base */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          {loadingData ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl p-8">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-2" />
              <p className="text-sm text-slate-500">Loading official labor law categories...</p>
            </div>
          ) : activeTopic ? (
            <div className="flex flex-col min-h-0 h-full animate-fade-in bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden relative">
              <div className="bg-slate-50 border-b border-slate-100 p-4 shrink-0 flex items-center gap-4 sticky top-0 z-10">
                <Button variant="outline" size="icon" onClick={() => setActiveTopicId(null)} className="shrink-0 h-8 w-8 bg-white hover:bg-slate-100">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    {React.cloneElement(activeTopic.icon, { className: 'w-4 h-4 text-white' })}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">{activeTopic.title}</h2>
                    <p className="text-xs text-slate-500">{activeTopic.summary}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeTopic.details.map((detail: any, idx: number) => (
                  <div key={idx} className="relative">
                    <h3 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      {detail.subtitle}
                    </h3>
                    <div className="pl-3.5 border-l border-slate-100 ml-[3px]">
                      <p className="text-slate-600 text-sm leading-relaxed">{detail.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col min-h-0 h-full animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 mb-3 shrink-0">Legal Categories</h2>
              <div className="grid sm:grid-cols-2 gap-3 overflow-y-auto pr-2 pb-2">
                {localizedRights.map(section => (
                  <Card 
                    key={section.id} 
                    onClick={() => setActiveTopicId(section.id)}
                    className="border-slate-200 shadow-sm bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer h-fit group"
                  >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          {React.cloneElement(section.icon, { className: 'w-5 h-5 text-slate-700 group-hover:text-white transition-colors' })}
                        </div>
                        <div>
                          <CardTitle className="text-sm text-slate-800 leading-tight">{section.title}</CardTitle>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{section.summary}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                    </CardHeader>
                  </Card>
                ))}
                
                {/* Notice a violation card */}
                <Card className="border-slate-200 shadow-sm bg-slate-50 sm:col-span-2 mt-2 h-fit">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-1 text-sm">Notice a violation?</h3>
                    <p className="text-xs text-slate-600 leading-snug">
                      If your contract violates these fundamental rights, you may be entitled to file a complaint with the Ministry of Labor or seek arbitration. Click any category to learn more, or use the AI Consultant to ask specific questions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
 
        {/* Right Column: AI Consultant */}
        <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
          <Card className="flex-1 flex flex-col border-slate-200 shadow-md relative overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">AI Legal Consultant</CardTitle>
                  <CardDescription className="text-slate-300 text-xs mt-0.5">Trained on the Lebanese Labor Law</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap animate-fade-in" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> Reviewing legal frameworks...
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
 
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about severance, leave, contracts..."
                  className="bg-slate-50 border-slate-200 focus-visible:ring-slate-400"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="bg-slate-900 hover:bg-slate-800 text-white shrink-0">
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
