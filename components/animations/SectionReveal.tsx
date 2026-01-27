'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  threshold?: number
  once?: boolean
}

export default function SectionReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  threshold = 0.1,
  once = true,
}: SectionRevealProps) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  })

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 50, x: 0 }
      case 'down':
        return { y: -50, x: 0 }
      case 'left':
        return { y: 0, x: 50 }
      case 'right':
        return { y: 0, x: -50 }
      default:
        return { y: 50, x: 0 }
    }
  }

  const initialPosition = getInitialPosition()

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...initialPosition }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Staggered children reveal component
interface StaggerRevealProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  duration?: number
  threshold?: number
}

export function StaggerReveal({
  children,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  duration = 0.5,
  threshold = 0.1,
}: StaggerRevealProps) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: 30, x: 0 }
      case 'down':
        return { y: -30, x: 0 }
      case 'left':
        return { y: 0, x: 30 }
      case 'right':
        return { y: 0, x: -30 }
      default:
        return { y: 30, x: 0 }
    }
  }

  const initialPosition = getInitialPosition()

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, ...initialPosition }}
          animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
