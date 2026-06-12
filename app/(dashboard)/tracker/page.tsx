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
  
  // Drag and Drop State
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null)
  
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedJobId(id)
    // Required for Firefox to allow dragging
    e.dataTransfer.setData('text/plain', id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
  }

  const handleDrop = (e: React.DragEvent, newStatus: JobStatus) => {
    e.preventDefault()
    if (draggedJobId) {
      handleStatusChange(draggedJobId, newStatus)
      setDraggedJobId(null)
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {STATUS_COLUMNS.map(status => (
          <div 
            key={status} 
            className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col h-full min-h-[400px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="flex items-center justify-between mb-4 px-2 border-b border-slate-200/60 pb-3">
              <h3 className="font-semibold text-slate-700 text-sm tracking-wide">{status}</h3>
              <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                {jobs.filter(j => j.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {jobs.filter(j => j.status === status).map(job => (
                <Card 
                  key={job.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, job.id)}
                  className={`cursor-grab active:cursor-grabbing border-slate-200 shadow-sm hover:shadow-md transition-all group relative bg-white ${draggedJobId === job.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <CardContent className="p-3.5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 leading-tight text-sm line-clamp-2 pr-4">{job.title}</h4>
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 absolute top-3 right-3" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center text-xs text-slate-600 font-medium">
                        <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.company}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {job.location}
                      </div>
                    </div>
                    
                    <select 
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 py-1.5 px-2.5 text-slate-600 focus:ring-cyan-500 focus:border-cyan-500 transition-colors cursor-pointer hover:bg-slate-100 outline-none"
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
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
