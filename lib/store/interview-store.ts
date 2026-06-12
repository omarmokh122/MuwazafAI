import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InterviewState {
  cvText: string
  cvFileName: string | null
  jobText: string
  gaps: string[]
  matching: string[]
  setInterviewData: (data: { cvText?: string, cvFileName?: string | null, jobText?: string, gaps?: string[], matching?: string[] }) => void
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      cvText: '',
      cvFileName: null,
      jobText: '',
      gaps: [],
      matching: [],
      setInterviewData: (data) => set((state) => ({ ...state, ...data }))
    }),
    {
      name: 'muwaazaf-interview-storage',
    }
  )
)
