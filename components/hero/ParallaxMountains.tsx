'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Mountain layer SVG paths - gentle rolling hills with natural undulation
const mountainLayers = [
  // Layer 1: Very far distant range (hazy, jagged skyline)
  {
    path: 'M0,100 L0,56 L60,54 L110,48 L150,51 L200,45 L240,50 L300,47 L360,52 L410,46 L470,49 L530,44 L580,50 L640,47 L700,51 L750,45 L810,49 L870,46 L920,50 L960,48 L1000,52 L1000,100 Z',
    color: '#3A6B4A',
    parallaxRate: 0.05,
    opacity: 0.25,
    blur: 2,
  },
  // Layer 2: Far mountain range with distinct peaks
  {
    path: 'M0,100 L0,58 L70,55 L120,42 L160,52 L220,38 L270,50 L340,46 L400,55 L450,40 L500,52 L560,48 L620,36 L670,50 L730,44 L790,54 L850,42 L900,50 L950,46 L1000,52 L1000,100 Z',
    color: '#2D5A3D',
    parallaxRate: 0.1,
    opacity: 0.35,
    blur: 1.5,
  },
  // Layer 3: Mid-range with a dominant peak left-center
  {
    path: 'M0,100 L0,60 L80,54 L140,48 L190,36 L230,28 L270,40 L320,50 L380,44 L440,52 L500,58 L550,50 L610,42 L660,34 L700,44 L760,52 L820,48 L880,54 L940,50 L1000,56 L1000,100 Z',
    color: '#4A7C59',
    parallaxRate: 0.2,
    opacity: 0.5,
    blur: 1,
  },
  // Layer 4: Main range — tallest peak right of center, varied ridgeline
  {
    path: 'M0,100 L0,62 L50,58 L100,52 L160,48 L210,55 L260,50 L310,44 L350,38 L390,46 L440,54 L490,48 L540,36 L580,26 L620,34 L670,46 L720,52 L770,48 L830,54 L880,50 L940,58 L1000,54 L1000,100 Z',
    color: '#5A8C69',
    parallaxRate: 0.35,
    opacity: 0.7,
    blur: 0.5,
  },
  // Layer 5: Nearer foothills — angular but lower
  {
    path: 'M0,100 L0,70 L60,66 L130,60 L190,64 L250,58 L320,62 L380,56 L440,62 L510,68 L570,64 L640,58 L710,62 L770,56 L840,60 L900,66 L960,62 L1000,68 L1000,100 Z',
    color: '#6B9E78',
    parallaxRate: 0.5,
    opacity: 0.85,
    blur: 0,
  },
  // Layer 6: Close hills — softer but still natural
  {
    path: 'M0,100 L0,80 L80,76 L160,72 L240,75 L330,70 L420,74 L500,78 L580,74 L660,70 L740,73 L820,76 L900,72 L960,76 L1000,78 L1000,100 Z',
    color: '#8CB369',
    parallaxRate: 0.65,
    opacity: 0.95,
    blur: 0,
  },
  // Layer 7: Foreground ridge — gentle slope
  {
    path: 'M0,100 L0,88 L100,86 L200,84 L320,86 L450,88 L560,85 L680,84 L800,86 L900,88 L1000,86 L1000,100 Z',
    color: '#A8D5BA',
    parallaxRate: 0.8,
    opacity: 1,
    blur: 0,
  },
]

// Cloud component
function Cloud({ delay, duration, startX, size = 1, top }: { delay: number; duration: number; startX: number; size?: number; top: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ top: `${top}%` }}
      initial={{ x: startX, opacity: 0 }}
      animate={{
        x: [startX, startX + 400],
        opacity: [0, 0.5, 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width={120 * size} height={40 * size} viewBox="0 0 120 40" className="opacity-50">
        <ellipse cx="30" cy="25" rx="25" ry="12" fill="white" />
        <ellipse cx="55" cy="18" rx="32" ry="16" fill="white" />
        <ellipse cx="85" cy="24" rx="25" ry="12" fill="white" />
        <ellipse cx="45" cy="28" rx="20" ry="10" fill="white" />
      </svg>
    </motion.div>
  )
}

// Atmospheric haze between layers
function HazeLayer({ top, opacity }: { top: string; opacity: number }) {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        top,
        height: '15%',
        background: `linear-gradient(to bottom, transparent, rgba(200, 220, 210, ${opacity}), transparent)`,
      }}
    />
  )
}

// Sun/glow component
function SunGlow() {
  return (
    <motion.div
      className="absolute top-[10%] right-[15%] w-40 h-40 md:w-56 md:h-56"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-amber-200/40 via-amber-100/20 to-transparent blur-2xl" />
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-radial from-amber-100/60 to-transparent"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// Mountain layer component with enhanced parallax
function MountainLayer({
  layer,
  scrollYProgress,
  index,
  totalLayers,
}: {
  layer: typeof mountainLayers[0]
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
  totalLayers: number
}) {
  // Stronger parallax: far layers barely move, near layers move a lot
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -200 * layer.parallaxRate]
  )

  // Subtle scale effect: near layers scale slightly more
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1 + layer.parallaxRate * 0.1]
  )

  return (
    <motion.div
      className="absolute inset-0 w-full"
      style={{
        y,
        scale,
        filter: layer.blur > 0 ? `blur(${layer.blur}px)` : 'none',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: layer.opacity }}
      transition={{ duration: 1, delay: index * 0.12, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path d={layer.path} fill={layer.color} />
      </svg>
    </motion.div>
  )
}

interface ParallaxMountainsProps {
  className?: string
}

export default function ParallaxMountains({ className = '' }: ParallaxMountainsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { reducedMotion } = useAccessibility()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-b from-sky-100 to-sage-50 ${className}`} />
    )
  }

  // Static render: show mountains without parallax/animations
  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-mist to-background-page ${className}`}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #7EB8C9 0%, #A2CEDB 15%, #B8D4E3 30%, #D4E5ED 50%, #E4EDE8 70%, #EDF3EE 85%, var(--color-background-page) 100%)' }} />
        <div className="absolute inset-0 bottom-0">
          {mountainLayers.map((layer, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full"
              style={{
                opacity: layer.opacity,
                filter: layer.blur > 0 ? `blur(${layer.blur}px)` : 'none',
              }}
            >
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full">
                <path d={layer.path} fill={layer.color} />
              </svg>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-page to-transparent z-section" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-sky-mist to-background-page ${className}`}
    >
      {/* Sky gradient background - rich multi-stop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #7EB8C9 0%, #A2CEDB 15%, #B8D4E3 30%, #D4E5ED 50%, #E4EDE8 70%, #EDF3EE 85%, var(--color-background-page) 100%)',
        }}
      />

      {/* Sun glow */}
      <SunGlow />

      {/* Animated clouds at different depths */}
      <div className="absolute inset-0 overflow-hidden">
        <Cloud delay={0} duration={80} startX={-200} size={1.4} top={8} />
        <Cloud delay={10} duration={70} startX={-150} size={1} top={14} />
        <Cloud delay={25} duration={90} startX={-180} size={1.2} top={10} />
        <Cloud delay={40} duration={75} startX={-160} size={0.8} top={18} />
        <Cloud delay={55} duration={85} startX={-200} size={1.1} top={6} />
      </div>

      {/* Atmospheric haze for depth */}
      <HazeLayer top="30%" opacity={0.15} />
      <HazeLayer top="50%" opacity={0.1} />

      {/* Mountain layers with parallax */}
      <div className="absolute inset-0 bottom-0">
        {mountainLayers.map((layer, index) => (
          <MountainLayer
            key={index}
            layer={layer}
            scrollYProgress={scrollYProgress}
            index={index}
            totalLayers={mountainLayers.length}
          />
        ))}
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-page to-transparent z-section" />
    </div>
  )
}
