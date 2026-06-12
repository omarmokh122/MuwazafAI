export interface Profile {
  id: string
  full_name: string
  email: string
  age?: number
  country?: string
  education_level?: 'High School' | 'Undergraduate' | 'Graduate' | 'PhD' | 'Self-Taught' | 'Other'
  major?: string
  years_of_experience?: number
  current_status?: 'Student' | 'Fresh Graduate' | 'Working' | 'Career Changer' | 'Unemployed'
  target_field?: string
  linkedin_url?: string
  github_url?: string
  bio?: string
  avatar_url?: string
  gemini_api_key?: string
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  user_id: string
  title: string
  description?: string
  file_url?: string
  file_name?: string
  file_size?: number
  file_type?: string
  category?: 'CV' | 'Cover Letter' | 'Certificate' | 'Course Material' | 'Job Posting' | 'Contract' | 'Other'
  tags?: string[]
  is_public?: boolean
  download_count?: number
  created_at: string
}

export interface ScoutSession {
  id: string
  user_id: string
  cv_text?: string
  job_text?: string
  job_title?: string
  company?: string
  fit_score?: number
  matching_skills?: string[]
  gap_skills?: string[]
  analysis?: string
  created_at: string
}

export interface CoachSession {
  id: string
  user_id: string
  scout_session_id?: string
  gaps?: string[]
  lessons?: Lesson[]
  quiz_results?: QuizResult[]
  quiz_score?: number
  quiz_total?: number
  passed?: boolean
  created_at: string
}

export interface Lesson {
  id: number
  title: string
  content: string
  skill: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface QuizResult {
  questionIndex: number
  selectedAnswer: number
  isCorrect: boolean
}

export interface YoutubeResource {
  id: string
  title: string
  channel: string
  youtube_url: string
  thumbnail_url?: string
  skill_tags?: string[]
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  category?: string
  duration?: string
  description?: string
  is_featured?: boolean
  created_at: string
}

export interface ContractInfraction {
  article: string
  topic: string
  severity: 'CRITICAL' | 'WARNING'
  matchedText: string
  explanation: string
  remedy: string
}

export interface BenchmarkResult {
  jobTitle: string
  demand: 'High' | 'Medium' | 'Low'
  skills: string[]
  localOnsite: SalaryRange
  localRemote: SalaryRange
  regionalRemote: SalaryRange
  stayOrGoComparison: StayOrGoData
}

export interface SalaryRange {
  min: number
  max: number
  label: string
}

export interface StayOrGoData {
  abroadLocation: string
  abroadGrossSalary: number
  abroadTax: number
  abroadRent: number
  abroadLiving: number
  abroadSavings: number
  abroadNarrative: string
  beirutGrossSalary: number
  beirutTax: number
  beirutRent: number
  beirutLiving: number
  beirutSavings: number
  beirutNarrative: string
}
