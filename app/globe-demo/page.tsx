'use client'

import { useState, useCallback, Suspense, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ProjectDetail from '@/components/globe/ProjectDetail'
import { projectLocations, type ProjectLocation } from '@/components/globe/ProjectPins'

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { ssr: false })
const ParticleField = dynamic(() => import('@/components/globe/ParticleField'), { ssr: false })
const EarthGlobe = dynamic(() => import('@/components/globe/EarthGlobe'), { ssr: false })
const ProjectPins = dynamic(() => import('@/components/globe/ProjectPins'), { ssr: false })

type Phase = 'particles' | 'morphing' | 'globe'

export default function GlobeDemo() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('particles')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleExplore = useCallback(() => {
    setPhase('morphing')
    // After morph animation completes (~2.5s), switch to globe
    setTimeout(() => setPhase('globe'), 2500)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedProject(null)
    setPhase('morphing')
    // Reverse: globe disappears, particles scatter back
    setTimeout(() => setPhase('particles'), 1800)
  }, [])

  const handlePinClick = useCallback((projectId: number) => {
    const project = projectLocations.find(p => p.id === projectId) || null
    setSelectedProject(project)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <div className="relative w-full h-screen bg-[#080d1a] overflow-hidden">
      {/* Three.js Canvas */}
      {mounted && <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#c9a84c" />

        <Suspense fallback={null}>
          {/* Particles — visible during 'particles' and 'morphing' phases */}
          {phase !== 'globe' && (
            <ParticleField morphing={phase === 'morphing'} />
          )}

          {/* Globe — visible during 'globe' phase */}
          <EarthGlobe visible={phase === 'globe'} />

          {/* Project pins — visible when globe is showing */}
          <ProjectPins
            visible={phase === 'globe'}
            globeRadius={2.5}
            onPinClick={handlePinClick}
          />
        </Suspense>
      </Canvas>}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <span className="text-[#f0f2f5] font-bold text-xl tracking-wider pointer-events-auto">
            SUVIGYA
          </span>
          {phase === 'globe' && (
            <button
              onClick={handleBack}
              className="pointer-events-auto text-xs font-semibold tracking-[0.2em] uppercase text-[#8892a8] hover:text-[#f0f2f5] transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to overview
            </button>
          )}
        </div>

        {/* Center content — only in particles phase */}
        {phase === 'particles' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#14b8a6] mb-6">
              Natural Resource Management Consultancy
            </p>
            <h1
              className="font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[#f0f2f5] mb-4"
              style={{ fontFamily: 'var(--font-display, serif)' }}
            >
              SHAPING<br />
              <span className="bg-gradient-to-r from-[#14b8a6] to-[#c9a84c] bg-clip-text text-transparent">
                TOMORROW&apos;S
              </span><br />
              EARTH
            </h1>
            <p className="text-[#8892a8] text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Innovative solutions for natural resource management,
              strategic policy, and sustainable development
            </p>
            <button
              onClick={handleExplore}
              className="pointer-events-auto group relative px-8 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: '#080d1a',
                boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)',
              }}
            >
              Explore Our Projects
            </button>
          </div>
        )}

        {/* Globe phase — instruction text */}
        {phase === 'globe' && !selectedProject && (
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4a5568] animate-pulse">
              Click a pin to explore a project
            </p>
          </div>
        )}
      </div>

      {/* Project detail panel */}
      <ProjectDetail
        project={selectedProject}
        onClose={handleCloseDetail}
      />

      {/* Subtle gradient at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]"
        style={{
          background: 'linear-gradient(to top, #080d1a 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
