'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ParallaxMountains, FloatingElements } from '@/components/hero'
import ErrorBoundary from '@/components/ErrorBoundary'

// Animated text reveal component
function AnimatedText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      className="inline-block overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.01 }}
    >
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{
          delay,
          duration: 0.8,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Mountains Background */}
      <div className="absolute inset-0 -z-10">
        <ParallaxMountains />
      </div>

      {/* Floating Elements (particles, leaves, birds) */}
      <ErrorBoundary componentName="FloatingElements" fallback={null}>
        <FloatingElements particleCount={20} leafCount={6} showBirds />
      </ErrorBoundary>

      {/* Top gradient for smooth nav transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background-page/60 to-transparent z-[1] pointer-events-none" />

      {/* Content Overlay */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        style={{
          y: contentY,
          opacity: contentOpacity,
          scale: contentScale,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Tagline */}
          <motion.p
            className="text-sage-700 font-medium tracking-widest uppercase text-sm md:text-base mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Natural Resource Management Consultancy
          </motion.p>

          {/* Main Headline */}
          <h1 className="text-hero font-bold mb-8 leading-[0.95] text-forest-800 px-2">
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.5}>SHAPING</AnimatedText>
            </div>
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.65}>
                <span className="gradient-text">TOMORROW&apos;S</span>
              </AnimatedText>
            </div>
            <div className="overflow-hidden md:overflow-visible">
              <AnimatedText delay={0.8}>EARTH</AnimatedText>
            </div>
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-text-body mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Transforming communities through innovative solutions, strategic policy
            making, project development, and actionable insights based on ground reality
          </motion.p>

        </motion.div>
      </motion.div>
    </section>
  )
}
