'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  FolderOpen, 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  BookOpen, 
  TrendingUp, 
  LayoutTemplate,
  Briefcase,
  PlayCircle
} from 'lucide-react'

// Valid YouTube Video Resources Data
const RESOURCES = [
  {
    id: 1,
    title: 'How to Write a Resume from Scratch',
    description: 'A complete step-by-step tutorial on crafting a professional, ATS-friendly resume that grabs the recruiters attention.',
    category: 'Resume & CV',
    icon: LayoutTemplate,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=Tt08KmFfIYQ'
  },
  {
    id: 2,
    title: 'Create an ATS-Optimized Resume',
    description: 'Learn the exact keywords and formatting rules needed to beat the Applicant Tracking System robots.',
    category: 'Resume & CV',
    icon: FileText,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=O12Z4EEMlW0'
  },
  {
    id: 3,
    title: 'How to Pass Behavioral Interviews (STAR Method)',
    description: 'A deep dive into the Situation, Task, Action, Result framework for answering behavioral interview questions.',
    category: 'Interview Strategies',
    icon: Briefcase,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=Wrl-JEHCcEY'
  },
  {
    id: 4,
    title: 'How to Answer "Tell Me About Yourself"',
    description: 'Master the most common (and most difficult) interview question with a proven pitch formula.',
    category: 'Interview Strategies',
    icon: Briefcase,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=MmEQ02XG-A8'
  },
  {
    id: 5,
    title: '5 Things You Should Never Say in an Interview',
    description: 'Avoid these critical red flags and common mistakes that instantly disqualify candidates.',
    category: 'Interview Strategies',
    icon: TrendingUp,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=uA0LzXGz1Z0'
  },
  {
    id: 6,
    title: 'Google Coding Interview Walkthrough',
    description: 'Watch a real Google software engineer solve a challenging algorithm problem during a mock interview.',
    category: 'Technical Interviews',
    icon: BookOpen,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=XKu_SEDAykw'
  },
  {
    id: 7,
    title: 'System Design Interview Crash Course',
    description: 'A crash course covering scalability, databases, and core concepts for senior engineering interviews.',
    category: 'Technical Interviews',
    icon: BookOpen,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=bBTPZ9NdSk8'
  },
  {
    id: 8,
    title: 'Mock Product Manager Interview',
    description: 'A realistic product execution interview covering how to measure success and define metrics.',
    category: 'Technical Interviews',
    icon: PlayCircle,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=XWjoC8i1z90'
  },
  {
    id: 9,
    title: 'Salary Negotiation Strategies',
    description: 'Step-by-step strategies and exact scripts to use when negotiating your offer to ensure you are paid your market value.',
    category: 'Career Growth',
    icon: TrendingUp,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=XY52pqHQZbg'
  },
  {
    id: 10,
    title: 'The 10 Best Remote Job Sites',
    description: 'A breakdown of the top platforms actively hiring international talent for fully remote positions worldwide.',
    category: 'Career Growth',
    icon: ExternalLink,
    action: 'Watch Video',
    actionIcon: PlayCircle,
    url: 'https://www.youtube.com/watch?v=zR114I9-Vcw'
  }
]

const CATEGORIES = ['All', 'Resume & CV', 'Interview Strategies', 'Technical Interviews', 'Career Growth']

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredResources = RESOURCES.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-fade-in w-full pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6 shrink-0">
        <div className="p-3 bg-el-white border shadow-el-inset-edge text-el-black rounded-xl">
          <FolderOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-[28px] font-light tracking-tight text-el-black">Resource Library</h1>
          <p className="text-[15px] text-el-dark-gray mt-1 leading-relaxed">
            Curated templates, guides, and reports to accelerate your career growth.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                activeCategory === category 
                  ? 'bg-el-black text-white shadow-el-card-full' 
                  : 'bg-el-white text-el-dark-gray border border-el-border-light hover:bg-el-light-gray'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-el-dark-gray" />
          <Input 
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-el-white text-[14px] pl-10 border-el-border-light shadow-el-inset-edge rounded-[12px] focus-visible:ring-1 focus-visible:ring-blue-300 h-10"
          />
        </div>
      </div>

      {/* Resource Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = resource.icon
            const ActionIcon = resource.actionIcon
            return (
              <Card 
                key={resource.id} 
                className="group border-none shadow-el-card-full bg-el-white hover:-translate-y-1 transition-transform duration-300 overflow-hidden rounded-[20px] flex flex-col h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-[12px] bg-el-near-white border shadow-el-inset-edge flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-el-black" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-el-dark-gray bg-el-light-gray px-2.5 py-1 rounded-full">
                      {resource.category}
                    </span>
                  </div>
                  
                  <h3 className="text-[18px] font-medium text-el-black tracking-tight leading-tight mb-3">
                    {resource.title}
                  </h3>
                  
                  <p className="text-[14px] text-el-dark-gray leading-relaxed mb-8 flex-1">
                    {resource.description}
                  </p>
                  
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                    <Button 
                      className="w-full bg-el-near-white hover:bg-el-black hover:text-white text-el-black border border-el-border-light shadow-sm transition-colors h-11 text-[14px] font-medium"
                    >
                      <ActionIcon className="w-4 h-4 mr-2" />
                      {resource.action}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-el-white border border-dashed border-el-border-light rounded-[24px]">
          <Search className="h-12 w-12 text-el-dark-gray/30 mb-4" />
          <h3 className="text-lg font-medium text-el-black mb-1">No resources found</h3>
          <p className="text-[14px] text-el-dark-gray">Try adjusting your search or category filter.</p>
          <Button 
            variant="outline" 
            onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
            className="mt-6 bg-el-white border-el-border-light shadow-el-inset-edge"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
