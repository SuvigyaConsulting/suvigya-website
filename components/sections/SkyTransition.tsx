'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Realistic sky color palette — sampled from actual dawn photography
// Each stop: [progress, topColor, midColor, bottomColor]
const SKY_COLORS: [number, string, string, string][] = [
  [0.00, '#080d1a', '#0a1020', '#0c1428'],  // Deep night
  [0.10, '#0d1530', '#121d3d', '#18284a'],  // Late night
  [0.20, '#141e45', '#1f2f5a', '#2a4070'],  // Pre-dawn navy
  [0.30, '#1a2850', '#2d4575', '#45628e'],  // First light
  [0.40, '#2a3d68', '#4a6a98', '#7090b5'],  // Dawn blue
  [0.50, '#3d5580', '#6a90b8', '#95b8d5'],  // Early morning
  [0.55, '#4a6590', '#80a5c8', '#aacce0'],  // Morning blue
  [0.60, '#5878a0', '#8cb5d5', '#b5d8ea'],  // Mid morning
  [0.70, '#7098b8', '#a5cce0', '#c8e2f0'],  // Late morning
  [0.80, '#88b0cc', '#bcdae8', '#daeef5'],  // Bright sky
  [0.90, '#a0c5d8', '#d0e8f2', '#eaf4f8'],  // Near noon
  [1.00, '#c0d8e8', '#e5f0f5', '#f8fafb'],  // Pale sky (matches site bg)
]

function lerpColor(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16)
  const ag = parseInt(a.slice(3, 5), 16)
  const ab = parseInt(a.slice(5, 7), 16)
  const br = parseInt(b.slice(1, 3), 16)
  const bg = parseInt(b.slice(3, 5), 16)
  const bb = parseInt(b.slice(5, 7), 16)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const b_ = Math.round(ab + (bb - ab) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b_.toString(16).padStart(2, '0')}`
}

function getSkyGradient(progress: number): string {
  // Find the two stops to interpolate between
  let lower = SKY_COLORS[0]
  let upper = SKY_COLORS[SKY_COLORS.length - 1]

  for (let i = 0; i < SKY_COLORS.length - 1; i++) {
    if (progress >= SKY_COLORS[i][0] && progress <= SKY_COLORS[i + 1][0]) {
      lower = SKY_COLORS[i]
      upper = SKY_COLORS[i + 1]
      break
    }
  }

  const range = upper[0] - lower[0]
  const t = range > 0 ? (progress - lower[0]) / range : 0

  const top = lerpColor(lower[1], upper[1], t)
  const mid = lerpColor(lower[2], upper[2], t)
  const bottom = lerpColor(lower[3], upper[3], t)

  return `linear-gradient(180deg, ${top} 0%, ${mid} 50%, ${bottom} 100%)`
}

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const cloudsLowRef = useRef<HTMLDivElement>(null)
  const cloudsHighRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const horizonRef = useRef<HTMLDivElement>(null)

  const updateSky = useCallback((progress: number) => {
    if (!canvasRef.current) return
    canvasRef.current.style.background = getSkyGradient(progress)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          updateSky(self.progress)
        },
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Stars fade (0-20%)
      tl.to(starsRef.current, { opacity: 0, duration: 0.2 }, 0)

      // Horizon glow appears (20-40%)
      tl.fromTo(horizonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }, 0.15)

      // Sun rises from below (25-50%)
      tl.fromTo(sunRef.current,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power1.out' }, 0.25)

      // High wispy clouds enter (35-55%)
      tl.fromTo(cloudsHighRef.current,
        { opacity: 0, x: -100 },
        { opacity: 0.7, x: 0, duration: 0.2 }, 0.35)

      // Low thick clouds enter (45-65%)
      tl.fromTo(cloudsLowRef.current,
        { opacity: 0, y: 100 },
        { opacity: 0.9, y: 0, duration: 0.2 }, 0.45)

      // Clouds pass through (65-90%)
      tl.to(cloudsHighRef.current, { y: -200, opacity: 0, duration: 0.25 }, 0.65)
      tl.to(cloudsLowRef.current, { y: -300, opacity: 0, duration: 0.25 }, 0.7)

      // Sun and horizon fade into white (80-100%)
      tl.to(sunRef.current, { opacity: 0, y: -100, duration: 0.2 }, 0.8)
      tl.to(horizonRef.current, { opacity: 0, duration: 0.2 }, 0.8)

    }, section)

    // Set initial sky
    updateSky(0)

    return () => ctx.revert()
  }, [updateSky])

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Sky canvas — gradient updated per frame */}
        <div
          ref={canvasRef}
          className="absolute inset-0 transition-none"
          style={{ background: getSkyGradient(0) }}
        />

        {/* Stars */}
        <div ref={starsRef} className="absolute inset-0">
          {Array.from({ length: 150 }).map((_, i) => {
            const isBright = Math.random() < 0.08
            const size = isBright ? 2 + Math.random() * 1.5 : 0.8 + Math.random() * 0.8
            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 75}%`,
                  opacity: isBright ? 0.7 + Math.random() * 0.3 : 0.15 + Math.random() * 0.35,
                  backgroundColor: isBright ? '#fff' : `rgba(200,210,255,${0.5 + Math.random() * 0.5})`,
                  boxShadow: isBright ? `0 0 ${size * 2}px rgba(200,220,255,0.4)` : 'none',
                }}
              />
            )
          })}
        </div>

        {/* Horizon glow — warm gradient at the bottom during dawn */}
        <div
          ref={horizonRef}
          className="absolute bottom-0 left-0 right-0 opacity-0 pointer-events-none"
          style={{
            height: '40%',
            background: 'linear-gradient(0deg, rgba(255,160,80,0.25) 0%, rgba(255,120,60,0.12) 30%, rgba(255,100,50,0.04) 60%, transparent 100%)',
          }}
        />

        {/* Sun disc */}
        <div
          ref={sunRef}
          className="absolute opacity-0 pointer-events-none"
          style={{
            bottom: '25%',
            left: '50%',
            transform: 'translateX(-50%) translateY(200px)',
            width: '300px',
            height: '300px',
          }}
        >
          {/* Core */}
          <div className="absolute inset-0 rounded-full" style={{
            background: 'radial-gradient(circle at 50% 60%, rgba(255,250,220,0.9) 0%, rgba(255,220,150,0.5) 25%, rgba(255,180,80,0.2) 50%, transparent 70%)',
          }} />
          {/* Outer glow */}
          <div className="absolute -inset-20 rounded-full" style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(255,200,100,0.15) 0%, rgba(255,160,60,0.06) 40%, transparent 65%)',
          }} />
        </div>

        {/* High wispy clouds */}
        <div ref={cloudsHighRef} className="absolute inset-0 pointer-events-none opacity-0">
          <div className="absolute" style={{ top: '20%', left: '-5%', width: '45%', height: '8%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.2) 85%, transparent)', borderRadius: '50%', filter: 'blur(8px)' }} />
          <div className="absolute" style={{ top: '28%', right: '-8%', width: '40%', height: '6%', background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.4) 70%, transparent 95%)', borderRadius: '50%', filter: 'blur(6px)' }} />
          <div className="absolute" style={{ top: '15%', left: '30%', width: '25%', height: '5%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)', borderRadius: '50%', filter: 'blur(10px)' }} />
        </div>

        {/* Low thick clouds — blurred for realism */}
        <div ref={cloudsLowRef} className="absolute inset-0 pointer-events-none opacity-0">
          <div className="absolute" style={{ top: '50%', left: '-10%', width: '55%', height: '15%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, transparent 85%)', filter: 'blur(12px)' }} />
          <div className="absolute" style={{ top: '55%', right: '-5%', width: '50%', height: '18%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 55%, transparent 80%)', filter: 'blur(15px)' }} />
          <div className="absolute" style={{ top: '62%', left: '10%', width: '80%', height: '20%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.5) 50%, transparent 80%)', filter: 'blur(18px)' }} />
          {/* Bottom cloud blanket */}
          <div className="absolute" style={{ top: '72%', left: '-15%', width: '130%', height: '30%', background: 'linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.4) 70%, transparent 100%)', filter: 'blur(10px)' }} />
        </div>

      </div>
    </div>
  )
}
