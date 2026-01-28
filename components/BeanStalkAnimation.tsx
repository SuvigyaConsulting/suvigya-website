'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccessibility } from './AccessibilityProvider'

// Section milestones for leaf nodes - approximate scroll positions
const SECTION_MILESTONES = [
  { id: 'home', label: 'Home', progress: 0 },
  { id: 'about', label: 'About', progress: 0.14 },
  { id: 'services', label: 'Services', progress: 0.28 },
  { id: 'projects', label: 'Projects', progress: 0.42 },
  { id: 'partners', label: 'Partners', progress: 0.56 },
  { id: 'impact', label: 'Impact', progress: 0.70 },
  { id: 'contact', label: 'Contact', progress: 0.85 },
]

// Extracted leaf component to comply with hooks rules
function LeafNode({ scrollYProgress, milestone }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']; milestone: typeof SECTION_MILESTONES[number] }) {
  const leafOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, milestone.progress - 0.03), milestone.progress, Math.min(1, milestone.progress + 0.03)],
    [0, 0.7, 0.7]
  )
  const leafScale = useTransform(
    scrollYProgress,
    [Math.max(0, milestone.progress - 0.03), milestone.progress],
    [0, 1]
  )

  return (
    <motion.div
      key={milestone.id}
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        top: `${milestone.progress * 100}%`,
        opacity: leafOpacity,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        style={{ scale: leafScale }}
        fill="none"
        stroke="rgba(74, 122, 98, 0.7)"
        strokeWidth="1.5"
      >
        <path
          d="M10 4 Q12 8, 10 12 Q8 8, 10 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
        <line x1="10" y1="12" x2="10" y2="16" strokeLinecap="round" opacity="0.5" />
      </motion.svg>
    </motion.div>
  )
}

export default function BeanStalkAnimation() {
  const { scrollYProgress } = useScroll()
  const { reducedMotion } = useAccessibility()
  const [isMobile, setIsMobile] = useState(false)
  const [documentHeight, setDocumentHeight] = useState(0)

  // All hooks must be called before any conditional return
  const stalkHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const tipOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0])

  useEffect(() => {
    const updateDimensions = () => {
      setIsMobile(window.innerWidth < 1024)
      setDocumentHeight(document.documentElement.scrollHeight)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(document.body)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      resizeObserver.disconnect()
    }
  }, [])

  // Conditional return AFTER all hooks
  if (isMobile || reducedMotion) {
    return null
  }

  return (
    <div
      className="fixed left-6 top-0 bottom-0 w-0.5 pointer-events-none z-section hidden lg:block"
      aria-hidden="true"
      style={{ willChange: 'transform' }}
    >
      {/* Main stalk line - organic gradient */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-0.5"
        style={{
          height: stalkHeight,
          background: 'linear-gradient(to bottom, rgba(74, 122, 98, 0.6), rgba(88, 143, 117, 0.5))',
          top: 0,
          willChange: 'transform',
        }}
      />

      {/* Leaf nodes at section milestones */}
      {SECTION_MILESTONES.map((milestone) => (
        <LeafNode key={milestone.id} scrollYProgress={scrollYProgress} milestone={milestone} />
      ))}

      {/* Subtle growth indicator at current scroll position */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: stalkHeight,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: 'rgba(74, 122, 98, 0.6)',
            opacity: tipOpacity,
          }}
        />
      </motion.div>
    </div>
  )
}
