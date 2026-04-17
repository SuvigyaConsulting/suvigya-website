'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const haze1Ref = useRef<HTMLDivElement>(null)
  const haze2Ref = useRef<HTMLDivElement>(null)
  const haze3Ref = useRef<HTMLDivElement>(null)
  const atmosphereRef = useRef<HTMLDivElement>(null)

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

      // Stars fade (0-20%)
      tl.to(starsRef.current, { opacity: 0, duration: 0.2 }, 0)

      // Thin atmospheric haze layers drift in at different times
      // These are CSS-only — wide, soft, blurred bands (not PNG cutouts)
      tl.fromTo(haze1Ref.current,
        { opacity: 0 },
        { opacity: 0.4, duration: 0.3 }, 0.15)

      tl.fromTo(haze2Ref.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.3 }, 0.25)

      tl.fromTo(haze3Ref.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.3 }, 0.35)

      // Full atmosphere blanket fades in (the "breaking through" moment)
      tl.fromTo(atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }, 0.45)

      // Haze layers stay and INTENSIFY — never go back to blue
      tl.to(haze1Ref.current, { opacity: 0.7, duration: 0.2 }, 0.55)
      tl.to(haze2Ref.current, { opacity: 0.8, duration: 0.2 }, 0.55)
      tl.to(haze3Ref.current, { opacity: 0.9, duration: 0.2 }, 0.55)
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
      {/* Stars */}
      <div ref={starsRef} className="absolute top-0 left-0 right-0" style={{ height: '45%' }}>
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

      {/* Atmospheric haze layers — soft full-width bands, not individual cloud cutouts */}
      {/* These create a seamless atmospheric feel without looking like pasted images */}

      {/* Thin high-altitude haze */}
      <div
        ref={haze1Ref}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '25%',
          height: '15%',
          background: 'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 70%, transparent 100%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Mid-altitude haze — slightly thicker */}
      <div
        ref={haze2Ref}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '33%',
          height: '18%',
          background: 'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.25) 25%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.25) 75%, transparent 100%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Low thick atmospheric layer */}
      <div
        ref={haze3Ref}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '40%',
          height: '22%',
          background: 'linear-gradient(0deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Full atmosphere blanket — the cloud floor you descend through */}
      <div
        ref={atmosphereRef}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '45%',
          height: '35%',
          background: 'linear-gradient(0deg, rgba(248,250,251,1) 0%, rgba(248,250,251,0.95) 20%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.2) 80%, transparent 100%)',
          filter: 'blur(15px)',
        }}
      />
    </div>
  )
}
