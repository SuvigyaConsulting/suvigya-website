'use client'

import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Deterministic pseudo-random — same seed always gives the same value. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const atmosphereRef = useRef<HTMLDivElement>(null)

  /* ── Stars: generated once, positions never change ── */
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => {
        const bright = seededRandom(i * 3 + 2) < 0.08
        const size = bright
          ? 2 + seededRandom(i * 7) * 1.5
          : 0.8 + seededRandom(i * 7) * 0.8
        return {
          x: seededRandom(i * 3) * 100,
          y: seededRandom(i * 3 + 1) * 80,
          size,
          bright,
          opacity: bright
            ? 0.6 + seededRandom(i * 5) * 0.4
            : 0.1 + seededRandom(i * 5) * 0.3,
        }
      }),
    [],
  )

  /* ── Scroll-driven animation ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1.5,
        },
      })

      // Stars fade out: 0-25% of the timeline
      tl.to(starsRef.current, { opacity: 0, duration: 0.25 }, 0)

      // Cloud atmosphere fades in: 25-60% of the timeline
      tl.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        0.25,
      )

      // 60-100%: atmosphere stays at full opacity (nothing to animate — it
      // naturally holds at opacity 1 for the remainder of the scrub).
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        height: '200vh',
        background: `linear-gradient(180deg,
          #080d1a 0%,
          #0a1225 5%,
          #0d1530 10%,
          #101a3a 15%,
          #142045 20%,
          #1a2855 25%,
          #203260 28%,
          #2a4070 32%,
          #354d80 36%,
          #405a90 40%,
          #4a68a0 44%,
          #5578aa 48%,
          #6088b5 52%,
          #6a95c0 56%,
          #78a5ca 60%,
          #88b5d5 64%,
          #98c2dc 68%,
          #a8cee4 72%,
          #b8d8ea 76%,
          #c8e2f0 80%,
          #d5eaf4 84%,
          #e2f0f7 88%,
          #eef5fa 92%,
          #f4f8fb 96%,
          #f8fafb 100%
        )`,
      }}
    >
      {/* ── Stars ── */}
      <div
        ref={starsRef}
        className="absolute top-0 left-0 right-0"
        style={{ height: '45%' }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              backgroundColor: star.bright
                ? '#fff'
                : `rgba(200,215,255,${0.5 + seededRandom(i * 11) * 0.5})`,
              boxShadow: star.bright
                ? `0 0 ${star.size * 2}px rgba(200,220,255,0.5)`
                : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Atmospheric cloud layer ── */}
      <div
        ref={atmosphereRef}
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          opacity: 0,
          top: '50%',
          height: '50%',
          background: `
            radial-gradient(ellipse 60% 30% at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 50% 25% at 70% 45%, rgba(255,255,255,0.25) 0%, transparent 65%),
            radial-gradient(ellipse 70% 35% at 45% 55%, rgba(255,255,255,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 80% 40% at 55% 60%, rgba(255,255,255,0.4) 0%, transparent 65%),
            linear-gradient(0deg, rgba(248,250,251,0.95) 0%, rgba(255,255,255,0.6) 30%, transparent 60%)
          `,
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}
