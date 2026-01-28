'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const projects = [
  {
    id: 1,
    title: 'Water Resources Management',
    client: 'Asian Development Bank',
    region: 'Southeast Asia',
    description: 'Comprehensive water resources assessment and management strategy covering 12 river basins across 5 countries. Implemented real-time monitoring systems and community-based water management protocols.',
    impact: { value: '2M+', label: 'People with improved water access' },
    year: '2023',
    tags: ['GIS Analysis', 'Water Management', 'Policy Development'],
    image: '/projects/water.jpg', // Placeholder - would be actual image
    color: 'sky',
  },
  {
    id: 2,
    title: 'Forest Conservation Initiative',
    client: 'United Nations',
    region: 'Amazon Basin',
    description: 'Biodiversity mapping and conservation framework for tropical forest ecosystems using advanced satellite imagery and community engagement programs.',
    impact: { value: '500K', label: 'Hectares of forest protected' },
    year: '2022',
    tags: ['Conservation', 'Remote Sensing', 'Community Engagement'],
    image: '/projects/forest.jpg',
    color: 'eucalyptus',
  },
  {
    id: 3,
    title: 'Climate Adaptation Program',
    client: 'KfW Development Bank',
    region: 'Sub-Saharan Africa',
    description: 'Climate resilience planning and adaptation strategies for vulnerable communities, including drought-resistant agriculture and flood mitigation infrastructure.',
    impact: { value: '50+', label: 'Communities with enhanced resilience' },
    year: '2023',
    tags: ['Climate Action', 'Grassroots', 'Infrastructure'],
    image: '/projects/climate.jpg',
    color: 'amber',
  },
  {
    id: 4,
    title: 'Sustainable Agriculture',
    client: 'World Bank',
    region: 'South Asia',
    description: 'Agricultural land use optimization and sustainable farming practices implementation across 10,000 farming households using precision agriculture techniques.',
    impact: { value: '30%', label: 'Increase in crop yields' },
    year: '2022',
    tags: ['Agriculture', 'GIS', 'Sustainability'],
    image: '/projects/agriculture.jpg',
    color: 'sage',
  },
]

// Project card component
function ProjectCard({
  project,
  isActive,
  direction,
}: {
  project: typeof projects[0]
  isActive: boolean
  direction: number
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
      initial={{ opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction > 0 ? -300 : 300, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div
          className={`glass rounded-panel p-5 md:p-8 lg:p-12 bg-gradient-to-br ${
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
                <span className="text-text-muted text-sm">{project.year}</span>
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
              className="flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {/* Large impact number */}
              <div className="relative mb-4">
                <motion.div
                  className="text-5xl md:text-7xl lg:text-9xl font-bold gradient-text"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                >
                  {project.impact.value}
                </motion.div>

                {/* Decorative ring */}
                <motion.div
                  className={`absolute inset-0 -m-8 rounded-full border-4 border-dashed opacity-20 ${
                    accentClasses[project.color as keyof typeof accentClasses].replace('bg-', 'border-')
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Impact label */}
              <motion.p
                className="text-lg text-text-muted max-w-[200px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {project.impact.label}
              </motion.p>
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
      className="relative min-h-screen py-16 md:py-24 lg:py-32 overflow-hidden"
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
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-eucalyptus-400 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
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
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className="text-4xl md:text-6xl font-bold gradient-text-light">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-text-light/40 text-2xl">/</span>
          <span className="text-text-light/60 text-2xl">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Carousel */}
        <div className="relative h-[420px] md:h-[450px]">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <ProjectCard
              key={projects[activeIndex].id}
              project={projects[activeIndex]}
              isActive={true}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-6 mt-8">
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

        {/* Progress bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="h-1 bg-text-light/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sage-400 to-eucalyptus-400"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
