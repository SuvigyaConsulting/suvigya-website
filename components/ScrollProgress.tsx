'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { usePersonalizationStore } from '@/store/personalization'
import { useAccessibility } from '@/components/AccessibilityProvider'

export default function ScrollProgress() {
  const { reducedMotion } = useAccessibility()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  const { updateScrollDepth } = usePersonalizationStore()
  const [scrollDepth, setScrollDepth] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const depth = Math.round(latest * 100)
      setScrollDepth(depth)
      updateScrollDepth(depth)
    })

    return () => unsubscribe()
  }, [scrollYProgress, updateScrollDepth])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600 origin-left z-nav"
      style={{ scaleX: reducedMotion ? scrollYProgress : scaleX }}
    />
  )
}
