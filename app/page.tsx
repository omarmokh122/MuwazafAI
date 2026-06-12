'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Brain, Briefcase, FileSearch, Scale, Target, PlayCircle, ChevronRight, Sparkles, ArrowRight, Activity, ListTodo, Upload, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const handleDemoLogin = () => {
    setIsDemoLoading(true)
    document.cookie = "demo_mode=true; path=/; max-age=86400"
    window.location.href = "/dashboard"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900 overflow-hidden font-sans">
      {/* Background ambient light */}
      <div className="glow-orb top-[-10%] left-[-10%] opacity-80" />
      <div className="glow-orb bottom-[20%] right-[-10%] opacity-60 bg-emerald-500/5" />

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 z-50 w-full border-b border-slate-200 glassmorphism"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Muwaazaf</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button 
              onClick={handleDemoLogin} 
              variant="outline" 
              className="border-slate-200 text-slate-700 hover:bg-slate-50 hidden md:inline-flex"
            >
              Try Demo
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-6 shadow-sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-16 relative">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 bg-grid-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50" />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container relative mx-auto px-4 text-center max-w-5xl"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-800 mb-8">
              <Sparkles className="h-4 w-4 mr-2" />
              Lebanon's Smartest Career Assistant
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 text-slate-900 leading-[1.1]">
              Land The Job <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-500 to-emerald-500">
                You Deserve.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Your personal career department. We help you perfect your profile, ace the interview, and track every application—all in one place.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-md shadow-cyan-600/20 group" asChild>
                <Link href="/signup">
                  Start Your Journey 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                onClick={handleDemoLogin} 
                disabled={isDemoLoading}
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full w-full sm:w-auto border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                {isDemoLoading ? <Activity className="h-5 w-5 animate-spin mr-2" /> : <PlayCircle className="h-5 w-5 mr-2 text-slate-400" />}
                Interactive Demo
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Storytelling Features Section */}
        <section className="py-24 relative z-10 bg-white border-y border-slate-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">Everything You Need To Get Hired</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">From tailoring your CV to tracking your offers, Muwaazaf provides a complete toolkit for your career journey.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
              {/* Feature 1: CV Matcher (Large) */}
              <motion.div 
                whileHover={{ scale: 0.99, y: -4 }}
                className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-3xl p-8 relative overflow-hidden group border border-slate-200 shadow-sm"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity duration-500 group-hover:opacity-10">
                  <FileSearch className="w-64 h-64 text-cyan-600" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
                      <Upload className="h-7 w-7 text-cyan-600" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-slate-900">Perfect Your Profile</h3>
                    <p className="text-slate-600 text-lg max-w-md leading-relaxed mb-6">
                      Upload your CV and paste any Job Description. Our system instantly matches your skills, highlights the gaps, and tells you exactly what to fix to beat the ATS.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center text-sm font-medium text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">CV Analysis</span>
                    <span className="inline-flex items-center text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Skill Matching</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: Tracker */}
              <motion.div 
                whileHover={{ scale: 0.99, y: -4 }}
                className="md:col-span-2 bg-white rounded-3xl p-8 relative overflow-hidden group border border-slate-200 shadow-sm"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <ListTodo className="h-6 w-6 text-slate-700" />
                    </div>
                    <CheckCircle2 className="text-emerald-500 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900">Track Applications</h3>
                    <p className="text-slate-600">Never lose track. Move your jobs from 'Applied' to 'Offer' in a clean, organized Kanban board.</p>
                  </div>
                </div>
              </motion.div>

              {/* Small Features */}
              {[
                { icon: Target, name: "Interview Prep", color: "blue", desc: "Practice with targeted quizzes." },
                { icon: Briefcase, name: "Cover Letters", color: "orange", desc: "Auto-draft tailored letters." },
                { icon: Scale, name: "Labor Rights", color: "red", desc: "Ensure your contract is fair." },
                { icon: Brain, name: "Salary Data", color: "purple", desc: "Know your worth in the market." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 0.98, y: -2 }}
                  className={`bg-white rounded-3xl p-6 relative overflow-hidden group border border-slate-200 shadow-sm ${i < 2 ? 'md:col-span-1' : 'md:col-span-2 lg:col-span-1'}`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.name}</h3>
                      <p className="text-sm text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Helps Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-12 text-slate-900">Why Use Muwaazaf?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { stat: "3x", label: "More Interviews", desc: "By perfectly matching your CV to the JD." },
                { stat: "15h", label: "Saved Weekly", desc: "Stop manually writing cover letters and tracking sheets." },
                { stat: "100%", label: "Confidence", desc: "Walk into negotiations knowing your exact market value." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-4xl font-extrabold text-cyan-600 mb-2">{item.stat}</div>
                  <div className="font-bold text-lg mb-2 text-slate-900">{item.label}</div>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 relative z-10 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 text-center max-w-4xl relative">
            <div className="absolute inset-0 bg-cyan-50 blur-[100px] rounded-full" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Stop Applying Into The Void.</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Take control of your career journey today with the most comprehensive job seeking platform in Lebanon.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-cyan-500 text-slate-900 hover:bg-cyan-400 h-14 px-10 text-lg rounded-full font-bold shadow-lg" asChild>
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button 
                  onClick={handleDemoLogin}
                  disabled={isDemoLoading}
                  size="lg" 
                  variant="outline"
                  className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 h-14 px-10 text-lg rounded-full font-medium"
                >
                  Try The Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 rounded-md bg-cyan-600 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Muwaazaf</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Muwaazaf AI. Built for Lebanon.
          </p>
        </div>
      </footer>
    </div>
  )
}
