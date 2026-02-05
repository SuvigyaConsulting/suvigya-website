'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Stats data
const stats = [
  { value: 13, suffix: '+', label: 'Years Experience', color: 'sage' },
  { value: 50, suffix: '+', label: 'Projects Completed', color: 'eucalyptus' },
  { value: 20, suffix: '+', label: 'Sectors Served', color: 'sky' },
  { value: 2, suffix: 'M+', label: 'Lives Impacted', color: 'amber' },
]

// Animated counter component
function AnimatedCounter({ value, suffix = '', inView, reducedMotion = false }: { value: number; suffix?: string; inView: boolean; reducedMotion?: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reducedMotion) {
      setDisplayValue(value)
      return
    }

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 2000, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, inView, reducedMotion])

  return (
    <span>
      {displayValue}{suffix}
    </span>
  )
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const { reducedMotion } = useAccessibility()

  const statsInView = useInView(statsRef, { once: true, margin: '-50px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About us"
      className="relative py-12 md:py-16 lg:py-24 overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-30 pointer-events-none"
        style={reducedMotion ? {} : { y: backgroundY }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={reducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            Our Journey
          </motion.span>
          <h2 className="text-title font-bold mb-6">
            <span className="gradient-text">13 Years of Impact</span>
          </h2>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            From a small consultancy to a national force for positive change,
            our journey has been defined by innovation and impact.
          </p>
        </motion.div>

        {/* About Description */}
        <motion.div
          className="max-w-3xl mx-auto mb-10 md:mb-14 space-y-4 text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
        >
          <p className="text-text-body leading-relaxed text-base md:text-lg">
            We are a specialist consulting and advisory firm that bridges the gap between policy design and ground-level implementation. Since 2013, we have partnered with governments, international agencies, and the private sector to deliver measurable impact in natural resource management, rural livelihoods, climate resilience, and sustainable development.
          </p>
          <p className="text-text-body leading-relaxed text-base md:text-lg">
            We take end-to-end ownership of our work, combining embedded research, strong governance, and on-the-ground presence to support projects from concept through delivery. This ensures continuity, accountability, and practical results across the full project lifecycle.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          initial={reducedMotion ? false : { opacity: 0, y: 50 }}
          whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass p-8 text-center group cursor-default"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={reducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={reducedMotion ? {} : { y: -8, scale: 1.02 }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 gradient-text">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={statsInView} reducedMotion={reducedMotion} />
              </div>
              <div className="text-text-muted font-medium">{stat.label}</div>

              {/* Decorative ring */}
              <motion.div
                className="absolute inset-0 rounded-card border-2 border-sage-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                initial={false}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
