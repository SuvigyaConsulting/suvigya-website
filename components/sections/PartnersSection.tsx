'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// SVG Logo Components for each partner
function UNLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Globe with map projection */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="28" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="32" cy="32" rx="12" ry="28" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="4" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="1.5" />
      {/* Olive branches */}
      <path d="M8 48 Q12 44 16 48 Q12 52 8 48" fill="currentColor" opacity="0.8" />
      <path d="M12 52 Q16 48 20 52 Q16 56 12 52" fill="currentColor" opacity="0.8" />
      <path d="M56 48 Q52 44 48 48 Q52 52 56 48" fill="currentColor" opacity="0.8" />
      <path d="M52 52 Q48 48 44 52 Q48 56 52 52" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

function WorldBankLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Stylized globe */}
      <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M32 6 Q48 20 48 32 Q48 44 32 58 Q16 44 16 32 Q16 20 32 6" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="26" ry="10" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Grid lines */}
      <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function ADBLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Stylized A shape with globe */}
      <path d="M32 8 L52 56 L44 56 L40 44 L24 44 L20 56 L12 56 L32 8 Z M32 20 L26 40 L38 40 L32 20 Z" fill="currentColor" />
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function KfWLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* KfW text-based logo */}
      <text x="8" y="42" fontSize="24" fontWeight="bold" fill="currentColor">KfW</text>
      <rect x="8" y="46" width="48" height="3" fill="currentColor" />
    </svg>
  )
}

function EULogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Circle of 12 stars */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x = 32 + 22 * Math.cos(angle)
        const y = 32 + 22 * Math.sin(angle)
        return (
          <polygon
            key={i}
            points={`${x},${y - 4} ${x + 1.5},${y - 1} ${x + 4},${y - 1} ${x + 2},${y + 1} ${x + 3},${y + 4} ${x},${y + 2} ${x - 3},${y + 4} ${x - 2},${y + 1} ${x - 4},${y - 1} ${x - 1.5},${y - 1}`}
            fill="currentColor"
          />
        )
      })}
    </svg>
  )
}

function USAIDLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Handshake symbol */}
      <path d="M16 32 Q20 24 28 28 L36 28 Q44 24 48 32 L44 36 Q40 32 36 34 L28 34 Q24 32 20 36 Z" fill="currentColor" />
      {/* Stars */}
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <circle cx="32" cy="16" r="3" fill="currentColor" />
      <circle cx="44" cy="20" r="3" fill="currentColor" />
      {/* Stripes */}
      <rect x="20" y="42" width="24" height="3" fill="currentColor" />
      <rect x="20" y="48" width="24" height="3" fill="currentColor" />
    </svg>
  )
}

function GIZLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* GIZ stylized text */}
      <text x="10" y="42" fontSize="22" fontWeight="bold" fill="currentColor">GIZ</text>
      {/* Decorative element */}
      <circle cx="52" cy="20" r="6" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

function JICALogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor">
      {/* Globe with arrow */}
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" strokeWidth="2" />
      {/* Arrow pointing up */}
      <path d="M24 20 L32 10 L40 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Map partner names to logo components
const logoComponents: { [key: string]: React.FC<{ className?: string }> } = {
  'UN': UNLogo,
  'World Bank': WorldBankLogo,
  'ADB': ADBLogo,
  'KFW': KfWLogo,
  'EU': EULogo,
  'USAID': USAIDLogo,
  'GIZ': GIZLogo,
  'JICA': JICALogo,
}

const partners = [
  { name: 'KFW', fullName: 'KfW Development Bank', projects: 12 },
  { name: 'UN', fullName: 'United Nations', projects: 18 },
  { name: 'ADB', fullName: 'Asian Development Bank', projects: 15 },
  { name: 'World Bank', fullName: 'World Bank Group', projects: 22 },
  { name: 'EU', fullName: 'European Union', projects: 8 },
  { name: 'USAID', fullName: 'U.S. Agency for International Development', projects: 10 },
  { name: 'GIZ', fullName: 'Deutsche Gesellschaft für Internationale Zusammenarbeit', projects: 6 },
  { name: 'JICA', fullName: 'Japan International Cooperation Agency', projects: 5 },
]

// Draggable marquee row component
function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clear resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }
    }
  }, [])

  // Double the partners for seamless loop
  const items = [...partners, ...partners]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setIsPaused(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // Resume animation after a delay
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2000)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      resumeTimerRef.current = setTimeout(() => setIsPaused(false), 2000)
    }
  }

  return (
    <div className="relative overflow-hidden py-4">
      <div
        ref={containerRef}
        className={`flex gap-8 overflow-x-auto scrollbar-hide ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className={`flex gap-8 ${isPaused ? '' : reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
          style={{ width: 'fit-content' }}
        >
          {items.map((partner, index) => {
            const LogoComponent = logoComponents[partner.name]
            return (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 group select-none"
              >
                <div className="glass px-6 py-5 md:px-8 md:py-6 rounded-panel flex items-center gap-4 md:gap-6 hover:bg-sage-50/50 transition-all duration-300 cursor-grab min-w-[260px] md:min-w-[300px]">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center text-sage-700 group-hover:scale-110 transition-transform p-2">
                    {LogoComponent && <LogoComponent className="w-full h-full" />}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-text-heading group-hover:text-sage-600 transition-colors">
                      {partner.name}
                    </h4>
                    <p className="text-xs text-text-muted truncate max-w-[160px]">{partner.fullName}</p>
                    <p className="text-sm text-sage-600 font-medium mt-1">{partner.projects} projects</p>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    className="w-2 h-2 rounded-full bg-sage-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ willChange: 'transform' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Gradient edges for visual fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background-cream to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background-cream to-transparent pointer-events-none" />
    </div>
  )
}

export default function PartnersSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden section-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-8 md:mb-12"
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
            Trusted Globally
          </motion.span>
          <h2 className="text-title font-bold mb-6">
            Our <span className="gradient-text">Partners</span>
          </h2>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Collaborating with the world&apos;s leading development organizations
            to create lasting change
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee with drag support */}
      <div className="space-y-4">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>

      {/* Stats summary */}
      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold gradient-text">8+</div>
            <div className="text-text-muted text-sm">Global Partners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold gradient-text">96+</div>
            <div className="text-text-muted text-sm">Joint Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold gradient-text">15+</div>
            <div className="text-text-muted text-sm">Years Partnership</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
