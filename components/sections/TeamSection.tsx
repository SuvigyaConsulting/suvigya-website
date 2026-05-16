'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

const teamMembers = [
  {
    name: 'Saurabh Singh',
    role: 'Managing Director',
    bio: 'Two decades in development consulting. Former advisor to multilateral programmes across South and Central Asia.',
    initials: 'SS',
  },
  {
    name: 'Priya Sharma',
    role: 'Director, Technical Services',
    bio: 'Leads climate, NRM, and biodiversity practices. Has designed frameworks adopted by state and national governments.',
    initials: 'PS',
  },
  {
    name: 'Rajiv Mehta',
    role: 'Director, Operations',
    bio: 'Oversees field implementation across 15+ states. Specialist in programme management and institutional strengthening.',
    initials: 'RM',
  },
]

interface TeamSectionProps {
  /** Hide the in-section header (use when the host page already provides a hero/title) */
  hideHeader?: boolean
}

export default function TeamSection({ hideHeader = false }: TeamSectionProps = {}) {
  const { reducedMotion } = useAccessibility()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section
      id="team"
      aria-label="Leadership team"
      className="relative py-8 md:py-12 lg:py-16 overflow-hidden"
      style={{ backgroundColor: '#FAF8F5' }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header — suppressed when host route owns the title */}
        {!hideHeader && (
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
          >
            <motion.span
              className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={reducedMotion ? {} : { opacity: 1 }}
              viewport={{ once: true }}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
            >
              Leadership
            </motion.span>
            <h2 className="text-title font-bold mb-6">
              <span className="gradient-text">The People Behind the Work</span>
            </h2>
            <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
              A senior team with decades of combined experience across development consulting, public policy, and field operations.
            </p>
          </motion.div>
        )}

        {/* Team Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="glass p-6 flex items-start gap-4"
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              animate={
                reducedMotion
                  ? {}
                  : inView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 30 }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.2 + index * 0.15 }
              }
            >
              {/* Avatar */}
              <div
                className="flex-shrink-0 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-sage-500 to-eucalyptus-600 flex items-center justify-center"
              >
                <span className="text-xl font-bold text-white">{member.initials}</span>
              </div>

              {/* Text Content */}
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-text-heading">{member.name}</h3>
                <p className="text-sm text-eucalyptus-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-text-muted leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
