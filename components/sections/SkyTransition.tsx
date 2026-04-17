'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const cloudsRef = useRef<HTMLDivElement>(null)
  const horizonRef = useRef<HTMLDivElement>(null)

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

      // Stars fade as we scroll down
      tl.to(starsRef.current, { opacity: 0, duration: 0.3 }, 0)

      // Warm horizon glow appears
      tl.fromTo(horizonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }, 0.1)

      // Clouds drift in
      tl.fromTo(cloudsRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.25 }, 0.3)

      // Clouds pass through and fade
      tl.to(cloudsRef.current, { y: -200, opacity: 0, duration: 0.3 }, 0.6)

      // Horizon fades
      tl.to(horizonRef.current, { opacity: 0, duration: 0.2 }, 0.75)
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        height: '200vh',
        // ONE continuous gradient — dark at top, white at bottom. No seams possible.
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
      {/* Stars — positioned in the dark top portion */}
      <div ref={starsRef} className="absolute top-0 left-0 right-0" style={{ height: '50%' }}>
        {Array.from({ length: 120 }).map((_, i) => {
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
                top: `${Math.random() * 80}%`,
                opacity: isBright ? 0.6 + Math.random() * 0.4 : 0.1 + Math.random() * 0.3,
                backgroundColor: isBright ? '#fff' : `rgba(200,215,255,${0.5 + Math.random() * 0.5})`,
                boxShadow: isBright ? `0 0 ${size * 2}px rgba(200,220,255,0.5)` : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Warm horizon diffusion — in the middle section */}
      <div
        ref={horizonRef}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '25%',
          height: '40%',
          background: 'radial-gradient(ellipse 120% 80% at 50% 80%, rgba(255,150,60,0.35) 0%, rgba(255,110,40,0.18) 30%, rgba(255,80,30,0.06) 55%, transparent 75%)',
        }}
      />

      {/* Cloud layers — in the middle-lower section */}
      <div ref={cloudsRef} className="absolute left-0 right-0 opacity-0 pointer-events-none" style={{ top: '35%', height: '45%' }}>
        {/* Wispy high clouds */}
        <div className="absolute" style={{ top: '0%', left: '-8%', width: '50%', height: '15%', background: 'linear-gradient(90deg, transparent 5%, rgba(255,245,230,0.5) 25%, rgba(255,255,255,0.65) 50%, rgba(255,245,230,0.35) 80%, transparent)', borderRadius: '50%', filter: 'blur(8px)' }} />
        <div className="absolute" style={{ top: '8%', right: '-10%', width: '45%', height: '12%', background: 'linear-gradient(90deg, transparent 10%, rgba(255,240,220,0.4) 35%, rgba(255,255,255,0.55) 60%, transparent 90%)', borderRadius: '50%', filter: 'blur(6px)' }} />

        {/* Mid cumulus */}
        <div className="absolute" style={{ top: '30%', left: '-12%', width: '58%', height: '22%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 50%, transparent 80%)', filter: 'blur(12px)' }} />
        <div className="absolute" style={{ top: '35%', right: '-8%', width: '52%', height: '24%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.45) 45%, transparent 75%)', filter: 'blur(14px)' }} />

        {/* Dense cloud floor */}
        <div className="absolute" style={{ top: '55%', left: '-15%', width: '130%', height: '48%', background: 'linear-gradient(0deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 35%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.15) 80%, transparent 100%)', filter: 'blur(10px)' }} />
      </div>
    </div>
  )
}
