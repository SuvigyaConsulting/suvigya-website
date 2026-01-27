'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Mountain layer SVG paths - organic, flowing silhouettes
const mountainLayers = [
  // Layer 1: Far distant mountains (subtle, misty)
  {
    path: 'M0,100 L0,70 Q50,50 100,65 Q150,45 200,55 Q250,35 300,50 Q350,40 400,45 Q450,30 500,40 Q550,25 600,35 Q650,45 700,40 Q750,55 800,50 Q850,40 900,55 Q950,45 1000,60 L1000,100 Z',
    color: '#2D5A3D',
    parallaxRate: 0.1,
    opacity: 0.4,
  },
  // Layer 2: Mid-distant mountains
  {
    path: 'M0,100 L0,75 Q40,55 80,60 Q120,45 160,55 Q200,40 240,50 Q280,35 320,45 Q360,50 400,40 Q440,30 480,45 Q520,55 560,45 Q600,35 640,50 Q680,60 720,50 Q760,40 800,55 Q840,45 880,60 Q920,50 960,65 L1000,55 L1000,100 Z',
    color: '#4A7C59',
    parallaxRate: 0.25,
    opacity: 0.6,
  },
  // Layer 3: Mid mountains (main visual)
  {
    path: 'M0,100 L0,70 Q30,50 60,55 Q90,40 120,50 Q150,35 180,45 Q210,55 240,45 Q270,30 300,40 Q330,50 360,42 Q390,35 420,48 Q450,60 480,50 Q510,40 540,52 Q570,62 600,55 Q630,45 660,58 Q690,70 720,60 Q750,50 780,62 Q810,75 840,65 Q870,55 900,68 Q930,58 960,70 L1000,65 L1000,100 Z',
    color: '#5A8C69',
    parallaxRate: 0.4,
    opacity: 0.8,
  },
  // Layer 4: Near mountains
  {
    path: 'M0,100 L0,80 Q25,60 50,65 Q75,55 100,62 Q125,50 150,58 Q175,65 200,55 Q225,45 250,55 Q275,65 300,58 Q325,50 350,60 Q375,70 400,62 Q425,52 450,65 Q475,75 500,68 Q525,58 550,70 Q575,80 600,72 Q625,62 650,75 Q675,85 700,78 Q725,68 750,80 Q775,90 800,82 Q825,72 850,85 Q875,78 900,88 Q925,80 950,90 L1000,85 L1000,100 Z',
    color: '#8CB369',
    parallaxRate: 0.55,
    opacity: 0.9,
  },
  // Layer 5: Foreground hills
  {
    path: 'M0,100 L0,88 Q20,78 40,82 Q60,75 80,80 Q100,72 120,78 Q140,85 160,80 Q180,74 200,82 Q220,88 240,84 Q260,78 280,85 Q300,92 320,88 Q340,82 360,90 Q380,96 400,92 Q420,86 440,94 Q460,100 480,96 Q500,90 520,98 Q540,94 560,100 Q580,96 600,100 Q620,95 640,100 Q660,96 680,100 Q700,94 720,100 Q740,96 760,100 Q780,95 800,100 Q820,96 840,100 Q860,94 880,100 Q900,96 920,100 Q940,94 960,100 Q980,96 1000,100 L1000,100 Z',
    color: '#A8D5BA',
    parallaxRate: 0.7,
    opacity: 1,
  },
]

// Cloud component
function Cloud({ delay, duration, startX }: { delay: number; duration: number; startX: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ top: `${15 + Math.random() * 20}%` }}
      initial={{ x: startX, opacity: 0 }}
      animate={{
        x: [startX, startX + 200],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width="120" height="40" viewBox="0 0 120 40" className="opacity-60">
        <ellipse cx="30" cy="25" rx="25" ry="12" fill="white" />
        <ellipse cx="55" cy="20" rx="30" ry="15" fill="white" />
        <ellipse cx="85" cy="25" rx="25" ry="12" fill="white" />
      </svg>
    </motion.div>
  )
}

// Sun/glow component
function SunGlow() {
  return (
    <motion.div
      className="absolute top-[15%] right-[20%] w-32 h-32 md:w-48 md:h-48"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      <div className="w-full h-full rounded-full bg-gradient-radial from-amber-200/40 via-amber-100/20 to-transparent blur-xl" />
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-radial from-amber-100/60 to-transparent"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// Mountain layer component
function MountainLayer({
  layer,
  scrollYProgress,
  index,
}: {
  layer: typeof mountainLayers[0]
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress']
  index: number
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -100 * layer.parallaxRate]
  )

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="absolute inset-0 w-full"
      style={{ y: smoothY }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: layer.opacity, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ filter: index < 2 ? 'blur(1px)' : 'none' }}
      >
        <motion.path
          d={layer.path}
          fill={layer.color}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: index * 0.1 }}
        />
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

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-[#B8D4E3] to-[#F4F7F5] ${className}`}
    >
      {/* Sky gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#B8D4E3] via-[#D4E5ED] to-[#F4F7F5]" />

      {/* Sun glow */}
      <SunGlow />

      {/* Animated clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <Cloud delay={0} duration={60} startX={-150} />
        <Cloud delay={15} duration={55} startX={-120} />
        <Cloud delay={30} duration={65} startX={-180} />
      </div>

      {/* Mountain layers with parallax */}
      <div className="absolute inset-0 bottom-0">
        {mountainLayers.map((layer, index) => (
          <MountainLayer
            key={index}
            layer={layer}
            scrollYProgress={scrollYProgress}
            index={index}
          />
        ))}
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-page to-transparent z-10" />
    </div>
  )
}
