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
  [0.15, '#0f1835', '#141e45', '#1a2855'],  // Pre-dawn navy
  [0.25, '#151f48', '#1e3060', '#2d4575'],  // First hint of light
  [0.35, '#1a2855', '#2d4575', '#456090'],  // Dawn begins
  [0.45, '#223565', '#3d5a8a', '#5a80a8'],  // Dawn blue
  [0.55, '#2d4575', '#4a7098', '#6a95b8'],  // Morning blue
  [0.65, '#3d5a8a', '#5a88b0', '#80aac8'],  // Mid morning
  [0.75, '#4a70a0', '#70a0c0', '#95c0d8'],  // Late morning
  [0.85, '#5a88b5', '#88b8d5', '#aad5e8'],  // Bright sky
  [0.92, '#70a0c8', '#a0cce0', '#c0e0ef'],  // Near noon
  [1.00, '#90b8d8', '#c0dce8', '#f8fafb'],  // Light sky (matches site bg)
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

      // Stars fade slowly (0-25%)
      tl.to(starsRef.current, { opacity: 0, duration: 0.25 }, 0)

      // Warm horizon diffusion — grows from bottom, no sun disc (10-60%)
      tl.fromTo(horizonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 }, 0.1)

      // High wispy clouds drift in (25-45%)
      tl.fromTo(cloudsHighRef.current,
        { opacity: 0, x: -200 },
        { opacity: 1, x: 0, duration: 0.2 }, 0.25)

      // Low thick clouds rise from below (35-55%)
      tl.fromTo(cloudsLowRef.current,
        { opacity: 0, y: 200 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }, 0.35)

      // Hold clouds visible (55-70%)
      // Then descend through them (70-90%)
      tl.to(cloudsHighRef.current, { y: -400, opacity: 0, duration: 0.2 }, 0.7)
      tl.to(cloudsLowRef.current, { y: -500, opacity: 0, duration: 0.2 }, 0.72)

      // Horizon diffusion fades as sky brightens (80-100%)
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
      style={{ height: '200vh' }}
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

        {/* Horizon glow — DRAMATIC warm gradient covering bottom half */}
        <div
          ref={horizonRef}
          className="absolute bottom-0 left-0 right-0 opacity-0 pointer-events-none"
          style={{
            height: '60%',
            background: 'linear-gradient(0deg, rgba(255,140,50,0.5) 0%, rgba(255,100,40,0.3) 20%, rgba(255,80,30,0.15) 40%, rgba(200,60,40,0.05) 60%, transparent 100%)',
          }}
        />

        {/* High cirrus clouds — wispy, golden-lit from dawn */}
        <div ref={cloudsHighRef} className="absolute inset-0 pointer-events-none opacity-0">
          <div className="absolute" style={{ top: '15%', left: '-10%', width: '55%', height: '12%', background: 'linear-gradient(90deg, transparent 5%, rgba(255,240,220,0.5) 25%, rgba(255,255,255,0.7) 50%, rgba(255,240,220,0.4) 75%, transparent 95%)', borderRadius: '50%', filter: 'blur(6px)' }} />
          <div className="absolute" style={{ top: '22%', right: '-12%', width: '50%', height: '10%', background: 'linear-gradient(90deg, transparent 8%, rgba(255,235,210,0.4) 30%, rgba(255,255,255,0.6) 55%, rgba(255,245,230,0.3) 80%, transparent 92%)', borderRadius: '50%', filter: 'blur(8px)' }} />
          <div className="absolute" style={{ top: '10%', left: '25%', width: '35%', height: '8%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 40%, rgba(255,250,240,0.45) 60%, transparent)', borderRadius: '50%', filter: 'blur(10px)' }} />
          <div className="absolute" style={{ top: '30%', left: '40%', width: '30%', height: '6%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 50%, transparent)', borderRadius: '50%', filter: 'blur(5px)' }} />
        </div>

        {/* Low cumulus clouds — THICK, bright, dramatic */}
        <div ref={cloudsLowRef} className="absolute inset-0 pointer-events-none opacity-0">
          {/* Individual cloud masses */}
          <div className="absolute" style={{ top: '42%', left: '-15%', width: '60%', height: '20%', background: 'radial-gradient(ellipse 100% 80%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 80%)', filter: 'blur(10px)' }} />
          <div className="absolute" style={{ top: '48%', right: '-10%', width: '55%', height: '22%', background: 'radial-gradient(ellipse 100% 80%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 45%, transparent 75%)', filter: 'blur(12px)' }} />
          <div className="absolute" style={{ top: '55%', left: '5%', width: '90%', height: '25%', background: 'radial-gradient(ellipse 100% 70%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 40%, transparent 75%)', filter: 'blur(15px)' }} />
          {/* Dense cloud floor — you descend through this */}
          <div className="absolute" style={{ top: '65%', left: '-20%', width: '140%', height: '38%', background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.3) 75%, transparent 100%)', filter: 'blur(8px)' }} />
        </div>

      </div>
    </div>
  )
}
