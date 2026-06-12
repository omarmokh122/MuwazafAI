'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, LayoutDashboard, FileSearch, Target, PlayCircle, Briefcase, Scale, FolderOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scout Agent', href: '/scout', icon: FileSearch },
  { name: 'Coach Agent', href: '/coach', icon: Target },
  { name: 'Simulation Agent', href: '/simulation', icon: PlayCircle },
  { name: 'Application Agent', href: '/application', icon: Briefcase },
  { name: 'Rights Agent', href: '/rights', icon: Scale },
  { name: 'Benchmark Agent', href: '/benchmark', icon: Brain },
  { name: 'Resource Library', href: '/resources', icon: FolderOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-zinc-950 text-zinc-100">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Muwaazaf</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-cyan-900/50 text-cyan-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
