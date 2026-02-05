'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'
import { useAccessibility } from '@/components/AccessibilityProvider'

const services = [
  {
    title: 'Policy, Strategy & Institutional Advisory',
    description: 'For governments, donors, and agencies seeking evidence-based direction.',
    icon: '🏛️',
    gradient: 'from-sage-500 to-eucalyptus-400',
    details: [
      'Policy analysis',
      'Strategy and sector roadmaps',
      'Regulatory and institutional frameworks',
      'Program design',
      'Capacity assessments',
      'Technical secretariat support',
    ],
  },
  {
    title: 'Climate, Environment & Natural Resources',
    description: 'Mitigation, adaptation, resilience, biodiversity, and landscape management.',
    icon: '🌍',
    gradient: 'from-sky-400 to-sage-400',
    details: [
      'Climate vulnerability assessments',
      'Nature-based solutions',
      'Carbon finance and REDD+',
      'Watershed and landscape restoration',
      'Biodiversity conservation',
      'ESMFs, EIAs, and safeguards',
    ],
  },
  {
    title: 'Agriculture, Livelihoods & Rural Development',
    description: 'Market-linked, inclusive, and resilient rural systems.',
    icon: '🌾',
    gradient: 'from-amber-400 to-sage-400',
    details: [
      'Integrated rural development',
      'Agricultural and non-farm value chains',
      'FPO strengthening',
      'Market access and private-sector linkages',
      'Rural enterprise and MSME development',
      'NTFP-based livelihoods',
    ],
  },
  {
    title: 'Finance, Investment & Economic Advisory',
    description: 'Mobilizing and structuring finance for development impact.',
    icon: '💰',
    gradient: 'from-sage-500 to-sky-400',
    details: [
      'Blended and climate finance',
      'Public-private partnerships',
      'Economic, financial, and fiscal analysis',
      'Investment prioritization',
      'CSR, ESG, and impact investment',
    ],
  },
  {
    title: 'Research, Analytics & Policy Frameworks',
    description: 'Evidence systems that inform decisions and policy choices.',
    icon: '🔍',
    gradient: 'from-eucalyptus-400 to-mint-400',
    details: [
      'Research design',
      'Surveys, sampling, and data collection',
      'Econometric and spatial analysis',
      'Political economy analysis',
      'Policy evaluation and evidence frameworks',
    ],
  },
  {
    title: 'Project Preparation, Documentation & Compliance',
    description: 'Decision-ready documentation for donors and governments.',
    icon: '📋',
    gradient: 'from-amber-400 to-eucalyptus-400',
    details: [
      'Project preparation documents',
      'Feasibility studies, DPRs, and PIMs',
      'Policy and strategy papers',
      'Safeguards and compliance documentation',
      'Donor financing proposals',
    ],
  },
  {
    title: 'Monitoring, Evaluation, Learning & Digital Systems',
    description: 'Accountability, learning, and adaptive management at scale.',
    icon: '📊',
    gradient: 'from-mint-400 to-sage-500',
    details: [
      'Results frameworks',
      'MEL system design',
      'Baseline, midline, and endline studies',
      'Third-party monitoring',
      'MIS, dashboards, and decision-support tools',
      'GIS and spatial analytics',
    ],
  },
  {
    title: 'Capacity Building & Institutional Strengthening',
    description: 'Building the skills, systems, and structures that sustain results beyond the project cycle.',
    icon: '🎓',
    gradient: 'from-sky-400 to-mint-400',
    details: [
      'Training for government and implementing agencies',
      'Institutional development and governance frameworks',
      'Participatory planning and stakeholder engagement',
      'Knowledge management and learning dissemination',
      'SOPs, manuals, and operational guidelines',
    ],
  },
  {
    title: 'On-Ground Implementation & Staffing',
    description: 'The differentiator many firms lack.',
    icon: '🤝',
    gradient: 'from-sage-500 to-eucalyptus-400',
    details: [
      'Field-level coordination',
      'PMU and PIU staffing',
      'Technical experts and field teams',
      'Surge staffing for projects',
      'Community facilitation',
      'Implementation supervision',
    ],
  },
]

function ServiceCard({
  service,
  index,
  isExpanded,
  onToggle,
  reducedMotion = false,
}: {
  service: typeof services[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
  reducedMotion?: boolean
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 50 }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={reducedMotion ? { duration: 0 } : { delay: index * 0.1, duration: 0.6 }}
    >
      <motion.div
        className="h-full glass rounded-panel p-6 md:p-8 cursor-pointer overflow-hidden relative group"
        onClick={onToggle}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${service.title} - ${isExpanded ? 'collapse' : 'expand'} details`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-section flex flex-col">
          {/* Icon */}
          <div className="text-4xl md:text-5xl mb-4">
            {service.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-text-heading">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-text-body mb-4 leading-relaxed">
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
            className="mt-4 text-sage-600 font-medium text-sm flex items-center gap-1 min-h-[44px] py-2"
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
  const { reducedMotion } = useAccessibility()

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
      aria-label="Our services"
      className="relative py-12 md:py-16 lg:py-24 overflow-hidden section-cream"
    >
      {/* Background pattern */}
      <motion.div
        className="absolute inset-0 topographic-bg opacity-20 pointer-events-none"
        style={reducedMotion ? {} : { y: backgroundY }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-8 md:mb-12"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            What We Do
          </motion.span>
          <h2 className="text-title font-bold mb-6">
            Our <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Policy to Practice. Strategy to Scale. Real world insights for outcomes that last.
          </p>
        </motion.div>

        {/* Services Grid - uniform cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
