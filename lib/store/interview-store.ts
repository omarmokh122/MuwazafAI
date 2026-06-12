import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InterviewState {
  cvText: string
  cvFileName: string | null
  jobText: string
  savedJobDescriptions: SavedJobDescription[]
  gaps: string[]
  matching: string[]
  setInterviewData: (data: { cvText?: string, cvFileName?: string | null, jobText?: string, gaps?: string[], matching?: string[] }) => void
  saveJobDescription: (job: SavedJobDescription) => void
}

interface SavedJobDescription {
  id: string
  label: string
  text: string
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      cvText: '',
      cvFileName: null,
      jobText: '',
      savedJobDescriptions: [],
      gaps: [],
      matching: [],
      setInterviewData: (data) => set((state) => ({ ...state, ...data })),
      saveJobDescription: (job) =>
        set((state) => {
          const nextJobs = [job, ...state.savedJobDescriptions.filter((item) => item.text !== job.text)]
          return {
            ...state,
            savedJobDescriptions: nextJobs.slice(0, 5),
          }
        }),
    }),
    {
      name: 'muwaazaf-interview-storage',
    }
  )
)
