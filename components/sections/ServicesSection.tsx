'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'

const services = [
  {
    title: 'Forestry, Biodiversity & Landscape Management',
    description: 'Restoration, conservation, and sustainable ecosystem management strategies.',
    icon: '🌳',
    gradient: 'from-sage-500 to-eucalyptus-400',
    details: [
      'Integrated landscape & watershed management',
      'Sustainable forestry & agroforestry (REDD+)',
      'Biodiversity conservation & eco-tourism',
      'Payment for ecosystem services (PES)',
    ],
  },
  {
    title: 'Agribusiness & Value Chain Development',
    description: 'Strengthening market linkages and value addition for agricultural products.',
    icon: '🌾',
    gradient: 'from-amber-400 to-sage-400',
    details: [
      'Value chain strengthening for crops & NTFPs',
      'Farmer-industry productive alliances',
      'Organic certification & branding support',
      'Market access strategies for regional products',
    ],
  },
  {
    title: 'Rural Development & Livelihoods',
    description: 'Community-driven enterprise promotion and skill development.',
    icon: '🤝',
    gradient: 'from-eucalyptus-400 to-mint-400',
    details: [
      'MSME development & rural enterprises',
      'Skill development & employment generation',
      'Strengthening SHGs & cooperatives',
      'Community-based development models',
    ],
  },
  {
    title: 'Climate Adaptation & Natural Resource Management',
    description: 'Climate-smart interventions and sustainable land and water management.',
    icon: '🌍',
    gradient: 'from-sky-400 to-sage-400',
    details: [
      'Watershed & catchment management',
      'Climate-resilient agriculture & agroforestry',
      'Disaster risk reduction & early warning systems',
      'Carbon sequestration & sustainable financing',
    ],
  },
  {
    title: 'Infrastructure & Investment Mobilization',
    description: 'Sustainable infrastructure planning and private sector engagement.',
    icon: '🏗️',
    gradient: 'from-sage-500 to-sky-400',
    details: [
      'Climate-resilient infrastructure development',
      'Public-private partnerships (PPP)',
      'Blended finance & fund mobilization',
      'Smart villages & green infrastructure',
    ],
  },
  {
    title: 'Monitoring, Evaluation & Learning',
    description: 'Result-based frameworks for program evaluation and continuous improvement.',
    icon: '📊',
    gradient: 'from-mint-400 to-sage-500',
    details: [
      'M&E frameworks with digital tracking',
      'Baseline studies & impact assessments',
      'Third-party evaluations & audits',
      'Knowledge management & learning dissemination',
    ],
  },
  {
    title: 'Capacity Building & Governance',
    description: 'Institutional strengthening and participatory governance models.',
    icon: '🏛️',
    gradient: 'from-sage-500 to-eucalyptus-400',
    details: [
      'Training for government & implementing agencies',
      'SOPs & governance frameworks',
      'Participatory planning & decentralized governance',
      'Regulatory & compliance advisory',
    ],
  },
  {
    title: 'Digital Transformation & GIS',
    description: 'Data-driven decision making through geospatial analytics and digital solutions.',
    icon: '🗺️',
    gradient: 'from-sky-400 to-mint-400',
    details: [
      'GIS & remote sensing for planning',
      'E-governance & digital rural solutions',
      'Decision support systems (DSS)',
      'Real-time analytics for policy & projects',
    ],
  },
  {
    title: 'Research, Documentation & Strategy',
    description: 'Technical writing, market research, and stakeholder engagement.',
    icon: '📋',
    gradient: 'from-amber-400 to-eucalyptus-400',
    details: [
      'Technical reports, DPRs & policy briefs',
      'Grant & proposal writing (GCF, GEF, World Bank)',
      'Feasibility studies & business planning',
      'Stakeholder engagement & communication strategy',
    ],
  },
]

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <motion.div
        className="h-full glass rounded-panel p-6 md:p-8 cursor-pointer overflow-hidden relative group"
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Gradient background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col">
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
            Comprehensive consulting across development sectors,
            from policy and governance to community impact
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
