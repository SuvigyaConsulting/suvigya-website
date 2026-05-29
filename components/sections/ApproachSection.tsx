'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

const stages = [
  { number: '01', title: 'Initiate', tagline: 'Define scope, align stakeholders, set governance' },
  { number: '02', title: 'Plan', tagline: 'Structure the workplan, timelines, and milestones' },
  { number: '03', title: 'Execute', tagline: 'Deliver with continuity, one team start to finish' },
  { number: '04', title: 'Monitor', tagline: 'Track progress, manage risk, course-correct early' },
  { number: '05', title: 'Close', tagline: 'Hand over with confidence, document outcomes' },
]

export default function ApproachSection() {
  const { reducedMotion } = useAccessibility()

  const [headerRef, headerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [stepsRef, stepsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section
      id="approach"
      aria-label="How we work"
      className="relative py-12 md:py-16 lg:py-20 overflow-hidden section-warm"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-8 md:mb-12"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
        >
          <motion.span
            className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            How We Work
          </motion.span>
          <h2 className="text-title font-bold mb-4">
            One Partner, <span className="gradient-text">Every Stage</span>
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            We stay with engagements from concept through completion. No handoffs, no gaps.
          </p>
        </motion.div>

        {/* Horizontal step flow on desktop, vertical on mobile */}
        <div ref={stepsRef} className="max-w-5xl mx-auto">
          {/* Desktop: horizontal flow */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-sage-200" />

            {stages.map((stage, index) => (
              <motion.div
                key={stage.number}
                className="relative flex flex-col items-center text-center flex-1 px-2"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { delay: index * 0.12, duration: 0.5, ease: 'easeOut' }
                }
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-500 to-eucalyptus-600 text-white font-bold flex items-center justify-center text-sm mb-4 relative z-10">
                  {stage.number}
                </div>
                <h3 className="text-lg font-bold text-text-heading mb-1">{stage.title}</h3>
                <p className="text-sm text-text-muted leading-snug max-w-[160px]">{stage.tagline}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden">
            {stages.map((stage, index) => {
              const isLast = index === stages.length - 1
              return (
                <motion.div
                  key={stage.number}
                  className="relative flex gap-4"
                  initial={reducedMotion ? false : { opacity: 0, x: -15 }}
                  animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { delay: index * 0.1, duration: 0.5 }
                  }
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-500 to-eucalyptus-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {stage.number}
                    </div>
                    {!isLast && <div className="w-0.5 bg-sage-200 flex-1 min-h-[1.5rem]" />}
                  </div>
                  <div className={isLast ? 'pb-0' : 'pb-6'}>
                    <h3 className="text-lg font-bold text-text-heading">{stage.title}</h3>
                    <p className="text-sm text-text-muted">{stage.tagline}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
