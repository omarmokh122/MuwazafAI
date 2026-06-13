import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProfileState {
  fullName: string
  email: string
  currentPosition: string
  targetRole: string
  field: string
  cvText: string
  cvFileName: string | null
  setProfile: (data: Partial<Omit<UserProfileState, 'setProfile' | 'clearProfile' | 'initials'>>) => void
  clearProfile: () => void
  initials: () => string
}

const initialState = {
  fullName: '',
  email: '',
  currentPosition: '',
  targetRole: '',
  field: '',
  cvText: '',
  cvFileName: null as string | null,
}

export const useUserProfile = create<UserProfileState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setProfile: (data) => set((state) => ({ ...state, ...data })),
      clearProfile: () => set(initialState),
      initials: () => {
        const name = get().fullName.trim()
        if (!name) return 'U'
        const parts = name.split(/\s+/)
        if (parts.length >= 2) {
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return name.substring(0, 1).toUpperCase()
      },
    }),
    {
      name: 'muwaazaf-user-profile',
    }
  )
)
