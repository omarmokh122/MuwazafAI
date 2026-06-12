'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileSearch, Loader2, CheckCircle2, AlertCircle, Target } from 'lucide-react'
import { extractSkills } from '@/lib/parsers/skills'

export default function ScoutAgentPage() {
  const [cvText, setCvText] = useState('')
  const [jobText, setJobText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleScan = async () => {
    setLoading(true)
    
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1500))

    // Client-side NLP parsing
    const cvSkills = extractSkills(cvText)
    const jobSkills = extractSkills(jobText)

    const matching = jobSkills.filter(skill => cvSkills.includes(skill))
    const gaps = jobSkills.filter(skill => !cvSkills.includes(skill))
    
    const score = jobSkills.length > 0 ? Math.round((matching.length / jobSkills.length) * 100) : 0

    setResult({
      score,
      matching,
      gaps,
      analysis: score > 70 
        ? "Strong fit. Your CV highlights most of the required skills."
        : "Moderate fit. You have significant skill gaps that need to be addressed before applying."
    })
    
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <FileSearch className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scout Agent</h1>
          <p className="text-muted-foreground">Scan your CV against live job descriptions to find skill gaps.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>Paste your CV and the target job description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your CV</Label>
                <Textarea 
                  placeholder="Paste your CV content here..." 
                  className="min-h-[200px]"
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea 
                  placeholder="Paste the job description here..." 
                  className="min-h-[200px]"
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleScan} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading || !cvText || !jobText}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scanning...</>
                ) : (
                  <><FileSearch className="mr-2 h-4 w-4" /> Run Scout Analysis</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={`h-full ${!result && !loading ? 'opacity-50' : ''}`}>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Your fit score and identified skill gaps.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
                  <p>Analyzing NLP syntax trees...</p>
                  <p className="text-sm">Comparing semantic skill clusters...</p>
                </div>
              ) : result ? (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}%</div>
                    <p className="font-medium text-lg">Overall Fit Score</p>
                    <Progress value={result.score} className="h-3 mt-4" />
                    <p className="text-sm text-muted-foreground mt-4">{result.analysis}</p>
                  </div>

                  <Tabs defaultValue="gaps" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="gaps">Missing Skills ({result.gaps.length})</TabsTrigger>
                      <TabsTrigger value="matches">Matching ({result.matching.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gaps" className="mt-4">
                      {result.gaps.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.gaps.map((skill: string, i: number) => (
                            <Badge key={i} variant="destructive" className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 border-none">
                              <AlertCircle className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No skill gaps found! You are a perfect match.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="matches" className="mt-4">
                      {result.matching.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.matching.map((skill: string, i: number) => (
                            <Badge key={i} variant="outline" className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No matching skills found.</p>
                      )}
                    </TabsContent>
                  </Tabs>

                  {result.gaps.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-4">Next Step</p>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <Target className="mr-2 h-4 w-4" /> Send Gaps to Coach Agent
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                  Run an analysis to see results here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
