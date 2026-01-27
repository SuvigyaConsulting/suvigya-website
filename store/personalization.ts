import { create } from 'zustand'

interface PersonalizationState {
  sessionStartTime: number
  scrollDepth: number
  timeOnPage: number
  interactions: string[]
  preferences: {
    reducedMotion: boolean
    highContrast: boolean
  }
  initializeSession: () => void
  updateScrollDepth: (depth: number) => void
  addInteraction: (interaction: string) => void
  updatePreferences: (prefs: Partial<PersonalizationState['preferences']>) => void
  getContextualCTA: () => string
}

export const usePersonalizationStore = create<PersonalizationState>()(
  (set, get) => ({
      sessionStartTime: Date.now(),
      scrollDepth: 0,
      timeOnPage: 0,
      interactions: [],
      preferences: {
        reducedMotion: false,
        highContrast: false,
      },
      initializeSession: () => {
        set({ sessionStartTime: Date.now() })
      },
      updateScrollDepth: (depth: number) => {
        set({ scrollDepth: depth })
      },
      addInteraction: (interaction: string) => {
        set((state) => ({
          interactions: [...state.interactions, interaction],
        }))
      },
      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }))
      },
      getContextualCTA: () => {
        const state = get()
        const timeOnPage = (Date.now() - state.sessionStartTime) / 1000
        
        if (state.scrollDepth > 80) {
          return 'Ready to transform your project?'
        }
        if (timeOnPage > 60 && state.interactions.length > 3) {
          return 'Let\'s discuss your needs'
        }
        if (state.interactions.includes('services')) {
          return 'Explore our expertise'
        }
        return 'Start your journey'
      },
    })
)
