'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<HTMLDivElement>(null)
  const sunGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const sky = skyRef.current
    const stars = starsRef.current
    const clouds = cloudsRef.current
    const sunGlow = sunGlowRef.current
    if (!section || !sky || !stars || !clouds || !sunGlow) return

    const ctx = gsap.context(() => {
      // Master timeline scrubbed by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          pin: false,
        },
      })

      // Phase 1 (0-30%): Stars fade out, sky lightens from navy to deep blue
      tl.to(stars, { opacity: 0, duration: 0.3 }, 0)
      tl.to(sky, {
        background: 'linear-gradient(180deg, #0c1a3a 0%, #1a3a6a 40%, #2d5a8a 100%)',
        duration: 0.3,
      }, 0)

      // Phase 2 (30-60%): Sky goes from deep blue to light blue, clouds drift in
      tl.to(sky, {
        background: 'linear-gradient(180deg, #4a8abf 0%, #7ab4d9 40%, #a8d4ea 100%)',
        duration: 0.3,
      }, 0.3)
      tl.fromTo(clouds, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.3 }, 0.25)
      tl.fromTo(sunGlow, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.3)

      // Phase 3 (60-100%): Clouds pass by (move up), sky brightens to white/light
      tl.to(sky, {
        background: 'linear-gradient(180deg, #b8dff0 0%, #daeef5 40%, #f8fafb 100%)',
        duration: 0.4,
      }, 0.6)
      tl.to(clouds, { y: -200, opacity: 0, duration: 0.4 }, 0.6)
      tl.to(sunGlow, { opacity: 0, y: -100, duration: 0.3 }, 0.7)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '250vh' }} // Generous scroll distance for cinematic feel
    >
      {/* Sky gradient background */}
      <div
        ref={skyRef}
        className="sticky top-0 w-full h-screen"
        style={{
          background: 'linear-gradient(180deg, #080d1a 0%, #0c1a2e 40%, #101f3a 100%)',
        }}
      >
        {/* Stars layer — CSS dots that fade with scroll */}
        <div ref={starsRef} className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() < 0.15 ? '2.5px' : '1.5px',
                height: Math.random() < 0.15 ? '2.5px' : '1.5px',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2 + Math.random() * 0.6,
              }}
            />
          ))}
        </div>

        {/* Sun glow — appears mid-transition */}
        <div
          ref={sunGlowRef}
          className="absolute opacity-0"
          style={{
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(255,220,150,0.3) 0%, rgba(255,180,100,0.1) 40%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Cloud layers */}
        <div ref={cloudsRef} className="absolute inset-0 overflow-hidden opacity-0">
          {/* Cloud 1 — large, slow */}
          <svg className="absolute" style={{ top: '35%', left: '-5%', width: '45%', opacity: 0.7 }} viewBox="0 0 600 200" fill="none">
            <ellipse cx="200" cy="120" rx="180" ry="60" fill="white" opacity="0.6" />
            <ellipse cx="320" cy="100" rx="220" ry="75" fill="white" opacity="0.7" />
            <ellipse cx="450" cy="130" rx="150" ry="50" fill="white" opacity="0.5" />
          </svg>

          {/* Cloud 2 — medium */}
          <svg className="absolute" style={{ top: '45%', right: '-8%', width: '40%', opacity: 0.6 }} viewBox="0 0 500 180" fill="none">
            <ellipse cx="150" cy="100" rx="140" ry="55" fill="white" opacity="0.5" />
            <ellipse cx="280" cy="85" rx="180" ry="65" fill="white" opacity="0.7" />
            <ellipse cx="400" cy="110" rx="100" ry="45" fill="white" opacity="0.4" />
          </svg>

          {/* Cloud 3 — small wisps */}
          <svg className="absolute" style={{ top: '55%', left: '20%', width: '30%', opacity: 0.5 }} viewBox="0 0 400 120" fill="none">
            <ellipse cx="120" cy="70" rx="100" ry="35" fill="white" opacity="0.4" />
            <ellipse cx="250" cy="60" rx="130" ry="45" fill="white" opacity="0.6" />
          </svg>

          {/* Cloud 4 — bottom layer, denser */}
          <svg className="absolute" style={{ top: '65%', left: '-10%', width: '120%', opacity: 0.8 }} viewBox="0 0 1200 200" fill="none">
            <ellipse cx="100" cy="100" rx="200" ry="80" fill="white" opacity="0.5" />
            <ellipse cx="350" cy="90" rx="250" ry="90" fill="white" opacity="0.6" />
            <ellipse cx="600" cy="110" rx="200" ry="70" fill="white" opacity="0.5" />
            <ellipse cx="850" cy="95" rx="230" ry="85" fill="white" opacity="0.7" />
            <ellipse cx="1100" cy="105" rx="200" ry="75" fill="white" opacity="0.5" />
          </svg>
        </div>

        {/* Scroll hint at top */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-10 bg-white/20 animate-pulse-line" />
        </div>
      </div>
    </div>
  )
}
