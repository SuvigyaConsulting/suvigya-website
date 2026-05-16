'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import ProjectDetail from '@/components/globe/ProjectDetail'
import { projectLocations, type ProjectLocation } from '@/components/globe/ProjectPins'

const GlobeScene = dynamic(() => import('@/components/globe/GlobeScene'), { ssr: false })

type Phase = 'particles' | 'morphing' | 'globe'

// Translations of "Inspiring Solutions"
const translations = [
  { text: 'Inspiring Solutions', lang: 'English' },
  { text: 'प्रेरणादायक समाधान', lang: 'Hindi' },
  { text: 'ಸ್ಫೂರ್ತಿದಾಯಕ ಪರಿಹಾರ', lang: 'Kannada' },
  { text: 'Solutions Inspirantes', lang: 'French' },
  { text: '启发性方案', lang: 'Chinese' },
  { text: 'حلول ملهمة', lang: 'Arabic' },
  { text: 'অনুপ্রেরণামূলক সমাধান', lang: 'Bengali' },
]

const glyphChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

function ScrambleText() {
  const [displayText, setDisplayText] = useState(translations[0].text)
  const indexRef = useRef(0)
  const frameRef = useRef<number>(0)
  const currentTextRef = useRef(translations[0].text)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const scrambleTo = (targetText: string) => {
      const sourceText = currentTextRef.current
      const maxLen = Math.max(sourceText.length, targetText.length)
      const duration = 1200
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)

        let result = ''
        for (let i = 0; i < maxLen; i++) {
          const charProgress = (progress * maxLen - i) / 3
          if (charProgress >= 1) {
            result += i < targetText.length ? targetText[i] : ''
          } else if (charProgress > 0) {
            result += glyphChars[Math.floor(Math.random() * glyphChars.length)]
          } else {
            result += i < sourceText.length ? sourceText[i] : ' '
          }
        }

        setDisplayText(result)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setDisplayText(targetText)
          currentTextRef.current = targetText
          scheduleNext()
        }
      }

      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }

    const scheduleNext = () => {
      timeout = setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % translations.length
        scrambleTo(translations[indexRef.current].text)
      }, 3000)
    }

    scheduleNext()

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <span className="inline-block min-w-[200px]" aria-label="Inspiring Solutions">
      {displayText}
    </span>
  )
}

export default function ParticleHero() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<Phase>('particles')
  const [exploring, setExploring] = useState(false)
  const [fadingBack, setFadingBack] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectLocation | null>(null)
  const [globeReady, setGlobeReady] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleExplore = useCallback(() => {
    setExploring(true)
    // Scroll to top so the globe fills the viewport
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Start morph after a brief pause
    setTimeout(() => setPhase('morphing'), 300)
    setTimeout(() => {
      setPhase('globe')
      setGlobeReady(true)
    }, 4000)
  }, [])

  const handleBack = useCallback(() => {
    setSelectedProject(null)
    setGlobeReady(false)
    // Morph globe → particles in place; the same canvas + matching viewport size
    // means the un-fix at the end is visually invisible (no fade needed, no reveal of sections below).
    setPhase('particles')
    setTimeout(() => {
      setExploring(false)
    }, 1800)
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
    <>
      <section
        id="home"
        className="relative h-screen overflow-hidden transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #0f1629 0%, #080d1a 70%)',
          ...(exploring ? { position: 'fixed', inset: 0, zIndex: 100 } : {}),
          opacity: fadingBack ? 0 : 1,
        }}
      >
        {/* Single Three.js canvas — particles AND globe, same instance */}
        {mounted && (
          <div className="absolute inset-0">
            <GlobeScene phase={phase} onPinClick={handlePinClick} selectedProjectId={selectedProject?.id ?? null} />
          </div>
        )}

        {/* Hero UI — visible when NOT exploring */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700"
          style={{ opacity: exploring ? 0 : 1 }}
        >
          <h1 className="font-bold text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] tracking-[0.04em] text-white mb-6">
            SUVIGYA
          </h1>

          <div className="h-8 flex items-center justify-center mb-7">
            <p className="text-white text-[clamp(0.75rem,2.5vw,1.5rem)] tracking-[0.05em] font-medium">
              <ScrambleText />
            </p>
          </div>

          <div className="w-10 h-px bg-white/20 mb-6 mx-auto" />

          <p className="text-[11px] font-medium tracking-[0.15em] text-white/35 mb-4">
            Natural Resource Management Consultancy
          </p>
          <p className="text-white/35 text-[13px] max-w-md mx-auto mb-10 leading-relaxed">
            Shaping tomorrow&apos;s earth with innovative solutions today.
            Specialist advisory and implementation across climate,
            natural resources, and sustainable development.
          </p>

          <button
            onClick={handleExplore}
            className="pointer-events-auto group inline-flex items-center gap-3 px-7 py-3.5 border border-white/15 rounded-sm text-white/50 text-[13px] font-medium tracking-[0.08em] transition-all duration-500 hover:border-white/35 hover:text-white/75 hover:bg-white/5"
          >
            Explore Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Globe UI — visible when exploring */}
        {exploring && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
              <span
                className="text-white font-bold text-xl tracking-[0.15em]"
                style={{ opacity: globeReady ? 1 : 0, transition: 'opacity 1.5s ease' }}
              >
                SUVIGYA
              </span>
              <button
                onClick={handleBack}
                className="pointer-events-auto text-[13px] font-medium tracking-[0.08em] text-white/40 hover:text-white transition-all duration-300 flex items-center gap-2 bg-white/[0.05] backdrop-blur px-4 py-2.5 rounded-sm"
                style={{ opacity: globeReady ? 1 : 0, transition: 'opacity 1.5s ease' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            {/* Hint */}
            {globeReady && !selectedProject && (
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[11px] tracking-[0.15em] text-white/20" style={{ animation: 'fadeIn 1.5s ease forwards' }}>
                  Select a location to explore
                </p>
              </div>
            )}
          </div>
        )}

        {/* Project detail panel */}
        {exploring && (
          <ProjectDetail
            project={selectedProject}
            onClose={handleCloseDetail}
            onNavigate={handleNavigate}
          />
        )}

        {/* Bottom gradient */}
        {exploring && (
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[5]"
            style={{ background: 'linear-gradient(to top, #080d1a 0%, transparent 100%)' }}
          />
        )}
      </section>

      {/* Spacer when exploring (section is fixed, so page content shifts up) */}
      {exploring && <div className="h-screen" />}
    </>
  )
}
