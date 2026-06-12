'use client'

import { useState, useEffect } from 'react'
import { Plus, GripVertical, Trash2, Calendar, Building, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

interface JobApplication {
  id: string
  company: string
  title: string
  location: string
  status: JobStatus
  date: string
}

const STATUS_COLUMNS: JobStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected']

export default function TrackerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // New Job Form State
  const [newCompany, setNewCompany] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newLocation, setNewLocation] = useState('')

  // Load from local storage
  useEffect(() => {
    const savedJobs = localStorage.getItem('muwaazaf_tracker_jobs')
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    } else {
      // Demo data
      setJobs([
        { id: '1', company: 'TechCorp', title: 'Frontend Developer', location: 'Beirut', status: 'Applied', date: new Date().toISOString() },
        { id: '2', company: 'Startup Inc', title: 'React Engineer', location: 'Remote', status: 'Interviewing', date: new Date().toISOString() }
      ])
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('muwaazaf_tracker_jobs', JSON.stringify(jobs))
    }
  }, [jobs, isLoaded])

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany || !newTitle) return

    const newJob: JobApplication = {
      id: Date.now().toString(),
      company: newCompany,
      title: newTitle,
      location: newLocation || 'Remote',
      status: 'Saved',
      date: new Date().toISOString()
    }

    setJobs([...jobs, newJob])
    setNewCompany('')
    setNewTitle('')
    setNewLocation('')
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job))
  }

  if (!isLoaded) return null

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Tracker</h1>
          <p className="text-slate-500">Manage your applications and track your progress.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddJob} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" value={newCompany} onChange={e => setNewCompany(e.target.value)} placeholder="e.g. Google" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Software Engineer" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="e.g. Beirut, Lebanon" />
              </div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">Save Job</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
        {STATUS_COLUMNS.map(status => (
          <div key={status} className="flex-1 min-w-[300px] bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-slate-700">{status}</h3>
              <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full border border-slate-200">
                {jobs.filter(j => j.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3">
              {jobs.filter(j => j.status === status).map(job => (
                <Card key={job.id} className="cursor-pointer border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 leading-tight">{job.title}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.company}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.location}
                      </div>
                      <div className="flex items-center text-xs text-slate-400 mt-2">
                        <Calendar className="w-3 h-3 mr-1" /> Added {new Date(job.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <select 
                      className="w-full text-xs border-slate-200 rounded-md bg-slate-50 py-1.5 px-2 text-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                    >
                      {STATUS_COLUMNS.map(col => (
                        <option key={col} value={col}>Move to {col}</option>
                      ))}
                    </select>
                  </CardContent>
                </Card>
              ))}
              {jobs.filter(j => j.status === status).length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  No jobs here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
