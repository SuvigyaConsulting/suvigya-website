'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Floating particle/seed element
function Particle({
  delay,
  duration,
  size,
  startX,
  startY,
  color,
}: {
  delay: number
  duration: number
  size: number
  startX: number
  startY: number
  color: string
}) {
  const drift = useMemo(() => (Math.random() - 0.5) * 100, [])

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        bottom: `${startY}%`,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        y: [0, -300, -500],
        x: [0, drift * 0.5, drift],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

// Floating leaf element
function Leaf({
  delay,
  duration,
  startX,
}: {
  delay: number
  duration: number
  startX: number
}) {
  const drift = useMemo(() => (Math.random() - 0.5) * 150, [])
  const rotation = useMemo(() => Math.random() * 360, [])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        bottom: '10%',
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, y: 0, x: 0, rotate: rotation }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        y: [0, -200, -400],
        x: [0, drift * 0.3, drift],
        rotate: [rotation, rotation + 180, rotation + 360],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <svg width="12" height="16" viewBox="0 0 12 16" className="text-eucalyptus-400">
        <path
          d="M6 0 Q12 4 10 10 Q8 16 6 16 Q4 16 2 10 Q0 4 6 0"
          fill="currentColor"
          opacity={0.7}
        />
      </svg>
    </motion.div>
  )
}

// Enhanced flapping bird with wing animation
function FlappingBird({
  delay,
  duration,
  startY,
  size = 1,
  direction = 1, // 1 = left to right, -1 = right to left
}: {
  delay: number
  duration: number
  startY: number
  size?: number
  direction?: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: `${startY}%`,
        left: direction === 1 ? '-5%' : 'auto',
        right: direction === -1 ? '-5%' : 'auto',
        transform: `scale(${size}) scaleX(${direction})`,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.6, 0.6, 0],
        x: direction === 1 ? ['0vw', '50vw', '105vw'] : ['0vw', '-50vw', '-105vw'],
        y: [0, -20, 0, 15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg width="24" height="12" viewBox="0 0 24 12" className="text-forest-800/60">
        <motion.path
          d="M0 6 Q6 0 12 6 Q18 0 24 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            d: [
              "M0 6 Q6 0 12 6 Q18 0 24 6",
              "M0 6 Q6 10 12 6 Q18 10 24 6",
              "M0 6 Q6 0 12 6 Q18 0 24 6",
            ],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </motion.div>
  )
}

// Bird flock (V-formation)
function BirdFlock({
  delay,
  startY,
  direction = 1,
}: {
  delay: number
  startY: number
  direction?: number
}) {
  // Create 4-5 birds in loose V formation
  const birds = [
    { offsetX: 0, offsetY: 0, size: 1 },      // Leader
    { offsetX: -25, offsetY: 15, size: 0.85 }, // Left wing
    { offsetX: 25, offsetY: 15, size: 0.85 },  // Right wing
    { offsetX: -45, offsetY: 28, size: 0.7 },  // Far left
    { offsetX: 45, offsetY: 28, size: 0.7 },   // Far right
  ]

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: `${startY}%`,
        left: direction === 1 ? '-5%' : 'auto',
        right: direction === -1 ? '-5%' : 'auto',
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0 }}
      animate={{
        x: direction === 1 ? ['0vw', '55vw', '110vw'] : ['0vw', '-55vw', '-110vw'],
        opacity: [0, 0.6, 0.6, 0],
      }}
      transition={{
        duration: 25,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {birds.map((bird, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: bird.offsetX,
            top: bird.offsetY,
            transform: `scale(${bird.size}) scaleX(${direction})`,
          }}
        >
          <svg width="20" height="10" viewBox="0 0 20 10" className="text-forest-800/40">
            <motion.path
              d="M0 5 Q5 0 10 5 Q15 0 20 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                d: [
                  "M0 5 Q5 0 10 5 Q15 0 20 5",
                  "M0 5 Q5 8 10 5 Q15 8 20 5",
                  "M0 5 Q5 0 10 5 Q15 0 20 5",
                ],
              }}
              transition={{
                duration: 0.35,
                delay: i * 0.05,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Butterfly with fluttering wings
function Butterfly({
  delay,
  color,
  startX,
  startY,
}: {
  delay: number
  color: string
  startX: number
  startY: number
}) {
  // Random curved path
  const midX = useMemo(() => startX + (Math.random() - 0.5) * 40, [startX])
  const endX = useMemo(() => startX + (Math.random() - 0.5) * 60 + 30, [startX])
  const midY = useMemo(() => startY - 10 - Math.random() * 15, [startY])
  const endY = useMemo(() => startY - 20 - Math.random() * 20, [startY])

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${startX}%`, top: `${startY}%`, willChange: 'transform, opacity' }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.8, 0.8, 0],
        x: [`0%`, `${midX - startX}%`, `${endX - startX}%`],
        y: [`0%`, `${midY - startY}%`, `${endY - startY}%`],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.svg
        width="16"
        height="14"
        viewBox="0 0 16 14"
        animate={{ scaleX: [1, 0.2, 1] }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Left wing */}
        <ellipse cx="4" cy="5" rx="4" ry="5" fill={color} opacity={0.8} />
        {/* Right wing */}
        <ellipse cx="12" cy="5" rx="4" ry="5" fill={color} opacity={0.8} />
        {/* Body */}
        <ellipse cx="8" cy="7" rx="1" ry="5" fill="#111827" />
        {/* Lower wings */}
        <ellipse cx="5" cy="10" rx="3" ry="3" fill={color} opacity={0.6} />
        <ellipse cx="11" cy="10" rx="3" ry="3" fill={color} opacity={0.6} />
      </motion.svg>
    </motion.div>
  )
}

// Mist/fog layer
function MistLayer({
  yPosition,
  opacity,
  speed,
  reverse = false,
}: {
  yPosition: number
  opacity: number
  speed: number
  reverse?: boolean
}) {
  return (
    <motion.div
      className="absolute w-[200%] h-16 md:h-24 pointer-events-none"
      style={{
        top: `${yPosition}%`,
        left: reverse ? '0%' : '-100%',
        willChange: 'transform',
      }}
      animate={{
        x: reverse ? ['-50%', '0%'] : ['0%', '-50%'],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id={`mistGrad-${yPosition}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,30 Q100,10 200,30 T400,30 T600,30 T800,30 T1000,30 T1200,30"
          fill={`url(#mistGrad-${yPosition})`}
          stroke="none"
        />
        <ellipse cx="150" cy="30" rx="100" ry="25" fill="white" opacity="0.5" />
        <ellipse cx="450" cy="35" rx="120" ry="20" fill="white" opacity="0.4" />
        <ellipse cx="750" cy="28" rx="90" ry="22" fill="white" opacity="0.5" />
        <ellipse cx="1050" cy="32" rx="110" ry="18" fill="white" opacity="0.4" />
      </svg>
    </motion.div>
  )
}

interface FloatingElementsProps {
  particleCount?: number
  leafCount?: number
  showBirds?: boolean
  showButterflies?: boolean
  showMist?: boolean
}

export default function FloatingElements({
  particleCount = 15,
  leafCount = 5,
  showBirds = true,
  showButterflies = true,
  showMist = true,
}: FloatingElementsProps) {
  const { reducedMotion } = useAccessibility()

  // All hooks must be called before any conditional return
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 3 + Math.random() * 4,
      startX: Math.random() * 100,
      startY: Math.random() * 30,
      color: [
        'rgba(44, 82, 130, 0.5)',
        'rgba(20, 184, 166, 0.4)',
        'rgba(217, 119, 6, 0.35)',
        'rgba(255, 255, 255, 0.5)',
      ][Math.floor(Math.random() * 4)],
    }))
  }, [particleCount])

  const leaves = useMemo(() => {
    return Array.from({ length: leafCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 12 + Math.random() * 8,
      startX: Math.random() * 100,
    }))
  }, [leafCount])

  const butterflies = useMemo(() => [
    { delay: 3, color: '#F59E0B', startX: 15, startY: 60 },   // Gold
    { delay: 8, color: '#FBBF24', startX: 75, startY: 55 },   // Gold bright
    { delay: 14, color: '#FFFFFF', startX: 40, startY: 65 },  // White
    { delay: 20, color: '#14b8a6', startX: 85, startY: 58 },  // Teal
  ], [])

  // Conditional return AFTER all hooks
  if (reducedMotion) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mist layers */}
      {showMist && (
        <>
          <MistLayer yPosition={65} opacity={0.15} speed={80} />
          <MistLayer yPosition={75} opacity={0.2} speed={70} reverse />
          <MistLayer yPosition={85} opacity={0.25} speed={90} />
        </>
      )}

      {/* Floating particles */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          startX={particle.startX}
          startY={particle.startY}
          color={particle.color}
        />
      ))}

      {/* Floating leaves */}
      {leaves.map((leaf) => (
        <Leaf
          key={`leaf-${leaf.id}`}
          delay={leaf.delay}
          duration={leaf.duration}
          startX={leaf.startX}
        />
      ))}

      {/* Individual flapping birds */}
      {showBirds && (
        <>
          <FlappingBird delay={1} duration={18} startY={18} size={0.9} direction={1} />
          <FlappingBird delay={8} duration={22} startY={25} size={1.1} direction={1} />
          <FlappingBird delay={15} duration={20} startY={15} size={0.8} direction={-1} />
        </>
      )}

      {/* Bird flocks */}
      {showBirds && (
        <>
          <BirdFlock delay={5} startY={20} direction={1} />
          <BirdFlock delay={18} startY={12} direction={-1} />
        </>
      )}

      {/* Butterflies */}
      {showButterflies && butterflies.map((butterfly, i) => (
        <Butterfly
          key={`butterfly-${i}`}
          delay={butterfly.delay}
          color={butterfly.color}
          startX={butterfly.startX}
          startY={butterfly.startY}
        />
      ))}
    </div>
  )
}
