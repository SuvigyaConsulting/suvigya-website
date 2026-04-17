'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ParticleScene = dynamic(() => import('@/components/globe/ParticleScene'), { ssr: false })

export default function ParticleHero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0f1629 0%, #080d1a 70%)',
      }}
    >
      {mounted && (
        <div className="absolute inset-0">
          <ParticleScene />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#14b8a6] mb-8">
          Natural Resource Management Consultancy
        </p>

        <h1
          className="font-bold text-[clamp(3rem,9vw,8rem)] leading-[0.85] tracking-[-0.04em] text-[#f0f2f5] mb-6"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          SHAPING<br />
          <span className="bg-gradient-to-r from-[#14b8a6] to-[#c9a84c] bg-clip-text text-transparent">
            TOMORROW&apos;S
          </span><br />
          EARTH
        </h1>

        <p className="text-[#8892a8] text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          Innovative solutions for natural resource management,
          strategic policy, and sustainable development
        </p>

        <Link
          href="/globe-demo"
          className="group relative px-8 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: '#080d1a',
            boxShadow: '0 0 25px rgba(20, 184, 166, 0.3)',
          }}
        >
          Explore Our Projects
        </Link>

        <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-white/20">
          World Bank &middot; ADB &middot; FAO &middot; GCF &middot; GIZ &middot; KfW &middot; NABARD
        </p>
      </div>
    </section>
  )
}
