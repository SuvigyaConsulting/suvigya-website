'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Professional inline SVG icons for each service
const PolicyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4L6 12v2h28v-2L20 4z" />
    <line x1="10" y1="14" x2="10" y2="30" />
    <line x1="17" y1="14" x2="17" y2="30" />
    <line x1="23" y1="14" x2="23" y2="30" />
    <line x1="30" y1="14" x2="30" y2="30" />
    <rect x="4" y="30" width="32" height="3" rx="0.5" />
    <rect x="6" y="33" width="28" height="3" rx="0.5" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="20" r="16" />
    <ellipse cx="20" cy="20" rx="8" ry="16" />
    <line x1="4" y1="20" x2="36" y2="20" />
    <path d="M6.5 12h27" />
    <path d="M6.5 28h27" />
  </svg>
)

const AgricultureIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 36V18" />
    <path d="M20 18c-2-4-8-8-8-14 0 6 6 10 8 14z" />
    <path d="M20 18c2-4 8-8 8-14 0 6-6 10-8 14z" />
    <path d="M20 24c-2-3-7-6-7-11 0 5 5 8 7 11z" />
    <path d="M20 24c2-3 7-6 7-11 0 5-5 8-7 11z" />
    <path d="M20 30c-1.5-2.5-5-4.5-5-8 0 3.5 3.5 5.5 5 8z" />
    <path d="M20 30c1.5-2.5 5-4.5 5-8 0 3.5-3.5 5.5-5 8z" />
  </svg>
)

const FinanceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="34" x2="6" y2="6" />
    <line x1="6" y1="34" x2="36" y2="34" />
    <rect x="10" y="24" width="5" height="10" rx="0.5" />
    <rect x="18" y="18" width="5" height="16" rx="0.5" />
    <rect x="26" y="12" width="5" height="22" rx="0.5" />
    <path d="M10 20l8-6 8-4 6-4" />
    <path d="M28 6h6v6" />
  </svg>
)

const ResearchIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="12" />
    <line x1="27" y1="27" x2="36" y2="36" />
    <circle cx="14" cy="16" r="1.5" />
    <circle cx="20" cy="14" r="1.5" />
    <circle cx="22" cy="20" r="1.5" />
    <circle cx="16" cy="22" r="1.5" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4h14l8 8v24a2 2 0 01-2 2H10a2 2 0 01-2-2V6a2 2 0 012-2z" />
    <path d="M24 4v8h8" />
    <line x1="14" y1="20" x2="28" y2="20" />
    <line x1="14" y1="25" x2="28" y2="25" />
    <line x1="14" y1="30" x2="22" y2="30" />
  </svg>
)

const MonitoringIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="32" height="32" rx="2" />
    <line x1="4" y1="14" x2="36" y2="14" strokeWidth="0.75" strokeDasharray="2 2" />
    <line x1="4" y1="24" x2="36" y2="24" strokeWidth="0.75" strokeDasharray="2 2" />
    <line x1="14" y1="4" x2="14" y2="36" strokeWidth="0.75" strokeDasharray="2 2" />
    <line x1="24" y1="4" x2="24" y2="36" strokeWidth="0.75" strokeDasharray="2 2" />
    <polyline points="8,28 14,20 20,24 26,12 32,16" strokeWidth="2" />
  </svg>
)

const LightbulbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 30v2a5 5 0 0010 0v-2" />
    <path d="M20 4a12 12 0 00-7 21.7V30h14v-4.3A12 12 0 0020 4z" />
    <line x1="16" y1="34" x2="24" y2="34" />
    <line x1="20" y1="16" x2="20" y2="24" />
    <line x1="16" y1="20" x2="24" y2="20" />
  </svg>
)

const TeamIcon = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="12" r="5" />
    <circle cx="26" cy="12" r="5" />
    <path d="M4 32c0-6 4-10 10-10 2 0 3.5.5 5 1.5" />
    <path d="M36 32c0-6-4-10-10-10-2 0-3.5.5-5 1.5" />
    <path d="M4 32h32" />
  </svg>
)

interface Service {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  details: string[]
}

const services: Service[] = [
  {
    title: 'Policy, Strategy & Institutional Advisory',
    description: 'For governments, donors, and agencies seeking evidence-based direction.',
    icon: <PolicyIcon />,
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
    icon: <GlobeIcon />,
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
    icon: <AgricultureIcon />,
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
    icon: <FinanceIcon />,
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
    icon: <ResearchIcon />,
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
    icon: <DocumentIcon />,
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
    icon: <MonitoringIcon />,
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
    icon: <LightbulbIcon />,
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
    icon: <TeamIcon />,
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
  service: Service
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
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
      >
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-section flex flex-col">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sage-100 to-eucalyptus-50 flex items-center justify-center text-sage-700 mb-4">
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
      className="relative py-12 md:py-16 lg:py-24 overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
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
