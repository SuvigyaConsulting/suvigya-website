'use client'

import { useEffect } from 'react'
import ParticleHero from '@/components/sections/ParticleHero'
import SkyTransition from '@/components/sections/SkyTransition'
import AboutSection from '@/components/sections/AboutSection'
import ApproachSection from '@/components/sections/ApproachSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ImpactSection from '@/components/sections/ImpactSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import { usePersonalizationStore } from '@/store/personalization'

export default function Home() {
  const { initializeSession } = usePersonalizationStore()

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  return (
    <>
      <ScrollProgress />

      {/* Dark space hero with floating particles */}
      <ParticleHero />

      {/* Cinematic night → day transition: stars fade, sky brightens, clouds pass */}
      <SkyTransition />

      {/* Light sections — the organic website below the atmosphere.
          Rendered statically (not lazy) so their full height exists up front;
          lazy-mounting these mid-scroll caused the page to lurch as placeholder
          heights were replaced by taller real content. */}
      <AboutSection />
      <ApproachSection />
      <div className="relative h-px max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
      </div>
      <ServicesSection />
      <div className="relative h-px max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
      </div>
      <ImpactSection />
      <div className="relative h-px max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
      </div>
      <ContactSection />
      <Footer />
    </>
  )
}
