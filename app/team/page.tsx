'use client'

import TeamSection from '@/components/sections/TeamSection'
import Footer from '@/components/Footer'

export default function TeamPage() {
  return (
    <>
      <div className="pt-24 pb-12 text-center" style={{ background: 'radial-gradient(ellipse at 50% 50%, #0f1629 0%, #080d1a 70%)' }}>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#14b8a6] mb-4">Our Team</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#f0f2f5]">The People Behind the Work</h1>
      </div>
      <TeamSection />
      <Footer />
    </>
  )
}
