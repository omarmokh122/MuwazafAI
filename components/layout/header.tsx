'use client'

import { Bell, Search, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useUserProfile } from '@/lib/store/user-profile'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()
  const { fullName, email, initials } = useUserProfile()
  const supabase = createClient()
  const { clearProfile } = useUserProfile()

  const displayName = fullName || 'Guest User'
  const displayEmail = email || 'demo@muwaazaf.com'
  const avatarInitial = initials()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'demo_mode=; path=/; max-age=0'
    clearProfile()
    window.location.href = '/'
  }

  return (
    <header className="h-16 shadow-[rgba(0,0,0,0.06)_0px_1px_0px_0px] bg-el-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search tools, resources, or history..." 
            className="w-full bg-el-white text-[15px] text-el-black pl-9 border-none shadow-el-inset-dark rounded-[12px] focus-visible:ring-1 focus-visible:ring-blue-300"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-slate-900 text-white text-sm font-semibold">
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {displayEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
