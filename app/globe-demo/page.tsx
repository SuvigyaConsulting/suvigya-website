'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ProjectDetail from '@/components/globe/ProjectDetail'
import { projectLocations, type ProjectLocation } from '@/components/globe/ProjectPins'

// Single dynamic import of the entire 3D scene — avoids issues with named exports
const GlobeScene = dynamic(() => import('@/components/globe/GlobeScene'), { ssr: false })

type Phase = 'particles' | 'morphing' | 'globe'

export default function GlobeDemo() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('particles')
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)
  const [initializingVisible, setInitializingVisible] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleExplore = useCallback(() => {
    setPhase('morphing')
    setInitializingVisible(true)
    setTimeout(() => setInitializingVisible(false), 1200)
    setTimeout(() => setPhase('globe'), 2800)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedProject(null)
    setPhase('particles') // Direct — ParticleField un-morphs from sphere state
  }, [])

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
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20,184,166,0.3); }
          50% { box-shadow: 0 0 40px rgba(20,184,166,0.5), 0 0 60px rgba(20,184,166,0.2); }
        }
      `}</style>

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
          <span className="text-[#f0f2f5] font-bold text-xl tracking-wider pointer-events-auto">
            SUVIGYA
          </span>
          {phase === 'globe' && (
            <button
              onClick={handleBack}
              className="pointer-events-auto text-xs font-semibold tracking-[0.2em] uppercase text-[#8892a8] hover:text-[#f0f2f5] transition-all duration-300 flex items-center gap-2 bg-white/[0.05] backdrop-blur px-4 py-2 rounded-lg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to overview
            </button>
          )}
        </div>

        {/* Center content — particles phase */}
        {phase === 'particles' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#14b8a6] mb-6">
              Natural Resource Management Consultancy
            </p>
            <h1
              className="font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[#f0f2f5] mb-4"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
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
              className="pointer-events-auto group relative px-8 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: '#080d1a',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              Explore Our Projects
            </button>

            <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] tracking-[0.2em] uppercase text-white/20">
              World Bank &middot; ADB &middot; FAO &middot; GCF &middot; GIZ &middot; KfW &middot; NABARD
            </p>
          </div>
        )}

        {/* Morphing phase */}
        {phase === 'morphing' && initializingVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm tracking-[0.3em] uppercase text-[#14b8a6] animate-pulse">
              Initializing&hellip;
            </p>
          </div>
        )}

        {/* Globe phase instructions */}
        {phase === 'globe' && !selectedProject && (
          <>
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4a5568] animate-pulse flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                Click a pin to explore a project
              </p>
            </div>
            <div className="absolute bottom-8 left-6">
              <p className="text-[10px] tracking-wider text-white/15">
                8 projects across 5 countries
              </p>
            </div>
          </>
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
    </div>
  )
}
