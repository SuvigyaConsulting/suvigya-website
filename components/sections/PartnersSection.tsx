'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

const partners = [
  { name: 'The World Bank', logo: '/logos/world-bank.svg', height: 40 },
  { name: 'ADB', logo: '/logos/adb.svg', height: 44 },
  { name: 'FAO', logo: '/logos/fao.svg', height: 52 },
  { name: 'KFW', logo: '/logos/kfw.svg', height: 36 },
  { name: 'GIZ', logo: '/logos/giz.svg', height: 40 },
  { name: 'NABARD', logo: '/logos/nabard.png', height: 52 },
  { name: 'Government of Meghalaya', logo: '/logos/meghalaya.png', height: 48 },
  { name: 'Karnataka Forest Department', logo: '/logos/karnataka-forest.png', height: 48 },
]

export default function PartnersSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const { reducedMotion } = useAccessibility()

  return (
    <section aria-label="Our partners" className="relative py-8 md:py-12 lg:py-16 overflow-hidden section-cream">
      {/* Tessellation decoration - right side, matching brochure style */}
      <div
        className="absolute top-0 right-0 h-full w-64 md:w-80 lg:w-96 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: 'url(/tessellation.svg)',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'right center',
          backgroundSize: 'contain',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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
            Trusted By
          </motion.span>
          <h2 className="text-title font-bold mb-6">
            Our <span className="gradient-text">Clients</span>
          </h2>
          {/* Teal accent line - from brochure design language */}
          <div className="mx-auto w-16 h-0.5 bg-[#0d9488] mb-6" />
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Collaborating with leading development organizations to create lasting change
          </p>
        </motion.div>

        {/* Partner Logos Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center max-w-5xl mx-auto"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              className="flex items-center justify-center w-full px-4 py-3"
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.3 + index * 0.08, duration: 0.5 }}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                style={{ height: partner.height }}
                className="max-w-full object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
