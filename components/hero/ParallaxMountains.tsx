'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Mountain layer SVG paths - gentle rolling hills with natural undulation
const mountainLayers = [
  // Layer 1: Very far distant rolling hills (hazy)
  {
    path: 'M0,100 L0,58 Q70,54 140,52 Q210,48 280,50 Q350,54 420,52 Q490,48 560,50 Q630,54 700,52 Q770,48 840,50 Q910,54 1000,52 L1000,100 Z',
    color: '#3A6B4A',
    parallaxRate: 0.05,
    opacity: 0.25,
    blur: 2,
  },
  // Layer 2: Far rolling hills
  {
    path: 'M0,100 L0,60 Q50,56 100,54 Q160,50 220,48 Q290,52 360,56 Q430,60 500,58 Q570,54 640,50 Q710,48 780,52 Q850,56 920,58 Q960,56 1000,54 L1000,100 Z',
    color: '#2D5A3D',
    parallaxRate: 0.1,
    opacity: 0.35,
    blur: 1.5,
  },
  // Layer 3: Mid-distant gentle hills
  {
    path: 'M0,100 L0,62 Q60,56 120,52 Q180,46 250,44 Q320,48 390,54 Q450,60 520,62 Q580,58 640,52 Q700,46 770,44 Q840,48 910,56 Q960,60 1000,58 L1000,100 Z',
    color: '#4A7C59',
    parallaxRate: 0.2,
    opacity: 0.5,
    blur: 1,
  },
  // Layer 4: Main rolling hills with varied rhythm
  {
    path: 'M0,100 L0,66 Q40,60 80,56 Q130,50 180,46 Q230,44 280,48 Q340,54 400,60 Q450,64 500,62 Q550,58 600,52 Q650,48 700,46 Q750,50 800,56 Q860,62 920,66 Q960,64 1000,62 L1000,100 Z',
    color: '#5A8C69',
    parallaxRate: 0.35,
    opacity: 0.7,
    blur: 0.5,
  },
  // Layer 5: Nearer rolling hills
  {
    path: 'M0,100 L0,72 Q50,66 110,62 Q170,58 230,56 Q300,60 370,66 Q440,72 510,74 Q570,72 630,66 Q690,60 750,58 Q820,62 890,68 Q950,74 1000,72 L1000,100 Z',
    color: '#6B9E78',
    parallaxRate: 0.5,
    opacity: 0.85,
    blur: 0,
  },
  // Layer 6: Close soft hills
  {
    path: 'M0,100 L0,82 Q60,76 130,74 Q200,72 280,76 Q360,80 440,84 Q520,86 600,84 Q680,80 760,76 Q840,74 920,78 Q960,82 1000,80 L1000,100 Z',
    color: '#8CB369',
    parallaxRate: 0.65,
    opacity: 0.95,
    blur: 0,
  },
  // Layer 7: Foreground gentle rise
  {
    path: 'M0,100 L0,90 Q80,86 170,84 Q270,86 370,90 Q470,92 570,90 Q670,86 770,84 Q870,86 940,90 L1000,88 L1000,100 Z',
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

  const smoothY = useSpring(y, { stiffness: 80, damping: 25 })

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
        y: smoothY,
        scale,
        filter: layer.blur > 0 ? `blur(${layer.blur}px)` : 'none',
      }}
      initial={{ opacity: 0, y: 30 + index * 10 }}
      animate={{ opacity: layer.opacity, y: 0 }}
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
