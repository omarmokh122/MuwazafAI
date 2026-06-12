'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Logged in successfully')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to access your agents</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/login" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-cyan-600 hover:text-cyan-700">
          Create an account
        </Link>
      </div>
    </div>
  )
}
