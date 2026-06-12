'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, GripVertical, Trash2, Calendar, Building, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/lib/store/interview-store'

type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'

interface JobApplication {
  id: string
  company: string
  title: string
  location: string
  jobDescription: string
  status: JobStatus
  date: string
}

const STATUS_COLUMNS: JobStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected']

const DEMO_DATE = '2026-06-12T00:00:00.000Z'

const createDemoJobs = (): JobApplication[] => [
  { id: '1', company: 'TechCorp', title: 'Frontend Developer', location: 'Beirut', jobDescription: '', status: 'Applied', date: DEMO_DATE },
  { id: '2', company: 'Startup Inc', title: 'React Engineer', location: 'Remote', jobDescription: '', status: 'Interviewing', date: DEMO_DATE }
]

const normalizeJobs = (savedJobs: string): JobApplication[] => {
  try {
    const parsed = JSON.parse(savedJobs) as Partial<JobApplication>[]
    if (!Array.isArray(parsed)) return createDemoJobs()
    return parsed.map((job, index) => ({
      id: job.id || `${index + 1}`,
      company: job.company || 'Company',
      title: job.title || 'Job Title',
      location: job.location || 'Remote',
      jobDescription: job.jobDescription || '',
      status: job.status || 'Saved',
      date: job.date || DEMO_DATE,
    }))
  } catch {
    return createDemoJobs()
  }
}

export default function TrackerPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobApplication[]>(createDemoJobs())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [draggingJobId, setDraggingJobId] = useState<string | null>(null)
  const [dragOverStatus, setDragOverStatus] = useState<JobStatus | null>(null)
  
  // New Job Form State
  const [newCompany, setNewCompany] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const { saveJobDescription, setInterviewData } = useInterviewStore()

  // Load from local storage
  useEffect(() => {
    const savedJobs = localStorage.getItem('muwaazaf_tracker_jobs')
    if (savedJobs) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJobs(normalizeJobs(savedJobs))
    }
  }, [])

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('muwaazaf_tracker_jobs', JSON.stringify(jobs))
  }, [jobs])

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompany || !newTitle) return

    const newJob: JobApplication = {
      id: Date.now().toString(),
      company: newCompany,
      title: newTitle,
      location: newLocation || 'Remote',
      jobDescription: newDescription.trim(),
      status: 'Saved',
      date: new Date().toISOString()
    }

    setJobs((current) => [...current, newJob])
    if (newDescription.trim()) {
      saveJobDescription({
        id: newJob.id,
        label: `${newCompany} - ${newTitle}`,
        text: newDescription.trim(),
      })
      setInterviewData({ jobText: newDescription.trim() })
    }
    setNewCompany('')
    setNewTitle('')
    setNewLocation('')
    setNewDescription('')
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setJobs((current) => current.filter(job => job.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    setJobs((current) => current.map(job => job.id === id ? { ...job, status: newStatus } : job))
  }

  const handleDragStart = (id: string) => {
    setDraggingJobId(id)
  }

  const handleDragEnd = () => {
    setDraggingJobId(null)
    setDragOverStatus(null)
  }

  const handleDrop = (status: JobStatus) => {
    if (draggingJobId) {
      handleStatusChange(draggingJobId, status)
    }
    handleDragEnd()
  }

  const openMatcher = (job: JobApplication) => {
    if (!job.jobDescription) return
    setInterviewData({ jobText: job.jobDescription })
    router.push('/scout')
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job Tracker</h1>
          <p className="text-slate-500">Manage your applications in a clean list, then drag them through each stage.</p>
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
              <div className="space-y-2">
                <Label htmlFor="description">Job Description <span className="text-slate-400">(optional)</span></Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Paste the job description here so you can reuse it in the CV matcher."
                  className="min-h-[120px]"
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">Save Job</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
        {STATUS_COLUMNS.map(status => (
          <div
            key={status}
            className={`flex min-w-[300px] flex-1 flex-col rounded-2xl border p-4 shadow-sm transition ${
              dragOverStatus === status ? 'border-cyan-400 bg-cyan-50/60' : 'border-slate-200 bg-slate-50'
            }`}
            onDragEnter={() => setDragOverStatus(status)}
            onDragLeave={() => setDragOverStatus((current) => current === status ? null : current)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(status)}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-slate-700">{status}</h3>
              <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full border border-slate-200">
                {jobs.filter(j => j.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3">
              {jobs.filter(j => j.status === status).map(job => (
                <Card
                  key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job.id)}
                  onDragEnd={handleDragEnd}
                  className={`group relative cursor-grab border-slate-200 shadow-sm transition-all active:cursor-grabbing ${
                    draggingJobId === job.id ? 'opacity-50 ring-2 ring-cyan-200' : 'hover:-translate-y-0.5 hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 p-1 text-slate-400"
                        aria-label="Drag job"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-900 leading-tight">{job.title}</h4>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                              <span className="inline-flex items-center">
                                <Building className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> {job.company}
                              </span>
                              <span className="inline-flex items-center">
                                <MapPin className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> {job.location}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100" onClick={() => handleDelete(job.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {job.status}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-200">
                            <Calendar className="mr-1 h-3 w-3" /> {new Date(job.date).toLocaleDateString()}
                          </span>
                        </div>

                        {job.jobDescription ? (
                          <p className="mt-3 max-h-16 overflow-hidden text-sm leading-6 text-slate-500">
                            {job.jobDescription}
                          </p>
                        ) : (
                          <p className="mt-3 text-xs text-slate-400">
                            Add a description to reuse it in the CV matcher.
                          </p>
                        )}

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <select
                            className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 focus:border-cyan-500 focus:outline-none"
                            value={job.status}
                            onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                          >
                            {STATUS_COLUMNS.map(col => (
                              <option key={col} value={col}>Move to {col}</option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-slate-200"
                            onClick={() => openMatcher(job)}
                            disabled={!job.jobDescription}
                          >
                            Use in matcher <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {jobs.filter(j => j.status === status).length === 0 && (
                <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                  Drop a job here or add a new application
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
