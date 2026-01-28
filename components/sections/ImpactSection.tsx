'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const impactMetrics = [
  {
    value: 2000000,
    display: '2M+',
    label: 'People Impacted',
    description: 'Improved access to clean water, sustainable livelihoods, and climate resilience',
    icon: '👥',
    color: 'sage',
  },
  {
    value: 500000,
    display: '500K+',
    label: 'Hectares Protected',
    description: 'Forest conservation and biodiversity protection across multiple continents',
    icon: '🌳',
    color: 'eucalyptus',
  },
  {
    value: 50,
    display: '50+',
    label: 'Communities Empowered',
    description: 'Local capacity building and sustainable development programs',
    icon: '🏘️',
    color: 'amber',
  },
  {
    value: 100,
    display: '100+',
    label: 'Policies Developed',
    description: 'Evidence-based environmental and development policies',
    icon: '📜',
    color: 'sky',
  },
]

// Animated progress ring
function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colorClasses: Record<string, string> = {
    sage: 'var(--color-sage)',
    eucalyptus: 'var(--color-eucalyptus)',
    amber: 'var(--color-amber)',
    sky: 'var(--color-sky)',
  }

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-sage-100"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colorClasses[color] || colorClasses.sage}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  )
}

// Metric card with visualization
function MetricCard({
  metric,
  index,
  inView,
}: {
  metric: typeof impactMetrics[0]
  index: number
  inView: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    const duration = 2000
    const steps = 60
    const increment = metric.value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(metric.value, increment * step)
      setCount(current)

      if (step >= steps) {
        clearInterval(timer)
        setCount(metric.value)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, metric.value])

  // Format large numbers
  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  return (
    <motion.div
      className="glass p-8 rounded-panel text-center relative overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-sage-100/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <motion.div
        className="text-5xl mb-4"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
      >
        {metric.icon}
      </motion.div>

      {/* Progress ring with value */}
      <div className="relative inline-flex items-center justify-center mb-4">
        <ProgressRing progress={inView ? 100 : 0} color={metric.color} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold gradient-text">
            {inView ? metric.display : '0'}
          </span>
        </div>
      </div>

      {/* Label */}
      <h3 className="text-xl font-bold text-text-heading mb-2">{metric.label}</h3>

      {/* Description */}
      <p className="text-sm text-text-muted leading-relaxed">{metric.description}</p>
    </motion.div>
  )
}

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section
      id="impact"
      ref={sectionRef}
      aria-label="Our impact"
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-30 pointer-events-none"
        style={{ y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Our Results
          </motion.span>
          <h2 className="text-title font-bold mb-6">
            <span className="gradient-text">Measurable</span> Impact
          </h2>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Numbers that tell the story of transformation and positive change
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {impactMetrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              inView={isInView}
            />
          ))}
        </div>

        {/* Bottom narrative */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-base md:text-lg text-text-body leading-generous">
            Through our collaborative approach and innovative solutions, we&apos;ve created
            lasting positive change across multiple continents, working hand-in-hand
            with communities, governments, and international organizations.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
