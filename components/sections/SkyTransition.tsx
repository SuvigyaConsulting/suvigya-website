'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const horizonRef = useRef<HTMLDivElement>(null)
  // Individual cloud refs for parallax at different speeds
  const cloud1Ref = useRef<HTMLImageElement>(null)
  const cloud2Ref = useRef<HTMLImageElement>(null)
  const cloud3Ref = useRef<HTMLImageElement>(null)
  const cloud4Ref = useRef<HTMLImageElement>(null)
  const cloud5Ref = useRef<HTMLImageElement>(null)
  const cloudFloorRef = useRef<HTMLDivElement>(null)

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

      // Stars fade
      tl.to(starsRef.current, { opacity: 0, duration: 0.3 }, 0)

      // Warm horizon diffusion
      tl.fromTo(horizonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 }, 0.05)

      // Clouds enter at DIFFERENT speeds (parallax depth)
      // Far clouds — slow, enter early, subtle
      tl.fromTo(cloud1Ref.current,
        { opacity: 0, x: -80, y: 40 },
        { opacity: 0.6, x: 0, y: 0, duration: 0.25 }, 0.2)
      tl.fromTo(cloud5Ref.current,
        { opacity: 0, x: 60, y: 30 },
        { opacity: 0.5, x: 0, y: 0, duration: 0.25 }, 0.22)

      // Mid clouds — medium speed
      tl.fromTo(cloud2Ref.current,
        { opacity: 0, y: 60 },
        { opacity: 0.8, y: 0, duration: 0.2 }, 0.3)
      tl.fromTo(cloud4Ref.current,
        { opacity: 0, x: -40, y: 50 },
        { opacity: 0.7, y: 0, x: 0, duration: 0.2 }, 0.32)

      // Near cloud — fast, dramatic, large
      tl.fromTo(cloud3Ref.current,
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 0.9, y: 0, scale: 1, duration: 0.2 }, 0.35)

      // Cloud floor (white fade at bottom)
      tl.fromTo(cloudFloorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }, 0.4)

      // DESCEND through clouds — each cloud moves UP at different speeds
      // Near clouds move fastest (parallax)
      tl.to(cloud3Ref.current, { y: -350, opacity: 0, duration: 0.25 }, 0.6)
      tl.to(cloud2Ref.current, { y: -280, opacity: 0, duration: 0.25 }, 0.62)
      tl.to(cloud4Ref.current, { y: -250, opacity: 0, duration: 0.25 }, 0.63)
      tl.to(cloud1Ref.current, { y: -180, opacity: 0, duration: 0.25 }, 0.65)
      tl.to(cloud5Ref.current, { y: -160, opacity: 0, duration: 0.25 }, 0.66)
      tl.to(cloudFloorRef.current, { opacity: 0, y: -100, duration: 0.2 }, 0.7)

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

      {/* Warm horizon diffusion */}
      <div
        ref={horizonRef}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '22%',
          height: '35%',
          background: 'radial-gradient(ellipse 130% 90% at 50% 85%, rgba(255,150,60,0.3) 0%, rgba(255,110,40,0.15) 30%, rgba(255,80,30,0.05) 55%, transparent 75%)',
        }}
      />

      {/* Cloud layer 1 — far, upper left, wispy */}
      <img
        ref={cloud1Ref}
        src="/textures/clouds/cloud1.png"
        alt=""
        className="absolute pointer-events-none opacity-0"
        style={{ top: '28%', left: '-8%', width: '50%', maxWidth: '700px' }}
        draggable={false}
      />

      {/* Cloud layer 5 — far, upper right */}
      <img
        ref={cloud5Ref}
        src="/textures/clouds/cloud5.png"
        alt=""
        className="absolute pointer-events-none opacity-0"
        style={{ top: '30%', right: '-5%', width: '40%', maxWidth: '550px' }}
        draggable={false}
      />

      {/* Cloud layer 2 — mid, center-right */}
      <img
        ref={cloud2Ref}
        src="/textures/clouds/cloud2.png"
        alt=""
        className="absolute pointer-events-none opacity-0"
        style={{ top: '36%', right: '-12%', width: '55%', maxWidth: '750px' }}
        draggable={false}
      />

      {/* Cloud layer 4 — mid, center-left */}
      <img
        ref={cloud4Ref}
        src="/textures/clouds/cloud4.png"
        alt=""
        className="absolute pointer-events-none opacity-0"
        style={{ top: '38%', left: '-5%', width: '45%', maxWidth: '600px' }}
        draggable={false}
      />

      {/* Cloud layer 3 — near, large, dramatic, covers center */}
      <img
        ref={cloud3Ref}
        src="/textures/clouds/cloud3.png"
        alt=""
        className="absolute pointer-events-none opacity-0"
        style={{ top: '40%', left: '5%', width: '90%', maxWidth: '1200px' }}
        draggable={false}
      />

      {/* Cloud floor — white gradient fade at the bottom (descending through) */}
      <div
        ref={cloudFloorRef}
        className="absolute left-0 right-0 opacity-0 pointer-events-none"
        style={{
          top: '48%',
          height: '30%',
          background: 'linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.3) 65%, transparent 100%)',
        }}
      />
    </div>
  )
}
