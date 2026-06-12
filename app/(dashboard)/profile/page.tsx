'use client'

import { useState, useRef } from 'react'
import { useInterviewStore } from '@/lib/store/interview-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileUp, FileText, Loader2, CheckCircle2, UserCircle, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { cvFileName, setInterviewData } = useInterviewStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setError('Please upload a PDF or Word document.')
      return
    }

    setIsUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      // Save parsed text to global store
      setInterviewData({ cvText: data.text, cvFileName: data.fileName })
      
    } catch (err: any) {
      setError(err.message || 'Failed to process file')
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center gap-4 border-b pb-6">
        <UserCircle className="w-12 h-12 text-slate-400" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="text-slate-500">Manage your background and CV documents globally.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* CV Upload Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Resume</CardTitle>
              <CardDescription>Upload your primary CV. This will be automatically used by the Cover Letter Generator, CV Matcher, and Interview Academy.</CardDescription>
            </CardHeader>
            <CardContent>
              {cvFileName ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        Active Resume <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </h3>
                      <p className="text-slate-600 text-sm">{cvFileName}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update File'}
                  </Button>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Drag & Drop your CV here</h3>
                  <p className="text-sm text-slate-500 mb-4">Supports PDF, DOC, and DOCX (Max 5MB)</p>
                  <Button disabled={isUploading} className="bg-violet-600 hover:bg-violet-700">
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Browse Files'}
                  </Button>
                </div>
              )}
              {error && <p className="text-red-500 mt-4 text-sm font-medium text-center">{error}</p>}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0])
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-slate-50 border-none shadow-inner">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-slate-400 mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Privacy & Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your uploaded resume is parsed securely. The text is stored entirely locally on your device using your browser's persistent storage. We never store your raw files on our servers.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
