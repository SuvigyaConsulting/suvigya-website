'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePersonalizationStore } from '@/store/personalization'

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  toggleReducedMotion: () => void
  toggleHighContrast: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export default function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(true) // Default to high contrast
  const { preferences, updatePreferences } = usePersonalizationStore()

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Check system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches || preferences.reducedMotion)
    
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setHighContrast(contrastQuery.matches || preferences.highContrast)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [preferences])

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    updatePreferences({ reducedMotion: newValue })
  }

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    updatePreferences({ highContrast: newValue })
  }

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion)
    document.documentElement.classList.toggle('high-contrast', highContrast)
  }, [reducedMotion, highContrast])

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        highContrast,
        toggleReducedMotion,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}
