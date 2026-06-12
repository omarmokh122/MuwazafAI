'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Brain, ArrowRight, PlayCircle, Activity, Briefcase, ChevronRight } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

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
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="min-h-screen flex flex-col bg-el-white text-el-black selection:bg-el-light-gray overflow-hidden font-sans">
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 z-50 w-full bg-el-white/90 backdrop-blur-xl border-b shadow-el-edge"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-[1200px]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 flex items-center justify-center">
              <Logo />
            </div>
            <span className="text-[17px] font-medium tracking-tight text-el-black">Muwaazaf</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:inline-flex text-[15px] text-el-dark-gray hover:text-el-black font-medium transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup"
              className="bg-el-black text-white text-[14px] font-bold uppercase tracking-[0.05em] py-2 px-5 rounded-full shadow-el-card hover:bg-el-dark-gray transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-16 relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="container relative mx-auto px-6 text-center max-w-[900px]"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border shadow-el-inset-edge bg-el-near-white px-3 py-1 text-[13px] font-medium text-el-dark-gray mb-10">
              Introducing the Next-Gen Career Agent
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-[84px] font-light tracking-[-0.02em] mb-8 text-el-black leading-[1.05]">
              Elevate Your <br />
              <span className="text-el-warm-gray">Professional Journey.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-[20px] text-el-dark-gray mb-14 max-w-2xl mx-auto font-normal leading-[1.6]">
              Your AI-powered career co-pilot. Seamlessly match your CV, track applications, prepare for interviews, and negotiate offers with data-driven confidence.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleDemoLogin} 
                disabled={isDemoLoading}
                className="bg-el-warm-stone/80 backdrop-blur-md text-el-black font-medium py-3 pl-5 pr-6 flex items-center justify-center text-[16px] rounded-[30px] w-full sm:w-auto shadow-el-warm-lift hover:bg-el-warm-stone transition-all duration-300"
              >
                {isDemoLoading ? <Activity className="h-5 w-5 animate-spin mr-3 opacity-60" /> : <PlayCircle className="h-5 w-5 mr-3 opacity-60" />}
                Interactive Demo
              </button>
              <Link 
                href="/signup"
                className="bg-el-white text-el-black border shadow-el-outline-ring font-medium py-3 px-6 flex items-center justify-center text-[16px] rounded-full w-full sm:w-auto hover:bg-el-near-white transition-colors group"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 relative border-t shadow-el-inset-edge bg-el-white">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-[56px] font-light mb-6 tracking-tight text-el-black">The Workflow</h2>
              <p className="text-[18px] text-el-dark-gray max-w-2xl mx-auto">A systematic, data-driven approach to landing your next big opportunity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Diagnose", desc: "Upload your CV and get an instant skills gap analysis paired with live salary benchmarking." },
                { step: "02", title: "Match", desc: "Paste any job description to automatically calculate your ATS match score and keyword gaps." },
                { step: "03", title: "Train", desc: "Generate tailored cover letters and practice mock interviews specific to the role." },
                { step: "04", title: "Track", desc: "Move your applications through an intelligent Kanban pipeline from submission to offer." }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-[40px] font-light text-el-border-light mb-4">{item.step}</div>
                  <h3 className="text-[20px] font-medium text-el-black mb-3">{item.title}</h3>
                  <p className="text-[15px] text-el-dark-gray leading-[1.6]">{item.desc}</p>
                  {i < 3 && (
                    <ChevronRight className="hidden md:block absolute right-[-24px] top-1/2 transform -translate-y-1/2 text-el-border-light w-8 h-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Core Tools */}
        <section className="py-32 relative bg-el-light-gray border-t shadow-el-inset-edge">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-[56px] font-light mb-6 tracking-tight text-el-black">Platform Tools</h2>
              <p className="text-[18px] text-el-dark-gray max-w-2xl mx-auto leading-[1.6]">Everything you need to stand out, get interviewed, and get hired.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CV Matcher */}
              <div className="bg-el-white rounded-[24px] p-10 relative overflow-hidden shadow-el-card-full flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-el-near-white rounded-[12px] flex items-center justify-center border shadow-el-inset-edge">
                      <Image src="/icons/cv_matcher.png" alt="CV Matcher" width={32} height={32} className="object-contain mix-blend-multiply opacity-90" />
                    </div>
                    <h3 className="text-[28px] font-light text-el-black tracking-tight">Precision CV Matcher</h3>
                  </div>
                  <p className="text-el-dark-gray text-[15px] leading-[1.6] mb-6">
                    Our NLP engine analyzes the semantic distance between your resume and a target job description, identifying exact keyword gaps to beat ATS systems.
                  </p>
                  <Link href="/signup" className="text-[14px] font-medium text-el-black flex items-center hover:text-blue-600 transition-colors">
                    Optimize your CV <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="relative mt-auto h-48 w-full rounded-[16px] overflow-hidden border shadow-el-inset-edge bg-el-light-gray">
                  <Image src="/images/screen_matcher.png" alt="CV Matcher UI" fill className="object-cover object-left-top opacity-90 mix-blend-multiply" />
                </div>
              </div>

              {/* Salary Benchmark */}
              <div className="bg-el-white rounded-[24px] p-10 relative overflow-hidden shadow-el-card-full flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-el-near-white rounded-[12px] flex items-center justify-center border shadow-el-inset-edge">
                      <Image src="/icons/salary_benchmark.png" alt="Salary Benchmark" width={32} height={32} className="object-contain mix-blend-multiply opacity-90" />
                    </div>
                    <h3 className="text-[28px] font-light text-el-black tracking-tight">Market Benchmarks</h3>
                  </div>
                  <p className="text-el-dark-gray text-[15px] leading-[1.6] mb-6">
                    Get real-time compensation analysis tailored to your specific role and location, empowering you to negotiate offers with hard data.
                  </p>
                  <Link href="/signup" className="text-[14px] font-medium text-el-black flex items-center hover:text-blue-600 transition-colors">
                    View Market Rates <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="relative mt-auto h-48 w-full rounded-[16px] overflow-hidden border shadow-el-inset-edge bg-el-light-gray">
                   {/* We don't have a benchmark screenshot, so we'll use dashboard */}
                  <Image src="/images/screen_dash.png" alt="Dashboard UI" fill className="object-cover object-left-bottom opacity-90 mix-blend-multiply" />
                </div>
              </div>

              {/* Interview Prep */}
              <div className="bg-el-white rounded-[24px] p-10 relative overflow-hidden shadow-el-card-full flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-el-near-white rounded-[12px] flex items-center justify-center border shadow-el-inset-edge">
                      <Image src="/icons/interview_prep.png" alt="Interview Prep" width={32} height={32} className="object-contain mix-blend-multiply opacity-90" />
                    </div>
                    <h3 className="text-[28px] font-light text-el-black tracking-tight">Interview Mastery</h3>
                  </div>
                  <p className="text-el-dark-gray text-[15px] leading-[1.6] mb-6">
                    Practice with AI-generated mock interviews specific to your target company and role. Get instant feedback on your answers and delivery.
                  </p>
                  <Link href="/signup" className="text-[14px] font-medium text-el-black flex items-center hover:text-blue-600 transition-colors">
                    Start Practicing <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="relative mt-auto h-48 w-full rounded-[16px] overflow-hidden border shadow-el-inset-edge bg-el-light-gray">
                  <Image src="/images/screen_interview.png" alt="Interview Prep UI" fill className="object-cover object-left-top opacity-90 mix-blend-multiply" />
                </div>
              </div>

              {/* Small Tools */}
              <div className="bg-el-white rounded-[24px] p-10 relative overflow-hidden shadow-el-card-full flex flex-col justify-center">
                <h3 className="text-[24px] font-medium mb-6 text-el-black">Additional Arsenal</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-el-warm-gray shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-el-black text-[15px]">Cover Letter Generator</p>
                      <p className="text-[14px] text-el-dark-gray">Instantly draft letters tailored to the job.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-el-warm-gray shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-el-black text-[15px]">Role Skillsets Explorer</p>
                      <p className="text-[14px] text-el-dark-gray">Discover required tech stacks for new careers.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tracker Showcase */}
        <section className="py-32 relative bg-el-white border-t shadow-el-inset-edge overflow-hidden">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border shadow-el-inset-edge bg-el-near-white px-3 py-1 text-[13px] font-medium text-el-dark-gray mb-6">
                  Intelligent Pipeline
                </div>
                <h2 className="text-4xl md:text-[48px] font-light mb-6 tracking-tight text-el-black leading-[1.1]">
                  Manage your search like a pro.
                </h2>
                <p className="text-[18px] text-el-dark-gray mb-8 leading-[1.6]">
                  Stop using messy spreadsheets. Our built-in job tracker organizes your applications into a clean Kanban board. Drag and drop from "Applied" to "Interviewing" to "Offer", and let our AI remind you when it's time to follow up.
                </p>
                <ul className="space-y-3 mb-10 text-[15px] text-el-dark-gray">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-el-black" /> Visual Kanban pipeline</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-el-black" /> Automated follow-up reminders</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-el-black" /> Salary & benefit tracking per role</li>
                </ul>
                <Link 
                  href="/signup"
                  className="bg-el-black text-white text-[15px] font-medium py-3 px-8 rounded-full shadow-el-card hover:bg-[#222] transition-colors inline-flex"
                >
                  Explore the Tracker
                </Link>
              </div>
              
              <div className="relative">
                {/* Tracker Screenshot */}
                <div className="bg-el-white rounded-[24px] p-3 border shadow-el-inset-edge relative z-10 transform hover:-translate-y-2 transition-transform duration-500 w-full overflow-hidden">
                   <div className="relative w-full h-[350px] rounded-[16px] overflow-hidden border shadow-el-card-full bg-el-light-gray">
                     <Image src="/images/screen_tracker.png" alt="Job Tracker UI" fill className="object-cover object-left-top mix-blend-multiply opacity-95" />
                   </div>
                </div>
                
                {/* Floating Icon */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-el-white rounded-full border shadow-el-card-full flex items-center justify-center p-5 z-20">
                  <Image src="/icons/job_tracker.png" alt="Tracker" width={60} height={60} className="object-contain opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-40 relative bg-el-near-white border-t shadow-el-inset-edge">
          <div className="container mx-auto px-6 text-center max-w-[800px] relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-4xl md:text-[64px] font-light mb-6 tracking-tight text-el-black leading-[1.05]">Ready to start?</h2>
              <p className="text-[18px] text-el-dark-gray mb-12 max-w-xl mx-auto font-normal leading-[1.6]">
                Join Muwaazaf today and transform how you discover, apply, and land your next big opportunity.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/signup"
                  className="bg-el-black text-white py-3 px-8 flex items-center justify-center text-[15px] rounded-full font-medium shadow-el-card hover:bg-[#222] transition-colors"
                >
                  Create Free Account
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="bg-el-white pt-24 pb-12 border-t shadow-el-inset-edge">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center">
                <Logo />
              </div>
              <span className="text-[20px] font-light tracking-tight text-el-black">Muwaazaf</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-[11px] font-medium text-el-warm-gray uppercase tracking-[0.05em] mb-1 font-mono">Engineered By</p>
              <p className="text-[15px] font-medium text-el-dark-gray">
                Omar Mokhtar & Hanan Aref
              </p>
              <p className="text-[13px] text-el-warm-gray mt-1">AI Engineers</p>
            </div>
          </div>
          
          <div className="border-t shadow-el-inset-edge pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-el-warm-gray text-[13px]">
              © {new Date().getFullYear()} Muwaazaf AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-[13px] font-medium text-el-warm-gray">
              <Link href="#" className="hover:text-el-black transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-el-black transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
