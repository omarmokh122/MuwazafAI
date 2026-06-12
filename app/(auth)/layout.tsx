import { Brain } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-zinc-900 text-white p-12 justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Muwaazaf</span>
          </Link>
          <div className="mt-32">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Your Career,<br/>Automated.</h1>
            <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
              Join thousands of Lebanese youth using autonomous AI to hunt, train, and apply for the right jobs.
            </p>
          </div>
        </div>
        <div className="relative z-10 text-sm text-zinc-500 font-medium">
          © {new Date().getFullYear()} Muwaazaf AI. Built for Lebanon.
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Muwaazaf</span>
          </Link>
        </div>
        <div className="w-full max-w-[450px]">
          {children}
        </div>
      </div>
    </div>
  )
}
