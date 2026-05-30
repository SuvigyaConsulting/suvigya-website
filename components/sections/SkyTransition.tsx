'use client'

import { useRef, useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Deterministic pseudo-random */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export default function SkyTransition() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const starsAndParticlesRef = useRef<HTMLDivElement>(null)
  const atmosphereRef = useRef<HTMLDivElement>(null)

  /* ── Stars: bright and plentiful, spread across 60% of height ── */
  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => {
        const bright = seededRandom(i * 3 + 2) < 0.12
        const size = bright
          ? 2.5 + seededRandom(i * 7) * 2
          : 1 + seededRandom(i * 7) * 1.2
        return {
          x: seededRandom(i * 3) * 100,
          y: seededRandom(i * 3 + 1) * 100, // full height of container
          size,
          bright,
          opacity: bright
            ? 0.7 + seededRandom(i * 5) * 0.3
            : 0.2 + seededRandom(i * 5) * 0.4,
        }
      }),
    [],
  )

  /* ── Hero particles bleeding down: teal, white, gold ── */
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => {
        const colorRoll = seededRandom(i * 13 + 7)
        let color: string
        if (colorRoll < 0.45) {
          color = '#14b8a6' // teal
        } else if (colorRoll < 0.75) {
          color = '#e8e4df' // warm white
        } else {
          color = '#c9a84c' // gold
        }
        return {
          x: seededRandom(i * 17) * 100,
          y: seededRandom(i * 17 + 1) * 50, // top half
          size: 2.5 + seededRandom(i * 19) * 2.5,
          opacity: 0.3 + seededRandom(i * 23) * 0.5,
          color,
          duration: 5 + seededRandom(i * 31) * 8,
        }
      }),
    [],
  )

  /* ── Warm the cloud image decode cache on mount ──
     The cloud PNGs are large; decoding them on the main thread the first time
     they paint (as the user scrolls into the transition) causes a one-off frame
     hitch. Decoding them up front — while the hero is still on screen and no
     scroll is happening — keeps the first scroll-through smooth. */
  useEffect(() => {
    const cloudSrcs = [
      '/textures/clouds/cloud4.png',
      '/textures/clouds/cloud5.png',
      '/textures/clouds/cloud-wide.png',
      '/textures/clouds/cloud2.png',
      '/textures/clouds/cloud1.png',
      '/textures/clouds/cloud3.png',
      '/textures/clouds/cloud-panoramic.png',
    ]
    cloudSrcs.forEach((src) => {
      const img = new Image()
      img.src = src
      img.decode?.().catch(() => {})
    })
  }, [])

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

      // Stars + particles fade out together: 10-40% of timeline
      // (delayed start so they're visible for longer)
      tl.to(starsAndParticlesRef.current, { opacity: 0, duration: 0.30 }, 0.10)

      // Cloud atmosphere fades in: 30-65% of the timeline
      tl.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        0.30,
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        height: '120vh',
        // Allow stars to overflow into the section below
        overflow: 'visible',
        background: `linear-gradient(180deg,
          #060a16 0%,
          #0a1326 5%,
          #0e1838 10%,
          #14204c 15%,
          #1b2c63 20%,
          #243a7c 25%,
          #2d4790 29%,
          #38569f 33%,
          #4666b0 37%,
          #5577be 41%,
          #6589c9 45%,
          #769ad3 49%,
          #88abda 53%,
          #9bbce2 57%,
          #afcce9 62%,
          #c3dbf0 67%,
          #d6e6f3 72%,
          #e6eef4 77%,
          #f0eff1 82%,
          #f6f1ec 87%,
          #faf4ee 92%,
          #FAF8F5 97%,
          #FAF8F5 100%
        )`,
      }}
    >
      {/* ── Stars + Particles container (fades together) ── */}
      <div
        ref={starsAndParticlesRef}
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          // Extend 30vh below the section to bleed into About
          height: 'calc(100% + 30vh)',
        }}
      >
        {/* Stars — values rounded to 4 decimals to keep SSR/client strings identical
            (Math.sin floats can drift in the 10th+ decimal across V8 instances) */}
        {stars.map((star, i) => (
          <div
            key={`s${i}`}
            className="absolute rounded-full"
            style={{
              width: `${star.size.toFixed(3)}px`,
              height: `${star.size.toFixed(3)}px`,
              left: `${star.x.toFixed(4)}%`,
              top: `${(star.y * 0.6).toFixed(4)}%`,
              opacity: Number(star.opacity.toFixed(4)),
              backgroundColor: star.bright
                ? '#fff'
                : `rgba(200,215,255,${(0.5 + seededRandom(i * 11) * 0.5).toFixed(4)})`,
              boxShadow: star.bright
                ? `0 0 ${(star.size * 3).toFixed(3)}px rgba(200,220,255,0.6)`
                : 'none',
            }}
          />
        ))}

        {/* Hero particles bleeding down */}
        {particles.map((p, i) => (
          <div
            key={`p${i}`}
            className="absolute rounded-full"
            style={{
              width: `${p.size.toFixed(3)}px`,
              height: `${p.size.toFixed(3)}px`,
              left: `${p.x.toFixed(4)}%`,
              top: `${(p.y * 0.4).toFixed(4)}%`,
              opacity: Number(p.opacity.toFixed(4)),
              backgroundColor: p.color,
              boxShadow: `0 0 ${(p.size * 4).toFixed(3)}px ${p.color}`,
              animation: `pf${i % 4} ${p.duration.toFixed(3)}s ease-in-out infinite`,
              willChange: 'transform',
            }}
          />
        ))}

        <style jsx>{`
          @keyframes pf0 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(6px,-10px)} }
          @keyframes pf1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,-6px)} }
          @keyframes pf2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(10px,5px)} }
          @keyframes pf3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-5px,-12px)} }
        `}</style>
      </div>

      {/* ── Atmospheric cloud layer ── */}
      <div
        ref={atmosphereRef}
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          opacity: 0,
          top: '45%',
          height: '55%',
        }}
      >
        {/* Topmost wisps — very faint */}
        <img
          src="/textures/clouds/cloud4.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '0%',
            left: '15%',
            width: '40%',
            opacity: 0.24,
            maskImage: 'radial-gradient(ellipse 90% 80% at center, black 20%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at center, black 20%, transparent 60%)',
          }}
          draggable={false}
        />
        <img
          src="/textures/clouds/cloud5.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '5%',
            right: '5%',
            width: '35%',
            opacity: 0.2,
            maskImage: 'radial-gradient(ellipse 85% 75% at center, black 25%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at center, black 25%, transparent 65%)',
          }}
          draggable={false}
        />

        {/* Mid-level clouds */}
        <img
          src="/textures/clouds/cloud-wide.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '12%',
            left: '-10%',
            width: '120%',
            opacity: 0.55,
            maskImage: 'linear-gradient(0deg, transparent 0%, black 20%, black 60%, transparent 85%), linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, black 20%, black 60%, transparent 85%), linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in' as any,
          }}
          draggable={false}
        />
        <img
          src="/textures/clouds/cloud2.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '20%',
            right: '-10%',
            width: '55%',
            opacity: 0.48,
            maskImage: 'radial-gradient(ellipse 90% 80% at center, black 30%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at center, black 30%, transparent 65%)',
          }}
          draggable={false}
        />

        {/* Denser layer */}
        <img
          src="/textures/clouds/cloud1.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '28%',
            left: '-5%',
            width: '65%',
            opacity: 0.66,
            maskImage: 'radial-gradient(ellipse 90% 80% at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at center, black 30%, transparent 70%)',
          }}
          draggable={false}
        />
        <img
          src="/textures/clouds/cloud3.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '32%',
            right: '0%',
            width: '70%',
            opacity: 0.66,
            maskImage: 'radial-gradient(ellipse 85% 75% at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at center, black 30%, transparent 70%)',
          }}
          draggable={false}
        />

        {/* Bottom dense layer */}
        <img
          src="/textures/clouds/cloud-panoramic.png"
          alt=""
          decoding="async"
          className="absolute pointer-events-none"
          style={{
            top: '40%',
            left: '-5%',
            width: '110%',
            opacity: 0.8,
            maskImage: 'linear-gradient(0deg, transparent 0%, black 15%, black 70%, transparent 90%), linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, black 15%, black 70%, transparent 90%), linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in' as any,
          }}
          draggable={false}
        />

        {/* Warm floor gradient into About section */}
        <div className="absolute left-0 right-0" style={{
          top: '55%',
          height: '45%',
          background: 'linear-gradient(0deg, rgba(250,248,245,1) 0%, rgba(250,248,245,0.9) 35%, rgba(255,255,255,0.4) 60%, transparent 90%)',
        }} />
      </div>
    </div>
  )
}
