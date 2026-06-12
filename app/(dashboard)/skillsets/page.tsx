'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Code, Database, LineChart, Brush, Megaphone, ShieldCheck, Cpu, ArrowLeft, Zap, Sparkles, CheckCircle2, Users } from 'lucide-react'

// Predefined Popular Roles
const popularRoles = [
  { name: 'Software Engineer', icon: <Code className="w-6 h-6 text-blue-500" /> },
  { name: 'Data Scientist', icon: <LineChart className="w-6 h-6 text-emerald-500" /> },
  { name: 'Product Designer', icon: <Brush className="w-6 h-6 text-pink-500" /> },
  { name: 'Cybersecurity Analyst', icon: <ShieldCheck className="w-6 h-6 text-red-500" /> },
  { name: 'AI/ML Engineer', icon: <Cpu className="w-6 h-6 text-violet-500" /> },
  { name: 'Database Administrator', icon: <Database className="w-6 h-6 text-amber-500" /> },
  { name: 'Digital Marketing Manager', icon: <Megaphone className="w-6 h-6 text-orange-500" /> }
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-600 fill-cyan-100" /> Role Skillsets
          </h1>
          <p className="text-slate-500 mt-2">Explore live, dynamically generated skill requirements for any career path.</p>
        </div>
        
        {activeSkillset && (
          <Button variant="outline" onClick={() => setActiveSkillset(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explorer
          </Button>
        )}
      </div>

      {!activeSkillset ? (
        <>
          {/* Search Bar */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-cyan-600 to-blue-600">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Search any role</h2>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    placeholder="e.g. Blockchain Developer, Healthcare Data Analyst..." 
                    className="pl-12 h-14 text-lg bg-white/95 border-none shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading || !searchQuery.trim()} className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Explore'}
                </Button>
              </form>
              {error && <p className="text-red-200 mt-3 font-medium bg-red-900/50 inline-block px-3 py-1 rounded">{error}</p>}
            </CardContent>
          </Card>

          {/* Popular Roles Grid */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-amber-500" /> Trending Careers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularRoles.map((role, idx) => (
                <Card 
                  key={idx} 
                  className="cursor-pointer hover:border-cyan-400 hover:shadow-md transition-all group"
                  onClick={() => fetchSkillset(role.name)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
                      {role.icon}
                    </div>
                    <div className="font-semibold text-slate-700 group-hover:text-cyan-700">
                      {role.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Global Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
              <Card className="w-80 shadow-2xl">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-slate-800">Scraping Course Catalogs...</h3>
                  <p className="text-sm text-slate-500 mt-2">Our AI is aggregating the latest syllabi from Coursera and edX for this role.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        /* Skillset Detail View */
        <div className="space-y-6 animate-in slide-in-from-bottom-8">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="bg-slate-900 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{activeSkillset.role}</h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">{activeSkillset.description}</p>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Hard Skills */}
            <Card className="border-t-4 border-t-blue-500 shadow-sm">
              <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="flex items-center text-blue-700">
                  <Code className="w-5 h-5 mr-2" /> Core Technical Skills
                </CardTitle>
                <CardDescription>The fundamental hard skills required for this position.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {activeSkillset.hardSkills.map((skill: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800">{skill.name}</h4>
                      <p className="text-sm text-slate-600">{skill.importance}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Soft Skills */}
            <Card className="border-t-4 border-t-emerald-500 shadow-sm">
              <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="flex items-center text-emerald-700">
                  <Users className="w-5 h-5 mr-2" /> Essential Soft Skills
                </CardTitle>
                <CardDescription>The interpersonal skills that differentiate top candidates.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {activeSkillset.softSkills.map((skill: any, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800">{skill.name}</h4>
                      <p className="text-sm text-slate-600">{skill.importance}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emerging Trends */}
            <Card className="md:col-span-2 border-t-4 border-t-purple-500 shadow-sm bg-gradient-to-r from-purple-50/50 to-pink-50/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-purple-700">
                  <Sparkles className="w-5 h-5 mr-2" /> Emerging Tools & Trends
                </CardTitle>
                <CardDescription>What you need to learn NOW to stay ahead of the curve in this field.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 grid md:grid-cols-2 gap-4">
                {activeSkillset.emergingTrends.map((trend: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border shadow-sm">
                    <h4 className="font-bold text-purple-700 mb-1">{trend.name}</h4>
                    <p className="text-sm text-slate-600">{trend.importance}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
