'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from '@/components/MagneticButton'

/** Deterministic pseudo-random — keep SSR/client identical */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function NotFound() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => {
        const bright = seededRandom(i * 3 + 2) < 0.18
        const size = bright
          ? 1.8 + seededRandom(i * 7) * 2
          : 0.8 + seededRandom(i * 7) * 1.2
        return {
          x: seededRandom(i * 3) * 100,
          y: seededRandom(i * 3 + 1) * 100,
          size,
          bright,
          opacity: bright
            ? 0.6 + seededRandom(i * 5) * 0.4
            : 0.2 + seededRandom(i * 5) * 0.4,
          twinkleDelay: seededRandom(i * 11) * 6,
          twinkleDuration: 3 + seededRandom(i * 13) * 4,
        }
      }),
    [],
  )

  const orbs = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        x: 15 + seededRandom(i * 17) * 70,
        y: 15 + seededRandom(i * 17 + 1) * 70,
        size: 220 + seededRandom(i * 19) * 220,
        color: ['#3b82f6', '#60a5fa', '#2c5282', '#1d4ed8'][i % 4],
        opacity: 0.04 + seededRandom(i * 23) * 0.06,
        driftDuration: 22 + seededRandom(i * 29) * 24,
        driftDelay: seededRandom(i * 31) * 10,
        keyframe: i % 4, // pick one of 4 drift paths
      })),
    [],
  )

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #0f1629 0%, #080d1a 70%)' }}
    >
      {/* Drifting nebula orbs — softly bloom around the page */}
      {orbs.map((orb, i) => (
        <div
          key={`o${i}`}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${orb.size.toFixed(2)}px`,
            height: `${orb.size.toFixed(2)}px`,
            left: `${orb.x.toFixed(4)}%`,
            top: `${orb.y.toFixed(4)}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            opacity: Number(orb.opacity.toFixed(4)),
            filter: 'blur(40px)',
            animation: `nf-drift${orb.keyframe} ${orb.driftDuration.toFixed(3)}s ease-in-out ${orb.driftDelay.toFixed(3)}s infinite`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Stars — each twinkles on its own clock so the field never pulses in unison */}
      {stars.map((star, i) => (
        <div
          key={`s${i}`}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${star.size.toFixed(3)}px`,
            height: `${star.size.toFixed(3)}px`,
            left: `${star.x.toFixed(4)}%`,
            top: `${star.y.toFixed(4)}%`,
            backgroundColor: star.bright ? '#ffffff' : 'rgba(200,215,255,0.7)',
            opacity: Number(star.opacity.toFixed(4)),
            boxShadow: star.bright
              ? `0 0 ${(star.size * 3).toFixed(2)}px rgba(200,220,255,0.55)`
              : 'none',
            animation: `nf-twinkle ${star.twinkleDuration.toFixed(3)}s ease-in-out ${star.twinkleDelay.toFixed(3)}s infinite`,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
          This path doesn&apos;t lead anywhere in our forest.
        </p>
        <MagneticButton
          href="/"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
        >
          Go Home
        </MagneticButton>
      </motion.div>

      {/* Animation keyframes — local to this page only */}
      <style jsx>{`
        @keyframes nf-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes nf-drift0 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -30px); }
        }
        @keyframes nf-drift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }
        @keyframes nf-drift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(35px, 25px); }
        }
        @keyframes nf-drift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, -20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[aria-hidden="true"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
