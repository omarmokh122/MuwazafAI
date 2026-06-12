'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      document.cookie = "demo_mode=true; path=/; max-age=86400"
      window.location.href = "/profile" // Redirect to profile to upload CV
    }, 1000)
  }

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-violet-900/40" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="h-16 w-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center backdrop-blur-sm mb-8">
            <Sparkles className="h-8 w-8 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Start managing your career like a professional.</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Join thousands of professionals in Lebanon using Muwaazaf to perfectly match their CVs, draft cover letters, and track every single interview.
          </p>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400">
                U{i}
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-cyan-600 flex items-center justify-center text-xs font-bold text-white z-10">
              +1k
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-10 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-10">
            <div className="h-10 w-10 rounded-lg bg-cyan-600 flex items-center justify-center shadow-md mb-6">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h1>
            <p className="text-slate-500 mt-2">Get started for free today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="h-12" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" required className="h-12" />
            </div>

            <Button type="submit" className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-base font-semibold transition-all mt-4 shadow-lg shadow-cyan-600/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-slate-900 hover:text-cyan-600 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
