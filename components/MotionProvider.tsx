'use client'

import { ReactNode } from 'react'
import { useAccessibility } from './AccessibilityProvider'

export default function MotionProvider({ children }: { children: ReactNode }) {
  const { reducedMotion } = useAccessibility()
  
  return (
    <div data-reduced-motion={reducedMotion}>
      {children}
    </div>
  )
}
