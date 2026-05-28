'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { projectLocations, type ProjectLocation } from './ProjectPins'

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectDetailProps {
  project: ProjectLocation | null
  onClose: () => void
  onNavigate: (projectId: number) => void
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProjectDetail({ project, onClose, onNavigate }: ProjectDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [animKey, setAnimKey] = useState(0)

  // Trigger staggered animation when project changes
  useEffect(() => {
    if (project) {
      setAnimKey((prev) => prev + 1)
    }
  }, [project])

  // Close on Escape key
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  // Trap focus within panel when open
  useEffect(() => {
    if (!project || !panelRef.current) return

    const firstFocusable = panelRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    firstFocusable?.focus()
  }, [project])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  // Single-hue blue gradient for the value figure — teal/gold retired.
  const getValueGradient = (_color: string) =>
    'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)'

  const isOpen = project !== null

  return (
    <>
      {/* Staggered entry animation styles */}
      <style jsx>{`
        @keyframes stagger-fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stagger-item {
          opacity: 0;
          animation: stagger-fade-in 0.5s ease-out forwards;
        }
      `}</style>

      {/* Backdrop (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={project ? project.title : undefined}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0f1629]/95 backdrop-blur-xl border-l border-white/[0.06] z-50 overflow-y-auto"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Teal accent line at top */}
        <div
          className="w-full h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #2c5282, #3b82f6)',
          }}
        />

        {project && (
          <div className="p-8" key={animKey}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#8892a8] hover:text-white transition-colors duration-200 p-1"
              aria-label="Close project details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Client badge */}
            <span
              className="stagger-item inline-block px-3 py-1 rounded-full border text-xs font-medium mb-4"
              style={{
                borderColor: project.color,
                color: project.color,
                animationDelay: '0.05s',
              }}
            >
              {project.client}
            </span>

            {/* Region + year */}
            <div
              className="stagger-item flex items-center gap-3 mb-6"
              style={{ animationDelay: '0.12s' }}
            >
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#4a5568]"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm text-[#4a5568]">{project.region}</span>
              </span>
              <span className="text-[#2c3445]">•</span>
              <span className="text-sm text-[#4a5568]">{project.year}</span>
            </div>

            {/* Title */}
            <h2
              className="stagger-item font-display text-2xl font-bold text-[#f0f2f5] mb-4 leading-tight"
              style={{ animationDelay: '0.18s' }}
            >
              {project.title}
            </h2>

            {/* Value */}
            <p
              className="stagger-item font-display text-5xl font-bold mb-2"
              style={{
                background: getValueGradient(project.color),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animationDelay: '0.25s',
              }}
            >
              {project.value}
            </p>

            {/* Value label */}
            <p
              className="stagger-item text-sm text-[#4a5568] mb-6"
              style={{ animationDelay: '0.3s' }}
            >
              {project.valueLabel}
            </p>

            {/* Description */}
            <p
              className="stagger-item text-[#8892a8] leading-[1.75] mb-8"
              style={{ animationDelay: '0.35s' }}
            >
              {project.description}
            </p>

            {/* Divider */}
            <div
              className="stagger-item w-full h-px bg-white/[0.06] mb-8"
              style={{ animationDelay: '0.4s' }}
            />

            {/* Focus areas */}
            <div className="stagger-item" style={{ animationDelay: '0.45s' }}>
              <p className="text-xs uppercase tracking-[0.15em] text-[#4a5568] mb-3">
                Focus Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-[#8892a8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prev / Next navigation */}
            {(() => {
              const currentIndex = projectLocations.findIndex(p => p.id === project.id)
              const total = projectLocations.length
              const prevIndex = (currentIndex - 1 + total) % total
              const nextIndex = (currentIndex + 1) % total
              return (
                <div
                  className="stagger-item flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]"
                  style={{ animationDelay: '0.5s' }}
                >
                  <button
                    onClick={() => onNavigate(projectLocations[prevIndex].id)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-[#8892a8] hover:text-[#f0f2f5]"
                    aria-label="Previous project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <span className="text-sm text-[#4a5568]">
                    {currentIndex + 1} of {total}
                  </span>
                  <button
                    onClick={() => onNavigate(projectLocations[nextIndex].id)}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors text-[#8892a8] hover:text-[#f0f2f5]"
                    aria-label="Next project"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </>
  )
}
