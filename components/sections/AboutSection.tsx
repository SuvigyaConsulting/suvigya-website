'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'

// Timeline milestones data
const milestones = [
  {
    year: '2008',
    title: 'Foundation',
    description: 'SUVIGYA Consulting established with a mission to transform natural resource management',
    icon: '🌱',
  },
  {
    year: '2012',
    title: 'First UN Project',
    description: 'Partnered with United Nations on watershed management across Southeast Asia',
    icon: '🌍',
  },
  {
    year: '2016',
    title: 'GIS Innovation',
    description: 'Launched proprietary GIS platform for real-time environmental monitoring',
    icon: '🗺️',
  },
  {
    year: '2020',
    title: 'Global Expansion',
    description: 'Extended operations to 20+ countries with World Bank partnership',
    icon: '🚀',
  },
  {
    year: '2024',
    title: 'Climate Leadership',
    description: 'Leading climate adaptation programs impacting 2M+ lives worldwide',
    icon: '🌿',
  },
]

// Stats data
const stats = [
  { value: 15, suffix: '+', label: 'Years Experience', color: 'sage' },
  { value: 50, suffix: '+', label: 'Projects Completed', color: 'eucalyptus' },
  { value: 20, suffix: '+', label: 'Countries Served', color: 'sky' },
  { value: 2, suffix: 'M+', label: 'Lives Impacted', color: 'amber' },
]

// Animated counter component
function AnimatedCounter({ value, suffix = '', inView }: { value: number; suffix?: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return

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
  }, [value, inView])

  return (
    <span>
      {displayValue}{suffix}
    </span>
  )
}

// Timeline item component
function TimelineItem({
  milestone,
  index,
  isActive,
}: {
  milestone: typeof milestones[0]
  index: number
  isActive: boolean
}) {
  return (
    <motion.div
      className={`relative flex-shrink-0 w-[300px] md:w-[350px] p-6 rounded-panel transition-all duration-500 ${
        isActive ? 'glass scale-105 shadow-elevated' : 'bg-background-card/50 scale-100'
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      {/* Year badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
        isActive ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-700'
      }`}>
        <span className="text-lg">{milestone.icon}</span>
        <span className="font-bold">{milestone.year}</span>
      </div>

      {/* Content */}
      <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-sage-700' : 'text-text-heading'}`}>
        {milestone.title}
      </h3>
      <p className="text-text-muted text-sm leading-relaxed">
        {milestone.description}
      </p>

    </motion.div>
  )
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Update active timeline item based on scroll within timeline
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const scrollLeft = timelineRef.current.scrollLeft
        const itemWidth = 380 // approximate width + gap
        const newIndex = Math.round(scrollLeft / itemWidth)
        setActiveIndex(Math.min(newIndex, milestones.length - 1))
      }
    }

    const timeline = timelineRef.current
    timeline?.addEventListener('scroll', handleScroll)
    return () => timeline?.removeEventListener('scroll', handleScroll)
  }, [])

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - timelineRef.current.offsetLeft)
    setScrollLeft(timelineRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !timelineRef.current) return
    e.preventDefault()
    const x = e.pageX - timelineRef.current.offsetLeft
    const walk = (x - startX) * 2
    timelineRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-24 overflow-hidden"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-30 pointer-events-none"
        style={{ y: backgroundY }}
      />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Our Journey
          </motion.span>
          <h2 className="text-display font-bold mb-6">
            <span className="gradient-text">15 Years</span> of Impact
          </h2>
          <p className="text-xl text-text-body max-w-2xl mx-auto leading-relaxed">
            From a small consultancy to a global force for positive change,
            our journey has been defined by innovation and impact.
          </p>
          <p className="text-sm text-text-muted mt-4">
            Drag to explore our timeline
          </p>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="relative mb-20">

          {/* Scrollable timeline container with drag support */}
          <div
            ref={timelineRef}
            className={`flex gap-8 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory scrollbar-hide select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Spacer for centering first item */}
            <div className="flex-shrink-0 w-[calc(50vw-200px)] hidden md:block" />

            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="snap-center">
                <TimelineItem
                  milestone={milestone}
                  index={index}
                  isActive={index === activeIndex}
                />
              </div>
            ))}

            {/* Spacer for centering last item */}
            <div className="flex-shrink-0 w-[calc(50vw-200px)] hidden md:block" />
          </div>

        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass p-8 text-center group cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={`text-5xl md:text-6xl font-bold mb-3 gradient-text`}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
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
