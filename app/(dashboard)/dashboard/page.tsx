'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Briefcase, FileSearch, Scale, Target, PlayCircle, ArrowRight, Activity, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardHome() {
  const agents = [
    { title: "Scout Agent", desc: "CV vs Job Match", icon: FileSearch, color: "text-blue-500", bg: "bg-blue-50", href: "/scout", status: "Ready" },
    { title: "Coach Agent", desc: "Skill Training", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50", href: "/coach", status: "Ready" },
    { title: "Simulation", desc: "Interview Practice", icon: PlayCircle, color: "text-purple-500", bg: "bg-purple-50", href: "/simulation", status: "Ready" },
    { title: "Application", desc: "CV & Cover Letters", icon: Briefcase, color: "text-orange-500", bg: "bg-orange-50", href: "/application", status: "Ready" },
    { title: "Rights Agent", desc: "Contract Scanner", icon: Scale, color: "text-red-500", bg: "bg-red-50", href: "/rights", status: "Ready" },
    { title: "Benchmark", desc: "Salary Analysis", icon: Brain, color: "text-cyan-500", bg: "bg-cyan-50", href: "/benchmark", status: "Ready" }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-xl">
        <CardContent className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
              <Sparkles className="h-3.5 w-3.5" />
              Job search home
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Keep the next job move obvious.</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Start with the CV matcher, keep applications moving, and jump into interview prep without digging through a crowded dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-cyan-500 text-slate-950 hover:bg-cyan-400" asChild>
                <Link href="/scout">Open CV matcher</Link>
              </Button>
              <Button variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10" asChild>
                <Link href="/tracker">Open tracker</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Average match</span>
                <Activity className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-bold">78%</div>
              <p className="mt-1 text-xs text-slate-400">A quick snapshot of fit.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Skills practiced</span>
                <Target className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-bold">12</div>
              <p className="mt-1 text-xs text-slate-400">Keep building momentum.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Applications</span>
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="mt-2 text-2xl font-bold">5</div>
              <p className="mt-1 text-xs text-slate-400">Everything stays in view.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Match Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1 text-emerald-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +4% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Mastered</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Via Coach Agent</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Generated by AI</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
            <p className="text-sm text-muted-foreground mt-1">Jump into the right tool without hunting around.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <Link key={i} href={agent.href}>
              <Card className="group h-full cursor-pointer border-slate-200 transition-all hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className={`p-2 rounded-lg ${agent.bg}`}>
                    <agent.icon className={`h-5 w-5 ${agent.color}`} />
                  </div>
                  <div className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium">
                    Open
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardTitle className="text-base">{agent.title}</CardTitle>
                  <CardDescription className="mt-1">{agent.desc}</CardDescription>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-cyan-700">
                    Open tool <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
