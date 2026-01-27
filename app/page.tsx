'use client'

import { useEffect, Suspense } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import PartnersSection from '@/components/sections/PartnersSection'
import ImpactSection from '@/components/sections/ImpactSection'
import ContactSection from '@/components/sections/ContactSection'
import ScrollProgress from '@/components/ScrollProgress'
import LoadingScreen from '@/components/LoadingScreen'
import SkeletonLoader from '@/components/SkeletonLoader'
import Footer from '@/app/footer'
import { usePersonalizationStore } from '@/store/personalization'

export default function Home() {
  const { initializeSession } = usePersonalizationStore()

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Suspense fallback={<SkeletonLoader className="h-screen" />}>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <PartnersSection />
        <ImpactSection />
        <ContactSection />
        <Footer />
      </Suspense>
    </>
  )
}
