'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const layer1Ref = useRef<HTMLDivElement>(null) // deep blue
  const layer2Ref = useRef<HTMLDivElement>(null) // medium blue
  const layer3Ref = useRef<HTMLDivElement>(null) // light sky
  const layer4Ref = useRef<HTMLDivElement>(null) // near white
  const cloudsRef = useRef<HTMLDivElement>(null)
  const sunGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // Stacked gradient layers crossfade for smooth color transitions
      // Start: dark navy (base). Each layer fades IN on top.

      // 0-25%: Stars fade, deep blue layer fades in
      tl.to(starsRef.current, { opacity: 0, duration: 0.2 }, 0)
      tl.to(layer1Ref.current, { opacity: 1, duration: 0.25 }, 0)

      // 20-45%: Medium blue fades in, sun glow appears
      tl.to(layer2Ref.current, { opacity: 1, duration: 0.25 }, 0.2)
      tl.fromTo(sunGlowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.8, scale: 1, duration: 0.2 }, 0.25)

      // 35-60%: Light sky fades in, clouds enter from below
      tl.to(layer3Ref.current, { opacity: 1, duration: 0.25 }, 0.35)
      tl.fromTo(cloudsRef.current,
        { opacity: 0, y: 150 },
        { opacity: 1, y: 0, duration: 0.25 }, 0.3)

      // 55-85%: Near-white fades in, clouds drift up and thin out
      tl.to(layer4Ref.current, { opacity: 1, duration: 0.3 }, 0.55)
      tl.to(cloudsRef.current, { y: -300, opacity: 0, duration: 0.35 }, 0.6)
      tl.to(sunGlowRef.current, { opacity: 0, y: -150, duration: 0.25 }, 0.7)

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '280vh' }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Base: dark navy (same as hero) */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #080d1a 0%, #0a1225 50%, #0c1830 100%)',
        }} />

        {/* Layer 1: Deep twilight blue */}
        <div ref={layer1Ref} className="absolute inset-0 opacity-0" style={{
          background: 'linear-gradient(180deg, #0f1f40 0%, #162d55 30%, #1e3d6b 60%, #254d80 100%)',
        }} />

        {/* Layer 2: Pre-dawn blue */}
        <div ref={layer2Ref} className="absolute inset-0 opacity-0" style={{
          background: 'linear-gradient(180deg, #1a3a6a 0%, #2a5a8f 25%, #4080b0 50%, #5a9ac5 75%, #70aad0 100%)',
        }} />

        {/* Layer 3: Light sky blue */}
        <div ref={layer3Ref} className="absolute inset-0 opacity-0" style={{
          background: 'linear-gradient(180deg, #5a9ec8 0%, #78b8db 25%, #95cfea 50%, #b0dff0 75%, #c8eaf5 100%)',
        }} />

        {/* Layer 4: Near-white (matches the light sections below) */}
        <div ref={layer4Ref} className="absolute inset-0 opacity-0" style={{
          background: 'linear-gradient(180deg, #b8e0f0 0%, #d5edf6 25%, #e8f4f9 50%, #f2f8fb 75%, #f8fafb 100%)',
        }} />

        {/* Stars */}
        <div ref={starsRef} className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() < 0.12 ? 2.5 : 1.2
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 80}%`,
                  opacity: 0.15 + Math.random() * 0.55,
                }}
              />
            )
          })}
        </div>

        {/* Sun glow */}
        <div
          ref={sunGlowRef}
          className="absolute pointer-events-none opacity-0"
          style={{
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(ellipse at center, rgba(255,235,180,0.4) 0%, rgba(255,200,120,0.15) 35%, rgba(255,170,80,0.05) 60%, transparent 80%)',
          }}
        />

        {/* Clouds */}
        <div ref={cloudsRef} className="absolute inset-0 pointer-events-none opacity-0">
          {/* High wispy clouds */}
          <svg className="absolute" style={{ top: '25%', left: '-10%', width: '60%' }} viewBox="0 0 800 150" fill="none">
            <ellipse cx="250" cy="80" rx="200" ry="40" fill="white" opacity="0.4" />
            <ellipse cx="450" cy="65" rx="250" ry="50" fill="white" opacity="0.5" />
            <ellipse cx="650" cy="85" rx="150" ry="35" fill="white" opacity="0.3" />
          </svg>

          <svg className="absolute" style={{ top: '35%', right: '-15%', width: '55%' }} viewBox="0 0 700 130" fill="none">
            <ellipse cx="180" cy="70" rx="160" ry="40" fill="white" opacity="0.35" />
            <ellipse cx="380" cy="55" rx="200" ry="50" fill="white" opacity="0.5" />
            <ellipse cx="560" cy="75" rx="140" ry="35" fill="white" opacity="0.3" />
          </svg>

          {/* Mid-level cumulus */}
          <svg className="absolute" style={{ top: '50%', left: '5%', width: '50%' }} viewBox="0 0 600 160" fill="none">
            <ellipse cx="150" cy="90" rx="130" ry="45" fill="white" opacity="0.5" />
            <ellipse cx="300" cy="70" rx="180" ry="60" fill="white" opacity="0.65" />
            <ellipse cx="470" cy="95" rx="120" ry="40" fill="white" opacity="0.45" />
          </svg>

          <svg className="absolute" style={{ top: '55%', right: '0%', width: '45%' }} viewBox="0 0 550 140" fill="none">
            <ellipse cx="120" cy="75" rx="110" ry="40" fill="white" opacity="0.4" />
            <ellipse cx="300" cy="65" rx="170" ry="55" fill="white" opacity="0.6" />
            <ellipse cx="460" cy="80" rx="90" ry="35" fill="white" opacity="0.35" />
          </svg>

          {/* Low thick cloud layer — covers the bottom */}
          <svg className="absolute" style={{ top: '68%', left: '-15%', width: '130%' }} viewBox="0 0 1500 250" fill="none">
            <ellipse cx="150" cy="130" rx="250" ry="100" fill="white" opacity="0.6" />
            <ellipse cx="400" cy="110" rx="300" ry="110" fill="white" opacity="0.7" />
            <ellipse cx="700" cy="140" rx="250" ry="90" fill="white" opacity="0.6" />
            <ellipse cx="950" cy="120" rx="280" ry="105" fill="white" opacity="0.7" />
            <ellipse cx="1200" cy="135" rx="250" ry="95" fill="white" opacity="0.6" />
            <ellipse cx="1400" cy="125" rx="200" ry="85" fill="white" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
