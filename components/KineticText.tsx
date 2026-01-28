'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccessibility } from './AccessibilityProvider'

interface KineticTextProps {
  children: string
  className?: string
  delay?: number
}

// Extracted word component to comply with hooks rules
function KineticWord({ word, index, scrollYProgress, delay }: { word: string; index: number; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; delay: number }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, -20 * (index % 3)])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <motion.span
      className="inline-block mr-2"
      style={{ y, opacity }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay + index * 0.05, duration: 0.5 }}
    >
      {word}
    </motion.span>
  )
}

export default function KineticText({ children, className = '', delay = 0 }: KineticTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const { reducedMotion } = useAccessibility()

  const words = children.split(' ')

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <KineticWord key={index} word={word} index={index} scrollYProgress={scrollYProgress} delay={delay} />
      ))}
    </div>
  )
}
