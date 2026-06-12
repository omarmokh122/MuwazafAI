'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Code, Database, LineChart, Brush, Megaphone, ShieldCheck, Cpu, ArrowLeft, Zap, Sparkles, CheckCircle2, Users, Cloud, Laptop, Server, Smartphone, PenTool, Layout, Globe, Fingerprint, Coins, Gamepad, Stethoscope, Briefcase } from 'lucide-react'

// Predefined Popular Roles
const popularRoles = [
  { name: 'Software Engineer', icon: <Code className="w-5 h-5 text-blue-500" /> },
  { name: 'Data Scientist', icon: <LineChart className="w-5 h-5 text-emerald-500" /> },
  { name: 'Product Designer', icon: <Brush className="w-5 h-5 text-pink-500" /> },
  { name: 'Cybersecurity Analyst', icon: <ShieldCheck className="w-5 h-5 text-red-500" /> },
  { name: 'AI/ML Engineer', icon: <Cpu className="w-5 h-5 text-violet-500" /> },
  { name: 'Cloud Architect', icon: <Cloud className="w-5 h-5 text-sky-500" /> },
  { name: 'DevOps Engineer', icon: <Server className="w-5 h-5 text-indigo-500" /> },
  { name: 'Frontend Developer', icon: <Layout className="w-5 h-5 text-fuchsia-500" /> },
  { name: 'Backend Developer', icon: <Database className="w-5 h-5 text-amber-500" /> },
  { name: 'Mobile Developer', icon: <Smartphone className="w-5 h-5 text-teal-500" /> },
  { name: 'UX Researcher', icon: <PenTool className="w-5 h-5 text-rose-500" /> },
  { name: 'Full Stack Developer', icon: <Laptop className="w-5 h-5 text-cyan-500" /> },
  { name: 'Digital Marketing Manager', icon: <Megaphone className="w-5 h-5 text-orange-500" /> },
  { name: 'Financial Analyst', icon: <Coins className="w-5 h-5 text-yellow-600" /> },
  { name: 'HR Manager', icon: <Users className="w-5 h-5 text-slate-500" /> },
  { name: 'Game Developer', icon: <Gamepad className="w-5 h-5 text-lime-500" /> },
  { name: 'Blockchain Developer', icon: <Globe className="w-5 h-5 text-blue-600" /> },
  { name: 'Penetration Tester', icon: <Fingerprint className="w-5 h-5 text-red-600" /> },
  { name: 'Healthcare Administrator', icon: <Stethoscope className="w-5 h-5 text-emerald-600" /> },
  { name: 'Business Operations', icon: <Briefcase className="w-5 h-5 text-slate-700" /> }
]

export default function SkillsetExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSkillset, setActiveSkillset] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchSkillset = async (roleName: string) => {
    if (!roleName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/agents/skillset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleName })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch skillset')
      
      setActiveSkillset(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSkillset(searchQuery)
  }

  return (
    <div className="flex-1 flex flex-col space-y-4 animate-fade-in w-full pb-4">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Role Skillsets</h1>
            <p className="text-sm text-slate-500 mt-1">Explore live, dynamically generated skill requirements for any career path.</p>
          </div>
        </div>
        
        {activeSkillset && (
          <Button variant="outline" size="sm" onClick={() => setActiveSkillset(null)} className="border-slate-200 bg-white hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {!activeSkillset ? (
          <div className="flex flex-col min-h-0 h-full overflow-y-auto pr-2 pb-2 space-y-6">
            
            {/* Search Bar */}
            <Card className="border border-slate-200 shadow-sm bg-white shrink-0">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search any role (e.g. Blockchain Developer, Data Analyst...)" 
                      className="pl-10 h-12 text-sm bg-slate-50 border-slate-200 focus-visible:ring-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading || !searchQuery.trim()} className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Explore Role'}
                  </Button>
                </form>
                {error && <p className="text-red-600 mt-3 font-medium bg-red-50 border border-red-100 inline-block px-3 py-1.5 rounded-md text-xs">{error}</p>}
              </CardContent>
            </Card>

            {/* Popular Roles Grid */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center shrink-0">
                <Sparkles className="w-4 h-4 mr-2 text-amber-500" /> Trending Careers
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {popularRoles.map((role, idx) => (
                  <Card 
                    key={idx} 
                    className="cursor-pointer border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white transition-all group"
                    onClick={() => fetchSkillset(role.name)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                        {role.icon}
                      </div>
                      <div className="font-medium text-slate-700 text-sm group-hover:text-slate-900 line-clamp-2 leading-snug">
                        {role.name}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Global Loading Overlay */}
            {loading && (
              <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
                <Card className="w-72 shadow-xl border-slate-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Loader2 className="w-8 h-8 text-slate-900 animate-spin mb-4" />
                    <h3 className="text-sm font-bold text-slate-800">Analyzing Role...</h3>
                    <p className="text-xs text-slate-500 mt-2">Aggregating the latest industry requirements and syllabi.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          /* Skillset Detail View */
          <div className="flex flex-col min-h-0 h-full overflow-y-auto pr-2 pb-2 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <Card className="border-slate-200 shadow-sm bg-slate-900 shrink-0">
              <div className="p-6 text-white">
                <h2 className="text-xl font-bold mb-2">{activeSkillset.role}</h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">{activeSkillset.description}</p>
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-4 flex-1">
              {/* Hard Skills */}
              <Card className="border-t-4 border-t-blue-500 shadow-sm bg-white border-slate-200">
                <CardHeader className="bg-slate-50/50 p-4 pb-3 border-b border-slate-100">
                  <CardTitle className="flex items-center text-blue-700 text-base">
                    <Code className="w-4 h-4 mr-2" /> Core Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 grid gap-2.5">
                  {activeSkillset.hardSkills.map((skill: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="flex items-start gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-900 leading-tight">{skill.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-6 line-clamp-3">{skill.importance}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Soft Skills */}
              <Card className="border-t-4 border-t-emerald-500 shadow-sm bg-white border-slate-200">
                <CardHeader className="bg-slate-50/50 p-4 pb-3 border-b border-slate-100">
                  <CardTitle className="flex items-center text-emerald-700 text-base">
                    <Users className="w-4 h-4 mr-2" /> Essential Soft Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 grid gap-2.5">
                  {activeSkillset.softSkills.map((skill: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 hover:border-emerald-200 hover:shadow-sm transition-all group">
                      <div className="flex items-start gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-900 leading-tight">{skill.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-6 line-clamp-3">{skill.importance}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Emerging Trends */}
              <Card className="lg:col-span-2 border-t-4 border-t-purple-500 shadow-sm bg-white border-slate-200">
                <CardHeader className="bg-purple-50/30 p-4 pb-3 border-b border-slate-100">
                  <CardTitle className="flex items-center text-purple-700 text-base">
                    <Sparkles className="w-4 h-4 mr-2" /> Emerging Tools & Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid md:grid-cols-2 gap-3">
                  {activeSkillset.emergingTrends.map((trend: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-purple-700 text-sm mb-1">{trend.name}</h4>
                      <p className="text-xs text-slate-600">{trend.importance}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
