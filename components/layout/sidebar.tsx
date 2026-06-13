'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, LayoutDashboard, FileSearch, Target, PlayCircle, Briefcase, Scale, FolderOpen, LogOut, ListTodo, LineChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/logo'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Tracker', href: '/tracker', icon: ListTodo },
  { name: 'CV Matcher', href: '/scout', icon: FileSearch },
  { name: 'Interview Prep', href: '/interview-prep', icon: Target },
  { name: 'Role Skillsets', href: '/skillsets', icon: PlayCircle },
  { name: 'Cover Letters', href: '/application', icon: Briefcase },
  { name: 'Labor Rights', href: '/rights', icon: Scale },
  { name: 'Salary Benchmark', href: '/benchmark', icon: LineChart },
  { name: 'Resources', href: '/resources', icon: FolderOpen },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    // Clear Supabase session
    await supabase.auth.signOut()
    // Clear demo mode cookie
    document.cookie = 'demo_mode=; path=/; max-age=0'
    // Clear any stored profile data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('muwaazaf_cv_text')
      localStorage.removeItem('muwaazaf_cv_filename')
      localStorage.removeItem('muwaazaf_position')
      localStorage.removeItem('muwaazaf_target_role')
      localStorage.removeItem('muwaazaf_field')
    }
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-el-white text-el-black shadow-[rgba(0,0,0,0.06)_1px_0px_0px_0px]">
      <div className="flex h-16 items-center px-6 shadow-[rgba(0,0,0,0.06)_0px_1px_0px_0px]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 flex items-center justify-center shadow-el-inset-edge">
            <Logo />
          </div>
          <span className="text-[17px] font-medium tracking-tight text-el-black">Muwaazaf</span>
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
                "group flex items-center gap-3 rounded-[6px] px-3 py-2 text-[14px] font-medium transition-colors",
                isActive 
                  ? "bg-el-near-white text-el-black shadow-el-inset-edge" 
                  : "text-el-dark-gray hover:bg-el-near-white/50 hover:text-el-black"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "text-el-black" : "text-el-warm-gray group-hover:text-el-black")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="shadow-[rgba(0,0,0,0.06)_0px_-1px_0px_0px] p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-el-dark-gray hover:text-el-black hover:bg-el-near-white rounded-[6px] text-[14px] font-medium"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-[18px] w-[18px]" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
