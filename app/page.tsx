import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Briefcase, FileSearch, Scale, Target, PlayCircle, ChevronRight, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Muwaazaf</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-cyan-600 transition-colors">
              Sign In
            </Link>
            <Link href="/signup">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-grid-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
          <div className="container relative mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-800 mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-cyan-600 mr-2 animate-pulse-slow"></span>
              Lebanon's First Autonomous AI Career Agent
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Your Career Journey, <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                Automated.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Stop guessing. Let Muwaazaf hunt, diagnose, train, and apply for you. An autonomous agent designed to beat the job market collapse.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Link href="/signup">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-lg shadow-cyan-500/25">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#agents">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                  See How it Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-20 bg-zinc-50 border-y">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Odds Are Stacked Against You</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Lebanon's job market is facing unprecedented challenges. You need an unfair advantage to succeed.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { stat: "47.8%", label: "Youth Unemployment", desc: "Highest rate in the region." },
                { stat: "76%", label: "Skills Mismatch", desc: "Graduates lack the exact skills employers need." },
                { stat: "69%", label: "Want to Emigrate", desc: "Brain drain is accelerating rapidly." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border shadow-sm text-center">
                  <div className="text-5xl font-extrabold text-zinc-900 mb-2">{item.stat}</div>
                  <div className="font-semibold text-lg mb-2">{item.label}</div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features / Agents Section */}
        <section id="agents" className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">6 Autonomous Agents. 1 Goal.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Muwaazaf doesn't just give you tools—it does the work for you through a pipeline of specialized AI agents.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: FileSearch, name: "Scout Agent", desc: "Scans your CV against live job descriptions, calculates fit score, and extracts exact missing skills.", color: "bg-blue-50 text-blue-600 border-blue-200" },
                { icon: Target, name: "Coach Agent", desc: "Maps your skill gaps to targeted YouTube lessons and auto-generates quizzes to verify your knowledge.", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                { icon: PlayCircle, name: "Simulation Agent", desc: "Provides an interactive sandbox environment to practice coding or skills before the real interview.", color: "bg-purple-50 text-purple-600 border-purple-200" },
                { icon: Briefcase, name: "Application Agent", desc: "Automatically rewrites your CV summary and drafts tailored cover letters for specific job posts.", color: "bg-orange-50 text-orange-600 border-orange-200" },
                { icon: Scale, name: "Rights Agent", desc: "Scans employment contracts for violations of the Lebanese Labor Code to protect you from exploitation.", color: "bg-red-50 text-red-600 border-red-200" },
                { icon: Brain, name: "Benchmark Agent", desc: "Analyzes market data to provide salary ranges and stay-vs-go comparisons for specific job titles.", color: "bg-cyan-50 text-cyan-600 border-cyan-200" }
              ].map((agent, i) => (
                <div key={i} className="group relative bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all">
                  <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-4 ${agent.color}`}>
                    <agent.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {agent.desc}
                  </p>
                  <div className="flex items-center text-sm font-medium text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">Ready to Take Control?</h2>
            <p className="text-xl text-zinc-400 mb-10">
              Join thousands of Lebanese youth using AI to secure their future.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-bold h-14 px-10 text-lg rounded-full">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-md bg-cyan-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Muwaazaf</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Muwaazaf AI. Built for Lebanon.
          </p>
        </div>
      </footer>
    </div>
  )
}
