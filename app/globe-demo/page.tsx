'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import ProjectDetail from '@/components/globe/ProjectDetail'
import { projectLocations, type ProjectLocation } from '@/components/globe/ProjectPins'

const GlobeScene = dynamic(() => import('@/components/globe/GlobeScene'), { ssr: false })

type Phase = 'particles' | 'morphing' | 'globe'

export default function GlobeDemo() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('particles')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Prefetch home route so SPA navigation on back is instant
  useEffect(() => {
    router.prefetch('/')
  }, [router])

  // Simple cinematic: deep space → morph → earth
  useEffect(() => {
    if (!mounted) return
    const t: ReturnType<typeof setTimeout>[] = []

    // After 2s in deep space, begin morph
    t.push(setTimeout(() => setPhase('morphing'), 2000))

    // Earth forms (morph takes 3.5s, so globe at 5.5s)
    t.push(setTimeout(() => setPhase('globe'), 5800))

    // UI ready
    t.push(setTimeout(() => setReady(true), 7500))

    return () => t.forEach(clearTimeout)
  }, [mounted])

  const handleBack = useCallback(() => {
    if (exiting) return
    setSelectedProject(null)
    setReady(false)
    setExiting(true)         // fade dark scrim in over 1.2s
    setPhase('particles')    // morph globe → particles in parallel under the scrim
    setTimeout(() => {
      router.push('/')       // SPA navigate while scrim fully covers — no flash
    }, 1200)
  }, [exiting, router])

  const handlePinClick = useCallback((projectId: number) => {
    const project = projectLocations.find(p => p.id === projectId) || null
    setSelectedProject(project)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const handleNavigate = useCallback((projectId: number) => {
    const project = projectLocations.find(p => p.id === projectId) || null
    setSelectedProject(project)
  }, [])

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0f1629 0%, #080d1a 70%)',
      }}
    >
      {/* Three.js Scene */}
      {mounted && (
        <div className="absolute inset-0">
          <GlobeScene phase={phase} onPinClick={handlePinClick} selectedProjectId={selectedProject?.id ?? null} />
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <span
            className="text-white font-bold text-xl tracking-[0.15em] pointer-events-auto"
            style={{ opacity: ready ? 1 : 0, transition: 'opacity 1.5s ease' }}
          >
            SUVIGYA
          </span>
          <button
            onClick={handleBack}
            disabled={exiting}
            className="pointer-events-auto text-[13px] font-medium tracking-[0.08em] text-white/40 hover:text-white transition-all duration-300 flex items-center gap-2 bg-white/[0.05] backdrop-blur px-4 py-2.5 rounded-sm disabled:cursor-not-allowed"
            style={{ opacity: ready && !exiting ? 1 : 0, transition: 'opacity 1.5s ease' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Ready hint */}
        {ready && !selectedProject && (
          <div
            className="absolute bottom-8 left-0 right-0 text-center"
            style={{ animation: 'fadeIn 1.5s ease forwards' }}
          >
            <p className="text-[11px] tracking-[0.15em] text-white/20">
              Select a location to explore
            </p>
          </div>
        )}
      </div>

      {/* Project detail panel */}
      <ProjectDetail
        project={selectedProject}
        onClose={handleCloseDetail}
        onNavigate={handleNavigate}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to top, #080d1a 0%, transparent 100%)',
        }}
      />

      {/* Exit scrim: dark cover that fades in before SPA-navigating to home, hiding the route swap */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[60]"
        style={{
          background: '#080d1a',
          opacity: exiting ? 1 : 0,
          transition: 'opacity 1.2s ease-in',
        }}
      />
    </div>
  )
}
