'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'
import { useAccessibility } from '@/components/AccessibilityProvider'

// Growing lotus visualization based on form progress
function GrowingPlant({ progress }: { progress: number }) {
  const stage = Math.min(Math.floor(progress), 4)

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 240 340"
        className="w-full h-full max-h-[500px]"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(26, 54, 93, 0.15))' }}
      >
        <defs>
          <linearGradient id="waterDeep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A9EB0" />
            <stop offset="100%" stopColor="#3D7A8A" />
          </linearGradient>
          <linearGradient id="waterSurface" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#88C4D4" />
            <stop offset="100%" stopColor="#6AAFBF" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3D6B4A" />
            <stop offset="50%" stopColor="#4A7C59" />
            <stop offset="100%" stopColor="#5A9E6B" />
          </linearGradient>
          <radialGradient id="lilyPadGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#8BC86A" />
            <stop offset="100%" stopColor="#5A9E3E" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9FD47A" />
            <stop offset="50%" stopColor="#7BBF5A" />
            <stop offset="100%" stopColor="#5A9E3E" />
          </linearGradient>
          <linearGradient id="petalOuter" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#E8A0B4" />
            <stop offset="60%" stopColor="#F0C0D0" />
            <stop offset="100%" stopColor="#F8DCE6" />
          </linearGradient>
          <linearGradient id="petalMid" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#F0B8CA" />
            <stop offset="100%" stopColor="#FCE8EF" />
          </linearGradient>
          <linearGradient id="petalInner" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#F8D4DE" />
            <stop offset="100%" stopColor="#FFF0F4" />
          </linearGradient>
          <radialGradient id="lotusCenter" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FFE88A" />
            <stop offset="60%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#F9A825" />
          </radialGradient>
          <linearGradient id="budGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#5A9E6B" />
            <stop offset="50%" stopColor="#D4708A" />
            <stop offset="100%" stopColor="#E8A0B4" />
          </linearGradient>
        </defs>

        {/* ===== POND ===== */}
        <motion.path
          d="M15 272 Q15 330 120 335 Q225 330 225 272 Q225 258 120 252 Q15 258 15 272 Z"
          fill="url(#waterDeep)"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: '120px 290px' }}
        />
        <motion.ellipse
          cx="120" cy="262" rx="108" ry="14"
          fill="url(#waterSurface)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        {/* Shimmer */}
        <motion.ellipse
          cx="120" cy="260" rx="90" ry="8"
          fill="none"
          stroke="rgba(180, 220, 230, 0.5)"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Ripples */}
        {[
          { cx: 75, cy: 265, rx: 12, ry: 3, delay: 0.5 },
          { cx: 165, cy: 263, rx: 10, ry: 2.5, delay: 1.2 },
          { cx: 120, cy: 268, rx: 15, ry: 3.5, delay: 2.0 },
        ].map((r, i) => (
          <motion.ellipse
            key={`ripple-${i}`}
            cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.2, 1.5] }}
            transition={{ duration: 3, delay: r.delay, repeat: Infinity, repeatDelay: 2 }}
            style={{ transformOrigin: `${r.cx}px ${r.cy}px` }}
          />
        ))}
        {/* Pond edge stones */}
        {[
          { cx: 35, cy: 268, rx: 8, ry: 5 },
          { cx: 55, cy: 256, rx: 6, ry: 4 },
          { cx: 195, cy: 258, rx: 7, ry: 4.5 },
          { cx: 212, cy: 267, rx: 6, ry: 4 },
        ].map((s, i) => (
          <motion.ellipse
            key={`stone-${i}`}
            cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry}
            fill="#9E9E8A"
            stroke="#8A8A78"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          />
        ))}

        {/* ===== STAGE 0: Seed beneath water ===== */}
        {stage === 0 && (
          <>
            <motion.ellipse
              cx="120" cy="280" rx="7" ry="4"
              fill="#5A7A5A"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
            />
            <motion.path
              d="M120 284 Q118 290 115 295"
              stroke="#4A6A4A" strokeWidth="1" fill="none" opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
          </>
        )}

        {/* ===== STEM ===== */}
        <motion.path
          d="M120 260 Q118 240 120 220"
          stroke="url(#stemGrad)" strokeWidth="4" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: stage >= 1 ? 1 : 0, opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.path
          d="M120 220 Q122 195 119 170"
          stroke="url(#stemGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: stage >= 2 ? 1 : 0, opacity: stage >= 2 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />
        <motion.path
          d="M119 170 Q117 140 120 110"
          stroke="url(#stemGrad)" strokeWidth="3" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: stage >= 3 ? 1 : 0, opacity: stage >= 3 ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M120 110 Q121 90 120 72"
          stroke="url(#stemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: stage >= 4 ? 1 : 0, opacity: stage >= 4 ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        />

        {/* ===== LILY PADS ===== */}
        {stage >= 1 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: 'spring' }}
            style={{ transformOrigin: '72px 262px' }}
          >
            <ellipse cx="72" cy="262" rx="22" ry="7" fill="url(#lilyPadGrad)" />
            <path d="M72 255 L78 262 L72 262 Z" fill="url(#waterSurface)" />
            <path d="M60 262 Q72 258 84 262" stroke="#4A8A30" strokeWidth="0.5" fill="none" opacity="0.4" />
          </motion.g>
        )}
        {stage >= 2 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
            style={{ transformOrigin: '170px 264px' }}
          >
            <ellipse cx="170" cy="264" rx="18" ry="6" fill="url(#lilyPadGrad)" />
            <path d="M170 258 L175 264 L170 264 Z" fill="url(#waterSurface)" />
          </motion.g>
        )}
        {stage >= 3 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: 'spring' }}
            style={{ transformOrigin: '48px 266px' }}
          >
            <ellipse cx="48" cy="266" rx="14" ry="5" fill="url(#lilyPadGrad)" opacity="0.8" />
            <path d="M48 261 L52 266 L48 266 Z" fill="url(#waterSurface)" />
          </motion.g>
        )}

        {/* ===== LOTUS LEAVES ===== */}
        {stage >= 1 && (
          <>
            <motion.path
              d="M120 230 Q90 215 75 190 Q92 200 108 218 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
              style={{ transformOrigin: '120px 230px' }}
            />
            <motion.path
              d="M116 226 Q95 212 82 196"
              stroke="#5A9E3E" strokeWidth="0.7" fill="none" opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            <motion.path
              d="M120 225 Q150 210 168 188 Q148 202 132 218 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, type: 'spring' }}
              style={{ transformOrigin: '120px 225px' }}
            />
          </>
        )}
        {stage >= 2 && (
          <>
            <motion.path
              d="M120 190 Q78 168 60 130 Q80 152 100 172 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, type: 'spring' }}
              style={{ transformOrigin: '120px 190px' }}
            />
            <motion.path
              d="M115 186 Q85 165 68 140"
              stroke="#5A9E3E" strokeWidth="0.6" fill="none" opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            <motion.path
              d="M121 180 Q162 155 175 118 Q155 142 138 168 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8, type: 'spring' }}
              style={{ transformOrigin: '121px 180px' }}
            />
          </>
        )}
        {stage >= 3 && (
          <>
            <motion.path
              d="M119 148 Q78 128 62 92 Q80 112 104 136 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.7, delay: 0.7, type: 'spring' }}
              style={{ transformOrigin: '119px 148px' }}
            />
            <motion.path
              d="M121 138 Q160 115 172 80 Q152 102 135 126 Z"
              fill="url(#leafGrad)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.7, delay: 0.9, type: 'spring' }}
              style={{ transformOrigin: '121px 138px' }}
            />
          </>
        )}

        {/* ===== STAGE 3: Closed bud ===== */}
        {stage === 3 && (
          <motion.path
            d="M120 112 Q113 95 116 80 Q118 74 120 70 Q122 74 124 80 Q127 95 120 112 Z"
            fill="url(#budGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0, type: 'spring' }}
            style={{ transformOrigin: '120px 95px' }}
          />
        )}

        {/* ===== STAGE 4: LOTUS BLOOM ===== */}
        {stage >= 4 && (
          <>
            {/* Calyx */}
            <motion.path
              d="M120 75 Q112 68 108 58 Q115 63 120 70 Q125 63 132 58 Q128 68 120 75 Z"
              fill="#4A8A30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              style={{ transformOrigin: '120px 68px' }}
            />

            {/* Outer petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.g key={`outer-${i}`} transform={`rotate(${angle} 120 55)`}>
                <motion.path
                  d="M120 55 C108 40 106 22 120 4 C134 22 132 40 120 55 Z"
                  fill="url(#petalOuter)"
                  stroke="#D4708A"
                  strokeWidth="0.3"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.07, type: 'spring', stiffness: 180 }}
                  style={{ transformOrigin: '120px 55px' }}
                />
              </motion.g>
            ))}

            {/* Middle petals */}
            {[30, 90, 150, 210, 270, 330].map((angle, i) => (
              <motion.g key={`mid-${i}`} transform={`rotate(${angle} 120 55)`}>
                <motion.path
                  d="M120 55 C111 44 110 30 120 16 C130 30 129 44 120 55 Z"
                  fill="url(#petalMid)"
                  stroke="#E8A0B4"
                  strokeWidth="0.3"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 0.4, delay: 1.8 + i * 0.06, type: 'spring' }}
                  style={{ transformOrigin: '120px 55px' }}
                />
              </motion.g>
            ))}

            {/* Inner petals */}
            {[15, 87, 159, 231, 303].map((angle, i) => (
              <motion.g key={`inner-${i}`} transform={`rotate(${angle} 120 55)`}>
                <motion.path
                  d="M120 55 C114 48 114 38 120 28 C126 38 126 48 120 55 Z"
                  fill="url(#petalInner)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 0.4, delay: 2.2 + i * 0.05, type: 'spring' }}
                  style={{ transformOrigin: '120px 55px' }}
                />
              </motion.g>
            ))}

            {/* Golden center */}
            <motion.circle
              cx="120" cy="52" r="9"
              fill="url(#lotusCenter)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 2.5, type: 'spring', stiffness: 300 }}
            />
            {/* Center seed pods */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              return (
                <motion.circle
                  key={`seed-${angle}`}
                  cx={120 + Math.cos(rad) * 4.5}
                  cy={52 + Math.sin(rad) * 4.5}
                  r="1.3"
                  fill="#E6A800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.7 + i * 0.04 }}
                />
              )
            })}
            <motion.circle
              cx="120" cy="52" r="1.5"
              fill="#D4940A"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.9 }}
            />

            {/* Sparkles */}
            {[
              { x: 88, y: 35, delay: 2.8 },
              { x: 155, y: 40, delay: 2.9 },
              { x: 95, y: 72, delay: 3.0 },
              { x: 148, y: 65, delay: 3.1 },
              { x: 120, y: 22, delay: 3.2 },
            ].map((s, i) => (
              <motion.circle
                key={`glow-${i}`}
                cx={s.x} cy={s.y} r="2"
                fill="#FFE082"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 0], opacity: [0, 0.7, 0] }}
                transition={{ duration: 2, delay: s.delay, repeat: Infinity, repeatDelay: 2.5 }}
              />
            ))}
          </>
        )}

        {/* Water surface overlay for emergence effect */}
        <motion.ellipse
          cx="120" cy="262" rx="108" ry="14"
          fill="url(#waterSurface)"
          opacity="0.35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </svg>
    </div>
  )
}

/** Encode HTML entities to neutralize script tags and HTML in user input */
function sanitizeInput(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const WEB3FORMS_KEY = '086aed69-5d8c-4990-9d2b-24fe17167fb5'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { getContextualCTA } = usePersonalizationStore()
  const { reducedMotion } = useAccessibility()

  // Cleanup reset timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // Calculate form progress
  const formProgress = useMemo(() => {
    let count = 0
    if (formData.name.trim()) count++
    if (formData.email.trim()) count++
    if (formData.organization.trim()) count++
    if (formData.message.trim()) count++
    return count
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (formStatus !== 'idle') return

    setFormStatus('submitting')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New enquiry from ${formData.name}`,
          from_name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          organization: sanitizeInput(formData.organization),
          message: sanitizeInput(formData.message),
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Submission failed')

      setFormStatus('success')

      // Clear any pending reset timer before setting a new one
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = setTimeout(() => {
        setFormStatus('idle')
        setFormData({ name: '', email: '', organization: '', message: '' })
        resetTimerRef.current = null
      }, 5000)
    } catch {
      setFormStatus('error')

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = setTimeout(() => {
        setFormStatus('idle')
        resetTimerRef.current = null
      }, 4000)
    }
  }, [formStatus, formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const inputClasses = "w-full px-4 md:px-5 py-3 md:py-4 min-h-[44px] bg-background-card border-2 border-sage-100 rounded-button text-text-body placeholder-text-muted focus-visible:border-sage-400 transition-all duration-300"

  return (
    <section
      id="contact"
      aria-label="Contact us"
      className="relative py-8 md:py-12 lg:py-16 section-cream overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 topographic-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={reducedMotion ? false : { opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.span
              className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
            >
              Start a Conversation
            </motion.span>
            <h2 className="text-title font-bold mb-6">
              Let&apos;s <span className="gradient-text">Grow</span> Together
            </h2>
            <p className="text-subtitle text-text-body leading-relaxed max-w-2xl mx-auto">
              Ready to transform your project? Ready to make an impact? We&apos;d love to hear about it.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Growing Plant Visualization */}
            <motion.div
              className="hidden lg:flex glass rounded-panel p-6 items-center justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <GrowingPlant progress={formProgress} />
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {formStatus === 'success' ? (
                <motion.div
                  role="status"
                  aria-live="polite"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass rounded-panel p-12 text-center"
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-sage-600">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-text-heading mb-2">Message Sent!</h3>
                  <p className="text-text-body">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : formStatus === 'error' ? (
                <motion.div
                  role="alert"
                  aria-live="assertive"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="glass rounded-panel p-12 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-red-500">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-text-heading mb-2">Something went wrong</h3>
                  <p className="text-text-body">
                    Please try again, or email us directly at{' '}
                    <a href="mailto:contact@suvigya.org" className="text-sage-600 underline">contact@suvigya.org</a>.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} aria-label="Contact form" className="glass rounded-panel p-5 md:p-8 lg:p-10 space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-body mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-body mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-text-body mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-body mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClasses} resize-none`}
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={formStatus !== 'idle'}
                    className="w-full btn-primary py-3 md:py-4 min-h-[44px] text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          style={{ willChange: 'transform' }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </form>
              )}

              {/* Contact Info */}
              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
              >
                <a
                  href="mailto:contact@suvigya.org"
                  className="text-text-muted hover:text-sage-600 transition-colors py-2 min-h-[44px] inline-flex items-center"
                >
                  contact@suvigya.org
                </a>
                <span className="text-sage-300 hidden md:inline items-center">|</span>
                <a
                  href="tel:+919900393800"
                  className="text-text-muted hover:text-sage-600 transition-colors py-2 min-h-[44px] inline-flex items-center"
                >
                  +91 9900 393 800
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
