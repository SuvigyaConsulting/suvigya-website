'use client'

import { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccessibility } from './AccessibilityProvider'

interface PinnedSectionProps {
  children: ReactNode
  className?: string
  pinStart?: string
  pinEnd?: string
}

export default function PinnedSection({
  children,
  className = '',
  pinStart = 'start start',
  pinEnd = 'end start',
}: PinnedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [pinStart as any, pinEnd as any],
  })
  const { reducedMotion } = useAccessibility()

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8])

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`sticky top-0 ${className}`}
      style={{ scale, opacity }}
    >
      {children}
    </motion.div>
  )
}
