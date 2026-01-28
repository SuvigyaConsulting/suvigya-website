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
import ErrorBoundary from '@/components/ErrorBoundary'
import SkeletonLoader from '@/components/SkeletonLoader'
import { usePersonalizationStore } from '@/store/personalization'

export default function Home() {
  const { initializeSession } = usePersonalizationStore()

  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  return (
    <>
      <ErrorBoundary componentName="LoadingScreen" fallback={null}>
        <LoadingScreen />
      </ErrorBoundary>
      <ScrollProgress />
      <Suspense fallback={<SkeletonLoader className="h-screen" />}>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <PartnersSection />
        <ImpactSection />
        <ContactSection />
      </Suspense>
    </>
  )
}
