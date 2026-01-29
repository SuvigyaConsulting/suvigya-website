'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ParallaxMountains, FloatingElements } from '@/components/hero'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Animated text reveal component
function AnimatedText({ children, delay = 0, reducedMotion = false }: { children: React.ReactNode; delay?: number; reducedMotion?: boolean }) {
  return (
    <motion.span
      className="inline-block overflow-hidden"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reducedMotion ? 0 : delay, duration: reducedMotion ? 0 : 0.01 }}
    >
      <motion.span
        className="inline-block pr-[0.15em]"
        initial={reducedMotion ? false : { y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          delay: reducedMotion ? 0 : delay,
          duration: reducedMotion ? 0 : 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { reducedMotion } = useAccessibility()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Smooth spring-based scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform values for parallax effects
  const contentY = useTransform(smoothProgress, [0, 1], [0, -100])
  const contentOpacity = useTransform(smoothProgress, [0, 0.8], [1, 0.3])
  const contentScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8"
    >
      {/* Parallax Mountains Background */}
      <div className="absolute inset-0 -z-section">
        <ParallaxMountains />
      </div>

      {/* Floating Elements (particles, leaves, birds) */}
      <ErrorBoundary componentName="FloatingElements" fallback={null}>
        <FloatingElements particleCount={20} leafCount={6} showBirds />
      </ErrorBoundary>

      {/* Top gradient for smooth nav transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background-page/60 to-transparent z-content pointer-events-none" />

      {/* Content Overlay */}
      <motion.div
        className="relative z-section container mx-auto text-center"
        style={reducedMotion ? {} : {
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.5 }}
          className="max-w-5xl w-full mx-auto"
        >
          {/* Tagline */}
          <motion.p
            className="text-sage-700 font-medium tracking-widest uppercase text-sm md:text-base mb-6"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.3, duration: reducedMotion ? 0 : 0.8 }}
          >
            Natural Resource Management Consultancy
          </motion.p>

          {/* Main Headline */}
          <h1 className="text-hero font-extrabold mb-8 text-forest-800 px-2">
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.5} reducedMotion={reducedMotion}>SHAPING</AnimatedText>
            </div>
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.65} reducedMotion={reducedMotion}>
                <span className="gradient-text">TOMORROW&apos;S</span>
              </AnimatedText>
            </div>
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.8} reducedMotion={reducedMotion}>EARTH</AnimatedText>
            </div>
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-subtitle text-text-body mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 1, duration: reducedMotion ? 0 : 0.8 }}
          >
            Transforming communities through innovative solutions, strategic policy
            making, project development, and actionable insights based on ground reality
          </motion.p>

        </motion.div>
      </motion.div>
    </section>
  )
}
