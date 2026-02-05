'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

const projects = [
  {
    id: 1,
    title: 'Afghanistan Emergency Food Security Project',
    client: 'World Bank / FAO',
    region: 'Afghanistan',
    description: 'Economic and financial analysis, PIM development, PAD preparation for irrigation, agribusiness, and food security interventions across conflict-affected regions.',
    impact: { value: '$415M', label: 'Project value supported' },
    year: '2024',
    tags: ['Economic Analysis', 'PIM Development', 'PAD Preparation'],
    image: '/projects/food-security.jpg',
    color: 'sky',
    icon: 'wheat',
  },
  {
    id: 2,
    title: 'Kerala Climate Resilient Agri-Value Chain (KERA)',
    client: 'World Bank',
    region: 'Kerala, India',
    description: 'End-to-end project design, costing, and PIM preparation for climate-resilient value chains across rubber, coffee, and cardamom, including economic and financial analysis.',
    impact: { value: '$285M', label: 'Project value supported' },
    year: '2024',
    tags: ['Project Design', 'Value Chains', 'Climate Resilience'],
    image: '/projects/agri-value.jpg',
    color: 'sage',
    icon: 'leaf',
  },
  {
    id: 3,
    title: 'ELEMENT Project: Nagaland & Tripura',
    client: 'World Bank',
    region: 'North East India',
    description: 'Project design, investment planning, and operations manual for NTFP value chains, eco-tourism, and private sector frameworks in biodiversity-rich landscapes.',
    impact: { value: '$242M', label: 'Project value supported' },
    year: '2023',
    tags: ['NTFP Value Chains', 'Eco-Tourism', 'Private Sector'],
    image: '/projects/element.jpg',
    color: 'eucalyptus',
    icon: 'tree',
  },
  {
    id: 4,
    title: 'GCF Regional Programme: Hindu Kush Himalayan Region',
    client: 'GCF',
    region: '8 Countries',
    description: 'Blended finance facility concept benefiting 72 million people across the Hindu Kush Himalayan region, structuring climate finance at a transboundary scale.',
    impact: { value: '72M', label: 'People across 8 countries' },
    year: '2024',
    tags: ['Climate Finance', 'Blended Finance', 'Regional'],
    image: '/projects/gcf-hkh.jpg',
    color: 'sky',
    icon: 'mountain',
  },
  {
    id: 5,
    title: 'Community-Based Forest Management & Livelihoods',
    client: 'JICA',
    region: 'Meghalaya, India',
    description: 'DPR and investment planning for community forestry and livelihood systems, integrating forest conservation with income generation for indigenous communities.',
    impact: { value: '$124M', label: 'Project value supported' },
    year: '2023',
    tags: ['Forestry', 'Livelihoods', 'DPR Preparation'],
    image: '/projects/jica-forest.jpg',
    color: 'sage',
    icon: 'globe',
  },
  {
    id: 6,
    title: 'CONSERVE Biodiversity Project',
    client: 'GEF-GBFF / UNDP',
    region: 'India',
    description: 'ProDoc development, CEO Endorsement, Theory of Change, Results Framework, MEL, and co-financing for a multi-state biodiversity implementation design.',
    impact: { value: '$12.3M', label: 'GEF grant mobilized' },
    year: '2024',
    tags: ['Biodiversity', 'ProDoc', 'Results Framework'],
    image: '/projects/conserve.jpg',
    color: 'eucalyptus',
    icon: 'shield',
  },
  {
    id: 7,
    title: 'Umbrella Programme for Natural Resource Management',
    client: 'GIZ / KfW / NABARD',
    region: 'India',
    description: 'Appraisal, monitoring, and evaluation of 50+ community-led NRM projects. Mid-term reviews and performance assessments across multiple states.',
    impact: { value: '50+', label: 'Community NRM projects evaluated' },
    year: '2023',
    tags: ['M&E', 'NRM', 'Third-Party Monitoring'],
    image: '/projects/umbrella-nrm.jpg',
    color: 'amber',
    icon: 'chart',
  },
  {
    id: 8,
    title: 'Blue Economy: Plastic Waste Management',
    client: 'GoK / World Bank',
    region: 'Coastal Karnataka, India',
    description: 'Concept note and investment framework for plastic waste management and blue economy transformation along the Karnataka coastline.',
    impact: { value: '$60M', label: 'Investment framework designed' },
    year: '2024',
    tags: ['Blue Economy', 'Waste Management', 'Investment Design'],
    image: '/projects/blue-economy.jpg',
    color: 'sky',
    icon: 'water',
  },
]

// Project card component
function ProjectCard({
  project,
  isActive,
  direction,
  reducedMotion = false,
}: {
  project: typeof projects[0]
  isActive: boolean
  direction: number
  reducedMotion?: boolean
}) {
  const colorClasses = {
    sky: 'from-sky-400/20 to-sky-600/10 border-sky-400/30',
    eucalyptus: 'from-eucalyptus-400/20 to-eucalyptus-600/10 border-eucalyptus-400/30',
    amber: 'from-amber-400/20 to-amber-600/10 border-amber-400/30',
    sage: 'from-sage-400/20 to-sage-600/10 border-sage-400/30',
  }

  const accentClasses = {
    sky: 'bg-sky-500',
    eucalyptus: 'bg-eucalyptus-500',
    amber: 'bg-amber-500',
    sage: 'bg-sage-500',
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 md:px-6"
      initial={reducedMotion ? false : { opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -300 : 300, scale: 0.9 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div
          className={`glass rounded-panel p-5 md:p-6 lg:p-8 bg-gradient-to-br ${
            colorClasses[project.color as keyof typeof colorClasses]
          } border`}
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Client & Year */}
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    accentClasses[project.color as keyof typeof accentClasses]
                  }`}
                >
                  {project.client}
                </span>
              </div>

              {/* Title */}
              <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-heading mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.title}
              </motion.h3>

              {/* Region */}
              <motion.p
                className="text-sage-600 font-medium mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {project.region}
              </motion.p>

              {/* Description */}
              <motion.p
                className="text-text-body leading-relaxed mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {project.description}
              </motion.p>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 glass rounded-full text-sm text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Impact visualization */}
            <motion.div
              className="relative flex flex-col items-center justify-center text-center w-full h-[180px] md:h-[220px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {/* Spinning background icon - fills the container */}
              {!reducedMotion && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {project.icon === 'wheat' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="8 4" />
                          <path d="M60 15 Q75 40 60 60 Q45 40 60 15" strokeWidth="1.5" />
                          <path d="M40 25 Q60 45 60 60" strokeWidth="1.5" />
                          <path d="M80 25 Q60 45 60 60" strokeWidth="1.5" />
                          <path d="M60 60 L60 105" strokeWidth="1.5" />
                        </>
                      )}
                      {project.icon === 'leaf' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="6 6" />
                          <path d="M30 80 Q30 30 80 20 Q70 70 30 80 Z" strokeWidth="1.5" />
                          <path d="M30 80 Q55 50 80 20" strokeWidth="1" />
                        </>
                      )}
                      {project.icon === 'tree' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="4 8" />
                          <path d="M60 20 L40 50 L50 50 L35 75 L50 75 L45 95 L75 95 L70 75 L85 75 L70 50 L80 50 Z" strokeWidth="1.5" />
                        </>
                      )}
                      {project.icon === 'mountain' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="10 5" />
                          <path d="M15 90 L45 35 L55 55 L75 25 L105 90 Z" strokeWidth="1.5" />
                        </>
                      )}
                      {project.icon === 'globe' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="6 4" />
                          <circle cx="60" cy="60" r="35" strokeWidth="1.5" />
                          <ellipse cx="60" cy="60" rx="15" ry="35" strokeWidth="1" />
                          <line x1="25" y1="60" x2="95" y2="60" strokeWidth="1" />
                          <line x1="60" y1="25" x2="60" y2="95" strokeWidth="1" />
                        </>
                      )}
                      {project.icon === 'water' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="3 6" />
                          <path d="M60 20 Q80 50 60 75 Q40 50 60 20 Z" strokeWidth="1.5" />
                          <path d="M20 85 Q40 75 60 85 Q80 95 100 85" strokeWidth="1.5" />
                          <path d="M20 95 Q40 85 60 95 Q80 105 100 95" strokeWidth="1" />
                        </>
                      )}
                      {project.icon === 'chart' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="8 6" />
                          <rect x="25" y="70" width="15" height="25" strokeWidth="1.5" />
                          <rect x="45" y="50" width="15" height="45" strokeWidth="1.5" />
                          <rect x="65" y="35" width="15" height="60" strokeWidth="1.5" />
                          <rect x="85" y="55" width="15" height="40" strokeWidth="1.5" />
                        </>
                      )}
                      {project.icon === 'shield' && (
                        <>
                          <circle cx="60" cy="60" r="55" strokeDasharray="5 5" />
                          <path d="M60 15 L90 35 L90 65 Q90 95 60 105 Q30 95 30 65 L30 35 Z" strokeWidth="1.5" />
                          <path d="M48 60 L56 68 L74 50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </>
                      )}
                    </svg>
                </motion.div>
              )}

              {/* Number + label centered on top */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div
                  className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                >
                  {project.impact.value}
                </motion.div>

                <motion.p
                  className="text-lg text-text-muted max-w-[200px] mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {project.impact.label}
                </motion.p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const { reducedMotion } = useAccessibility()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  // Auto-advance carousel
  useEffect(() => {
    if (!autoPlay || !inView) return

    const interval = setInterval(() => {
      setDirection(1)
      setActiveIndex((prev) => (prev + 1) % projects.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlay, inView])

  const goToProject = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setAutoPlay(false) // Stop auto-play on manual navigation
  }

  const nextProject = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % projects.length)
    setAutoPlay(false)
  }

  const prevProject = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
    setAutoPlay(false)
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Projects"
      className="relative py-8 md:py-12 lg:py-16 overflow-hidden"
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-0 section-dark"
        style={{ opacity: backgroundOpacity }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-section">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-6 md:mb-8"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <motion.span
            className="text-eucalyptus-400 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            Case Studies
          </motion.span>
          <h2 className="text-title font-bold mb-6 text-text-light">
            Stories of <span className="gradient-text-light">Transformation</span>
          </h2>
          <p className="text-subtitle text-text-light/80 max-w-2xl mx-auto leading-relaxed">
            Discover how we&apos;re creating lasting impact through strategic partnerships
          </p>
        </motion.div>

        {/* Project Counter */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <span className="text-3xl md:text-4xl font-bold gradient-text-light">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-text-light/40 text-2xl">/</span>
          <span className="text-text-light/60 text-2xl">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Carousel */}
        <div className="relative h-[380px] md:h-[380px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <ProjectCard
              key={projects[activeIndex].id}
              project={projects[activeIndex]}
              isActive={true}
              direction={direction}
              reducedMotion={reducedMotion}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-6 mt-4">
          {/* Previous button */}
          <motion.button
            onClick={prevProject}
            className="p-3 glass-dark rounded-full text-text-light hover:bg-sage-500/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Dots */}
          <div className="flex gap-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`Go to project ${index + 1}`}
              >
                <span className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-eucalyptus-400 scale-125'
                    : 'bg-text-light/30 hover:bg-text-light/50'
                }`} />
              </button>
            ))}
          </div>

          {/* Next button */}
          <motion.button
            onClick={nextProject}
            className="p-3 glass-dark rounded-full text-text-light hover:bg-sage-500/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next project"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

      </div>
    </section>
  )
}
