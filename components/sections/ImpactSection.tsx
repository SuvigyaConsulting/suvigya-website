'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

const PeopleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Center person */}
    <circle cx="20" cy="12" r="4" />
    <path d="M12 32v-2a8 8 0 0 1 16 0v2" />
    {/* Left person */}
    <circle cx="8" cy="15" r="3" />
    <path d="M2 32v-1.5a6 6 0 0 1 8-5.7" />
    {/* Right person */}
    <circle cx="32" cy="15" r="3" />
    <path d="M38 32v-1.5a6 6 0 0 0-8-5.7" />
  </svg>
)

const ForestIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Trunk */}
    <path d="M20 38v-14" />
    {/* Main canopy layers */}
    <path d="M20 6l-10 12h5l-4 8h18l-4-8h5L20 6z" />
    {/* Small leaves/branches */}
    <path d="M14 22c-2-1-4 0-5 2" />
    <path d="M26 22c2-1 4 0 5 2" />
    <path d="M16 16c-1.5-1-3.5 0-4 1.5" />
    <path d="M24 16c1.5-1 3.5 0 4 1.5" />
  </svg>
)

const CommunityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Left building */}
    <rect x="3" y="16" width="14" height="20" rx="1" />
    <path d="M10 6l-8 10h16L10 6z" />
    <rect x="7" y="21" width="3" height="4" rx="0.5" />
    <rect x="7" y="29" width="3" height="7" rx="0.5" />
    {/* Right building */}
    <rect x="23" y="12" width="14" height="24" rx="1" />
    <path d="M30 4l-8 8h16L30 4z" />
    <rect x="27" y="17" width="3" height="4" rx="0.5" />
    <rect x="27" y="25" width="3" height="4" rx="0.5" />
    <rect x="27" y="33" width="3" height="3" rx="0.5" />
  </svg>
)

const FrameworksIcon = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Back layer */}
    <rect x="8" y="4" width="26" height="18" rx="2" />
    {/* Middle layer */}
    <rect x="4" y="10" width="26" height="18" rx="2" />
    {/* Front layer */}
    <rect x="0" y="16" width="26" height="18" rx="2" />
    {/* Lines on front layer */}
    <path d="M5 22h16" />
    <path d="M5 27h12" />
    <path d="M5 32h8" />
  </svg>
)

const impactMetrics: {
  value: number
  display: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
}[] = [
  {
    value: 2000000,
    display: '2M+',
    label: 'People Impacted',
    description: 'Improved access to clean water, sustainable livelihoods, and climate resilience',
    icon: <PeopleIcon />,
    color: 'sage',
  },
  {
    value: 500000,
    display: '500K+',
    label: 'Hectares Protected',
    description: 'Forest conservation and biodiversity protection across multiple continents',
    icon: <ForestIcon />,
    color: 'eucalyptus',
  },
  {
    value: 50,
    display: '50+',
    label: 'Communities Empowered',
    description: 'Local capacity building and sustainable development programs',
    icon: <CommunityIcon />,
    color: 'amber',
  },
  {
    value: 100,
    display: '100+',
    label: 'Frameworks Developed',
    description: 'Evidence-based environmental and development frameworks',
    icon: <FrameworksIcon />,
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
  reducedMotion = false,
}: {
  metric: typeof impactMetrics[0]
  index: number
  inView: boolean
  reducedMotion?: boolean
}) {
  return (
    <motion.div
      className="glass p-6 md:p-8 rounded-panel text-center relative overflow-hidden group"
      initial={reducedMotion ? false : { opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={reducedMotion ? { duration: 0 } : { delay: index * 0.15, duration: 0.6 }}
      whileHover={reducedMotion ? {} : { y: -8, scale: 1.02 }}
    >
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-radial from-sage-100/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <motion.div
        className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-sage-100 to-eucalyptus-50 flex items-center justify-center text-sage-700 mb-4"
        initial={reducedMotion ? false : { scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={reducedMotion ? { duration: 0 } : { delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
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
      <h3 className="text-xl md:text-2xl font-bold text-text-heading mb-3">{metric.label}</h3>

      {/* Description */}
      <p className="text-sm text-text-muted leading-relaxed">{metric.description}</p>
    </motion.div>
  )
}

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { reducedMotion } = useAccessibility()

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
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden section-warm"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-30 pointer-events-none"
        style={reducedMotion ? {} : { y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            Our Track Record
          </motion.span>
          <h2 className="text-title font-bold mb-4">
            <span className="gradient-text">Impact</span> at Scale
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Numbers that tell the story of transformation and positive change
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-12">
          {impactMetrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              inView={isInView}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Bottom narrative */}
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { delay: 0.6, duration: 0.8 }}
        >
          <p className="text-base md:text-lg text-text-body leading-generous">
            From watershed restoration in central India to climate adaptation frameworks
            for multilateral agencies, our work delivers results that governments, communities,
            and development partners can point to and build on.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
