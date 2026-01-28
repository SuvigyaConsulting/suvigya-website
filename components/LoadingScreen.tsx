'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const { reducedMotion } = useAccessibility()

  useEffect(() => {
    // Skip loading screen entirely when reducedMotion
    const delay = reducedMotion ? 0 : 3000
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-loading overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-background-page" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-sage-100/30" />

          <div className="relative h-full flex flex-col items-center justify-center">
            <motion.h1
              className="font-bold text-sage-700 tracking-[8px] text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              SUVIGYA
            </motion.h1>

            <motion.p
              className="text-text-muted text-sm tracking-widest uppercase mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Nurturing Growth
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
