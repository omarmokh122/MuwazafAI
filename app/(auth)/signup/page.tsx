'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    educationLevel: '',
    major: '',
    age: '',
    country: 'Lebanon',
    currentStatus: '',
    targetField: '',
    linkedinUrl: '',
  })

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => setStep(s => s + 1)
  const handleBack = () => setStep(s => s - 1)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Sign up auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (authError) throw authError

      // Note: The Supabase trigger we wrote earlier will auto-create the profile row.
      // Now we just need to update it with the extra info if the user was created successfully.
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            age: parseInt(formData.age),
            country: formData.country,
            education_level: formData.educationLevel,
            major: formData.major,
            current_status: formData.currentStatus,
            target_field: formData.targetField,
            linkedin_url: formData.linkedinUrl,
          })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error("Error updating profile:", profileError)
          // We don't throw here to not block the user if profile update fails but auth succeeds
        }
      }

      toast.success('Account created successfully! Welcome to Muwaazaf.')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
        <p className="text-muted-foreground">Step {step} of 3</p>
      </div>

      <div className="flex gap-2 mb-8">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-cyan-600' : 'bg-zinc-100'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-cyan-600' : 'bg-zinc-100'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-cyan-600' : 'bg-zinc-100'}`} />
      </div>

      <form onSubmit={step === 3 ? handleSignup : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="John Doe" required className="h-11"
                value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="name@example.com" required className="h-11"
                value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="h-11" minLength={6}
                value={formData.password} onChange={(e) => updateForm('password', e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 2: Academic Profile */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select value={formData.educationLevel} onValueChange={(v) => updateForm('educationLevel', v)} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                    <SelectItem value="Self-Taught">Self-Taught</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" min="16" max="99" required className="h-11"
                  value={formData.age} onChange={(e) => updateForm('age', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major / Area of Study</Label>
              <Input id="major" placeholder="e.g. Computer Science" required className="h-11"
                value={formData.major} onChange={(e) => updateForm('major', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" defaultValue="Lebanon" required className="h-11"
                value={formData.country} onChange={(e) => updateForm('country', e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 3: Career Profile */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select value={formData.currentStatus} onValueChange={(v) => updateForm('currentStatus', v)} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Fresh Graduate">Fresh Graduate</SelectItem>
                  <SelectItem value="Working">Working</SelectItem>
                  <SelectItem value="Unemployed">Unemployed</SelectItem>
                  <SelectItem value="Career Changer">Career Changer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetField">Target Career Field</Label>
              <Input id="targetField" placeholder="e.g. Frontend Development" required className="h-11"
                value={formData.targetField} onChange={(e) => updateForm('targetField', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
              <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="h-11"
                value={formData.linkedinUrl} onChange={(e) => updateForm('linkedinUrl', e.target.value)} />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="h-11 w-full" disabled={loading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button type="submit" className="h-11 w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="h-11 w-full bg-cyan-600 hover:bg-cyan-700 text-white" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                'Create Account'
              )}
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-cyan-600 hover:text-cyan-700">
          Sign in
        </Link>
      </div>
    </div>
  )
}
