'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Scale, Clock, Calendar, Shield, Briefcase, Bot, User, Send, Loader2, Sparkles, Banknote, Users, ArrowLeft, ChevronRight } from 'lucide-react'

// --- Expanded Knowledge Base Data ---
const rightsData = [
  {
    id: 'hours',
    title: 'Working Hours & Conditions',
    icon: <Clock className="w-6 h-6 text-slate-700" />,
    summary: 'Rules on maximum hours, rest periods, and overtime.',
    details: [
      { subtitle: 'Standard Working Hours', text: 'The standard maximum working hours are set at 48 hours per week, typically distributed over six days (8 hours/day).' },
      { subtitle: 'Rest Periods', text: 'Employees must have at least 9 hours of uninterrupted rest every 24 hours, and a weekly rest period of at least 36 uninterrupted hours.' },
      { subtitle: 'Overtime Pay', text: 'Overtime (hours worked beyond the 48-hour limit) must be compensated at an increased rate of 1.5x the regular hourly wage.' },
      { subtitle: 'Part-Time & Remote', text: 'Recent 2025 amendments officially recognize and regulate part-time, seasonal, and remote work, granting these workers proportional rights to full-time employees.' }
    ]
  },
  {
    id: 'wages',
    title: 'Minimum Wage & Compensation',
    icon: <Banknote className="w-6 h-6 text-slate-700" />,
    summary: 'Official minimum wages, daily rates, and allowances.',
    details: [
      { subtitle: 'National Minimum Wage', text: 'As of mid-2025, the national monthly minimum wage is LBP 28,000,000 for regular full-time employees in the private sector.' },
      { subtitle: 'Daily Workers', text: 'For employees paid on a daily basis, the legal minimum rate is LBP 1,300,000 per day.' },
      { subtitle: 'Transportation Allowance', text: 'Employers are legally required to pay a daily transportation allowance for each day of actual work. This rate is periodically adjusted by the Ministry of Labor based on fuel costs.' },
      { subtitle: 'Family Allowance', text: 'Employees registered with the NSSF are eligible to receive monthly family allowances based on marital status and the number of dependent children.' }
    ]
  },
  {
    id: 'leave',
    title: 'Leave Entitlements',
    icon: <Calendar className="w-6 h-6 text-slate-700" />,
    summary: 'Annual, sick, maternity, and bereavement leave rights.',
    details: [
      { subtitle: 'Annual Leave', text: 'Employees are entitled to a minimum of 15 paid working days of annual leave after completing their first full year of continuous service. Accumulation is typically capped at two consecutive years.' },
      { subtitle: 'Sick Leave', text: 'Sick leave scales with tenure. For example, employees with 3 months to 2 years of service get 15 days at full pay and 15 days at half pay. This increases up to 2.5 months full pay for employees with over 10 years of service.' },
      { subtitle: 'Maternity Leave', text: 'Female employees are entitled to 10 weeks of fully paid maternity leave, which can be taken before and after delivery.' },
      { subtitle: 'Paternity & Family Leave', text: 'Fathers are entitled to 3 days of paid paternity leave. Bereavement leave is typically granted for 2 days upon the death of an immediate family member.' }
    ]
  },
  {
    id: 'women_youth',
    title: 'Women & Youth Protections',
    icon: <Users className="w-6 h-6 text-slate-700" />,
    summary: 'Anti-discrimination laws and protections for youth.',
    details: [
      { subtitle: 'Equal Pay & Discrimination', text: 'The law strictly prohibits discrimination between men and women regarding wages, promotions, and professional qualifications for the same work.' },
      { subtitle: 'Hazardous Work Prohibition', text: 'Women and adolescents (under 18) are legally prohibited from engaging in dangerous or hazardous industries, such as underground mining, handling explosives, or severe chemical manufacturing.' },
      { subtitle: 'Youth Employment', text: 'The employment of children under 13 is strictly forbidden. Adolescents (13-18 years old) are subject to strict limits: a maximum of 6 hours of work per day, mandatory rest breaks, and an absolute prohibition on night shifts.' }
    ]
  },
  {
    id: 'severance',
    title: 'Termination & Severance',
    icon: <Briefcase className="w-6 h-6 text-slate-700" />,
    summary: 'Rules on firing, notice periods, and indemnity pay.',
    details: [
      { subtitle: 'End-of-Service Indemnity', text: 'A mandatory right. If an employee resigns after 20 years or is terminated without fault, they are entitled to 1 month of their last salary for every year of service, processed through the NSSF.' },
      { subtitle: 'Notice Periods', text: 'Before terminating an indefinite contract, written notice must be provided. It scales with tenure: 1 month (under 3 years), 2 months (3-6 years), 3 months (6-12 years), and 4 months (over 12 years).' },
      { subtitle: 'Abusive Termination', text: 'If an employee is fired arbitrarily or without a valid legal or economic cause, they can claim compensation ranging from 2 to 12 months of wages via the Labor Arbitration Council.' }
    ]
  },
  {
    id: 'disputes',
    title: 'Disputes & NSSF',
    icon: <Shield className="w-6 h-6 text-slate-700" />,
    summary: 'Arbitration councils, complaints, and social security.',
    details: [
      { subtitle: 'Labor Arbitration Council', text: 'A specialized court for individual labor disputes (e.g., unpaid wages, unfair dismissal). It is designed to be accessible, informal, and generally free of court fees for workers.' },
      { subtitle: 'Ministry of Labor Complaints', text: 'Before going to arbitration, workers can file a grievance with the Ministry of Labor, which will attempt to mediate and resolve the dispute amicably.' },
      { subtitle: 'NSSF Mandatory Registration', text: 'Employers MUST register all eligible employees with the National Social Security Fund (NSSF) within one month of employment. It covers sickness, maternity, family allowances, and end-of-service indemnities.' }
    ]
  }
]

export default function LaborRightsPage() {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const activeTopic = rightsData.find(t => t.id === activeTopicId)

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I am your AI Labor Consultant. Do you have any questions about your rights under the Lebanese Labor Law?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      </div>

      <div className="grid lg:grid-cols-5 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Knowledge Base */}
        <div className="lg:col-span-3 flex flex-col min-h-0">
          {activeTopic ? (
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
                {activeTopic.details.map((detail, idx) => (
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
                {rightsData.map(section => (
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
                        <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
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
