'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { projectLocations, type ProjectLocation } from './ProjectPins'

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectDetailProps {
  project: ProjectLocation | null
  onClose: () => void
  onNavigate: (locationId: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProjectDetail({ project: location, onClose, onNavigate }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (location) setAnimKey((prev) => prev + 1)
  }, [location])

  useEffect(() => {
    if (!location) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [location, onClose])

  useEffect(() => {
    if (!location || !panelRef.current) return
    panelRef.current.scrollTop = 0
  }, [location])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const isOpen = location !== null

  return (
    <>
      <style jsx>{`
        @keyframes stagger-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stagger-item { opacity: 0; animation: stagger-fade-in 0.5s ease-out forwards; }
      `}</style>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={handleBackdropClick}
          onWheel={(e) => e.stopPropagation()}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={location ? `Projects in ${location.region}` : undefined}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f1629]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 overflow-y-auto"
        // stopPropagation keeps wheel/pointer from reaching the globe's OrbitControls
        // (otherwise scrolling the panel zooms the globe and clicks can be swallowed)
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          overscrollBehavior: 'contain',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Accent line */}
        <div className="w-full h-[2px]" style={{ background: 'linear-gradient(90deg, #3b82f6, #2c5282, #3b82f6)' }} />

        {location && (
          <div key={animKey}>
            {/* Sticky close bar — always reachable, never scrolls away */}
            <div className="sticky top-0 z-30 flex justify-end px-5 pt-5 pointer-events-none">
              <button
                type="button"
                onClick={onClose}
                className="pointer-events-auto rounded-full bg-[#0f1629]/70 backdrop-blur text-[#8892a8] hover:text-white hover:bg-white/[0.12] transition-colors p-2.5"
                aria-label="Close project details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-8 pb-8 -mt-8">
              {/* Location header */}
              <div className="stagger-item flex items-center gap-1.5 mb-2" style={{ animationDelay: '0.05s' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-xs uppercase tracking-[0.15em] text-[#8892a8]">Project Location</span>
              </div>
              <h2 className="stagger-item font-display text-2xl font-bold text-[#f0f2f5] mb-1 leading-tight" style={{ animationDelay: '0.1s' }}>
                {location.region}
              </h2>
              <p className="stagger-item text-sm text-[#4a5568] mb-7" style={{ animationDelay: '0.14s' }}>
                {location.projects.length} {location.projects.length === 1 ? 'engagement' : 'engagements'}
              </p>

              {/* Projects at this location */}
              <div className="space-y-4">
                {location.projects.map((p, i) => (
                  <div
                    key={p.title}
                    className="stagger-item rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    style={{ animationDelay: `${(0.2 + i * 0.05).toFixed(2)}s` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-medium" style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                        {p.client}
                      </span>
                      {p.value && (
                        <span
                          className="font-display text-lg font-bold whitespace-nowrap"
                          style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                        >
                          {p.value}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-semibold text-[#f0f2f5] leading-snug">{p.title}</h3>

                    {p.value && <p className="text-[11px] text-[#4a5568] mt-0.5 mb-2">{p.valueLabel}</p>}

                    <p className={`text-[13px] text-[#8892a8] leading-relaxed mb-3 ${p.value ? '' : 'mt-2'}`}>
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="px-2 py-1 rounded-full text-[10px] font-medium bg-white/[0.05] border border-white/[0.08] text-[#8892a8]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next location navigation */}
              {(() => {
                const currentIndex = projectLocations.findIndex((l) => l.id === location.id)
                const total = projectLocations.length
                const prevIndex = (currentIndex - 1 + total) % total
                const nextIndex = (currentIndex + 1) % total
                return (
                  <div className="stagger-item flex items-center justify-between mt-8 pt-4 border-t border-white/[0.06]" style={{ animationDelay: '0.5s' }}>
                    <button
                      type="button"
                      onClick={() => onNavigate(projectLocations[prevIndex].id)}
                      className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-[#8892a8] hover:text-[#f0f2f5]"
                      aria-label="Previous location"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <span className="text-sm text-[#4a5568]">
                      {currentIndex + 1} of {total}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(projectLocations[nextIndex].id)}
                      className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-[#8892a8] hover:text-[#f0f2f5]"
                      aria-label="Next location"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
