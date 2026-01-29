'use client'

import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'

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
        <Footer />
      </Suspense>
    </>
  )
}
