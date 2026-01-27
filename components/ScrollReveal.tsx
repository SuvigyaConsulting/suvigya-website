'use client'

import { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from './AccessibilityProvider'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const { reducedMotion } = useAccessibility()
  const [inViewRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const directions = {
    up: [0, -50],
    down: [0, 50],
    left: [-50, 0],
    right: [50, 0],
  }

  const [startY, endY] = directions[direction]
  const y = useTransform(scrollYProgress, [0, 1], [startY, endY])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  if (reducedMotion) {
    return (
      <div ref={inViewRef} className={className}>
        {children}
      </div>
    )
  }

  const combinedRef = (node: HTMLDivElement | null) => {
    if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
    if (typeof inViewRef === 'function') {
      inViewRef(node)
    } else if (inViewRef && 'current' in inViewRef) {
      (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }

  return (
    <motion.div
      ref={combinedRef}
      className={className}
      style={{ y, opacity }}
      initial={{ opacity: 0, y: startY }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
