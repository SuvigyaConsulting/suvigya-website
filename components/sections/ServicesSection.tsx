'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'

const services = [
  {
    title: 'GIS & Spatial Analysis',
    description: 'Advanced geospatial analysis and mapping solutions for natural resources management.',
    icon: '🗺️',
    gradient: 'from-sage-500 to-eucalyptus-400',
    details: [
      'Remote sensing & satellite imagery',
      'Spatial data modeling',
      'Land use mapping',
      'Real-time monitoring systems',
    ],
  },
  {
    title: 'Policy Development',
    description: 'Evidence-based policy frameworks for sustainable resource management.',
    icon: '📋',
    gradient: 'from-sky-400 to-sage-400',
    details: [
      'Environmental policy analysis',
      'Regulatory frameworks',
      'Stakeholder engagement',
      'Impact assessment',
    ],
  },
  {
    title: 'Natural Resources',
    description: 'Comprehensive solutions for sustainable resource utilization.',
    icon: '🌿',
    gradient: 'from-eucalyptus-400 to-mint-400',
    details: [
      'Water management',
      'Forest conservation',
      'Climate adaptation',
      'Ecosystem services',
    ],
  },
  {
    title: 'Grassroots Actions',
    description: 'Community-driven initiatives for sustainable development.',
    icon: '🤝',
    gradient: 'from-amber-400 to-sage-400',
    details: [
      'Community capacity building',
      'Participatory planning',
      'Local governance support',
      'Knowledge transfer',
    ],
  },
  {
    title: 'International Development',
    description: 'Partnerships with global organizations for lasting impact.',
    icon: '🌍',
    gradient: 'from-sage-500 to-sky-400',
    details: [
      'Project management',
      'Donor coordination',
      'Multi-stakeholder engagement',
      'Capacity development',
    ],
  },
  {
    title: 'Research & Analysis',
    description: 'Rigorous research methodologies for informed decisions.',
    icon: '🔬',
    gradient: 'from-mint-400 to-sage-500',
    details: [
      'Impact assessments',
      'Baseline surveys',
      'Scientific reporting',
      'Data analytics',
    ],
  },
]

// Service Card component with uniform sizing and smooth reveal
function ServiceCard({
  service,
  index,
  isExpanded,
  onToggle,
}: {
  service: typeof services[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animation for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <motion.div
        className="h-full glass rounded-panel p-6 md:p-8 cursor-pointer overflow-hidden relative group"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Gradient background on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-500`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
        />

        {/* Spotlight effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(140, 179, 105, 0.15), transparent 40%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col">
          {/* Icon */}
          <motion.div
            className="text-4xl md:text-5xl mb-4"
            style={{ transform: 'translateZ(30px)' }}
          >
            {service.icon}
          </motion.div>

          {/* Title */}
          <h3
            className="text-xl md:text-2xl font-bold mb-3 text-text-heading"
            style={{ transform: 'translateZ(20px)' }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            className="text-text-body mb-4 leading-relaxed"
            style={{ transform: 'translateZ(15px)' }}
          >
            {service.description}
          </p>

          {/* Details list - smooth reveal animation */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pt-2 border-t border-sage-200/50">
              {service.details.map((detail, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-2 text-sm text-text-muted"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: isExpanded ? i * 0.08 : 0, duration: 0.3 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-400 flex-shrink-0" />
                  {detail}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Expand indicator */}
          <motion.div
            className="mt-4 text-sage-600 font-medium text-sm flex items-center gap-1"
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            {isExpanded ? 'Less' : 'More'}
          </motion.div>
        </div>

        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-panel border-2 border-sage-300/0 group-hover:border-sage-300/50 transition-colors pointer-events-none"
        />
      </motion.div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const { addInteraction } = usePersonalizationStore()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
    addInteraction('services')
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 overflow-hidden section-cream"
    >
      {/* Background pattern */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-20 pointer-events-none"
        style={{ y: backgroundY }}
      />

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            What We Do
          </motion.span>
          <h2 className="text-display font-bold mb-6">
            Our <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-xl text-text-body max-w-2xl mx-auto leading-relaxed">
            Comprehensive consulting solutions for sustainable development
            and natural resources management
          </p>
        </motion.div>

        {/* Services Grid - uniform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="#contact"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Discuss Your Project
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
