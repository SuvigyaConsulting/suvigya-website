'use client'

import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import ParticleHero from '@/components/sections/ParticleHero'
import SkyTransition from '@/components/sections/SkyTransition'
import AboutSection from '@/components/sections/AboutSection'

const ApproachSection = dynamic(() => import('@/components/sections/ApproachSection'), {
  ssr: false,
  loading: () => <div id="approach" className="min-h-[30vh]" />,
})
const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), {
  ssr: false,
  loading: () => <div id="services" className="min-h-[50vh]" />,
})
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection'), {
  ssr: false,
  loading: () => <div id="projects" className="min-h-[50vh]" />,
})
const PartnersSection = dynamic(() => import('@/components/sections/PartnersSection'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh]" />,
})
const ImpactSection = dynamic(() => import('@/components/sections/ImpactSection'), {
  ssr: false,
  loading: () => <div id="impact" className="min-h-[50vh]" />,
})
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  ssr: false,
  loading: () => <div id="contact" className="min-h-[50vh]" />,
})
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import ErrorBoundary from '@/components/ErrorBoundary'
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

      {/* Light sections — the organic website below the atmosphere */}
      <Suspense fallback={null}>
        <AboutSection />
        <ApproachSection />
        <div className="relative h-px max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
        </div>
        <ServicesSection />
        <ProjectsSection />
        <PartnersSection />
        <div className="relative h-px max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
        </div>
        <ImpactSection />
        <div className="relative h-px max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-200/60 to-transparent" />
        </div>
        <ContactSection />
        <Footer />
      </Suspense>
    </>
  )
}
