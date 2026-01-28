'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'

// Growing plant visualization based on form progress
function GrowingPlant({ progress }: { progress: number }) {
  const stage = Math.min(Math.floor(progress), 4)

  return (
    <div className="relative w-full h-full flex items-end justify-center pb-4">
      <svg
        viewBox="0 0 240 340"
        className="w-56 h-80"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(74, 124, 89, 0.15))' }}
      >
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#A0724A" />
          </linearGradient>
          <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C49660" />
            <stop offset="100%" stopColor="#8B6340" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C4A2E" />
            <stop offset="100%" stopColor="#3D3020" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A9E6B" />
            <stop offset="40%" stopColor="#4A7C59" />
            <stop offset="100%" stopColor="#3D6B4A" />
          </linearGradient>
          <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9FD47A" />
            <stop offset="50%" stopColor="#7BBF5A" />
            <stop offset="100%" stopColor="#5A9E3E" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B5E4A0" />
            <stop offset="50%" stopColor="#8CD470" />
            <stop offset="100%" stopColor="#6BBF4E" />
          </linearGradient>
          <radialGradient id="bloomCenter" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FFCA28" />
          </radialGradient>
          <radialGradient id="petalGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#F8F0E0" />
            <stop offset="40%" stopColor="#F0E6D2" />
            <stop offset="100%" stopColor="#E8D8BE" />
          </radialGradient>
        </defs>

        {/* Pot body */}
        <motion.path
          d="M72 280 L82 318 L158 318 L168 280 Z"
          fill="url(#potGrad)"
          stroke="#8B6340"
          strokeWidth="1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        {/* Pot rim */}
        <motion.path
          d="M65 272 L72 282 L168 282 L175 272 L170 266 L70 266 Z"
          fill="url(#potRim)"
          stroke="#7A5535"
          strokeWidth="0.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        />
        {/* Pot base */}
        <motion.path
          d="M86 318 L90 326 L150 326 L154 318 Z"
          fill="#8B6340"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Pot texture lines */}
        <motion.path
          d="M95 285 L98 314"
          stroke="#BF8A55"
          strokeWidth="0.5"
          opacity="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.path
          d="M140 285 L143 314"
          stroke="#BF8A55"
          strokeWidth="0.5"
          opacity="0.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        {/* Soil */}
        <motion.ellipse
          cx="120"
          cy="276"
          rx="46"
          ry="10"
          fill="url(#soilGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Soil texture */}
        {[95, 108, 125, 138, 148].map((x, i) => (
          <motion.circle
            key={`soil-${i}`}
            cx={x}
            cy={274 + (i % 2) * 3}
            r="1.5"
            fill="#4A3A22"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          />
        ))}

        {/* Seed / sprout at stage 0 */}
        {stage === 0 && (
          <motion.ellipse
            cx="120"
            cy="270"
            rx="5"
            ry="3"
            fill="#8B7355"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
          />
        )}

        {/* Main stem - curved, organic shape */}
        <motion.path
          stroke="url(#stemGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: stage >= 1 ? 1 : 0,
            opacity: stage >= 1 ? 1 : 0,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          d="M120 270 Q118 240 120 210"
        />

        {/* Stem extension */}
        <motion.path
          stroke="url(#stemGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: stage >= 2 ? 1 : 0,
            opacity: stage >= 2 ? 1 : 0,
          }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          d="M120 210 Q122 185 119 160"
        />

        {/* Upper stem */}
        <motion.path
          stroke="url(#stemGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: stage >= 3 ? 1 : 0,
            opacity: stage >= 3 ? 1 : 0,
          }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          d="M119 160 Q117 130 120 100"
        />

        {/* Topmost stem to flower */}
        <motion.path
          stroke="url(#stemGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: stage >= 4 ? 1 : 0,
            opacity: stage >= 4 ? 1 : 0,
          }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          d="M120 100 Q121 85 120 70"
        />

        {/* Stage 1: First pair of small leaves at base */}
        {stage >= 1 && (
          <>
            {/* Left leaf */}
            <motion.path
              d="M120 230 Q95 218 85 195 Q100 202 110 215 Z"
              fill="url(#leafGrad1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: 'spring' }}
              style={{ transformOrigin: '120px 230px' }}
            />
            {/* Left leaf vein */}
            <motion.path
              d="M118 228 Q102 216 92 200"
              stroke="#5A9E3E"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            />
            {/* Right leaf */}
            <motion.path
              d="M120 225 Q145 210 158 190 Q142 200 130 215 Z"
              fill="url(#leafGrad1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7, type: 'spring' }}
              style={{ transformOrigin: '120px 225px' }}
            />
            {/* Right leaf vein */}
            <motion.path
              d="M122 223 Q140 210 152 195"
              stroke="#5A9E3E"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            />
          </>
        )}

        {/* Stage 2: Second pair of larger leaves + branch */}
        {stage >= 2 && (
          <>
            {/* Left branch */}
            <motion.path
              d="M120 190 Q105 180 90 175"
              stroke="#4A7C59"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
            {/* Left large leaf */}
            <motion.path
              d="M120 190 Q78 170 65 135 Q82 155 100 170 Z"
              fill="url(#leafGrad2)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6, type: 'spring' }}
              style={{ transformOrigin: '120px 190px' }}
            />
            {/* Left leaf veins */}
            <motion.path
              d="M115 186 Q88 168 72 145"
              stroke="#6BBF4E"
              strokeWidth="0.7"
              fill="none"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />
            <motion.path
              d="M105 180 Q90 172 80 158"
              stroke="#6BBF4E"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            />

            {/* Right branch */}
            <motion.path
              d="M121 180 Q138 168 152 165"
              stroke="#4A7C59"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
            {/* Right large leaf */}
            <motion.path
              d="M121 180 Q162 158 172 120 Q155 145 138 165 Z"
              fill="url(#leafGrad1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8, type: 'spring' }}
              style={{ transformOrigin: '121px 180px' }}
            />
            {/* Right leaf veins */}
            <motion.path
              d="M126 176 Q152 155 165 130"
              stroke="#5A9E3E"
              strokeWidth="0.7"
              fill="none"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            />
          </>
        )}

        {/* Stage 3: Upper foliage - more leaves */}
        {stage >= 3 && (
          <>
            {/* Left upper leaf */}
            <motion.path
              d="M119 145 Q70 125 60 85 Q80 108 105 128 Z"
              fill="url(#leafGrad2)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7, type: 'spring' }}
              style={{ transformOrigin: '119px 145px' }}
            />
            <motion.path
              d="M115 140 Q82 118 68 95"
              stroke="#6BBF4E"
              strokeWidth="0.6"
              fill="none"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            />

            {/* Right upper leaf */}
            <motion.path
              d="M121 135 Q165 112 170 75 Q152 100 135 120 Z"
              fill="url(#leafGrad1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9, type: 'spring' }}
              style={{ transformOrigin: '121px 135px' }}
            />
            <motion.path
              d="M125 132 Q155 110 164 84"
              stroke="#5A9E3E"
              strokeWidth="0.6"
              fill="none"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />

            {/* Small accent leaf left */}
            <motion.path
              d="M118 118 Q95 108 88 90 Q100 100 112 112 Z"
              fill="url(#leafGrad1)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              style={{ transformOrigin: '118px 118px' }}
            />

            {/* Small accent leaf right */}
            <motion.path
              d="M122 108 Q142 95 148 80 Q138 92 126 104 Z"
              fill="url(#leafGrad2)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              style={{ transformOrigin: '122px 108px' }}
            />
          </>
        )}

        {/* Stage 4: Flower bloom */}
        {stage >= 4 && (
          <>
            {/* Flower bud leaves */}
            <motion.path
              d="M120 72 Q112 65 108 55 Q114 60 120 68 Z"
              fill="#5A9E3E"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
              style={{ transformOrigin: '120px 72px' }}
            />
            <motion.path
              d="M120 72 Q128 65 132 55 Q126 60 120 68 Z"
              fill="#5A9E3E"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, duration: 0.3 }}
              style={{ transformOrigin: '120px 72px' }}
            />

            {/* Petals - 8 petals for a fuller flower */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const px = 120 + Math.cos(rad) * 22
              const py = 48 + Math.sin(rad) * 22
              return (
                <motion.ellipse
                  key={`petal-${angle}`}
                  cx={px}
                  cy={py}
                  rx="10"
                  ry="16"
                  fill="url(#petalGrad)"
                  stroke="#E0D0B8"
                  strokeWidth="0.3"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.4 + i * 0.08,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  style={{
                    transformOrigin: `${px}px ${py}px`,
                    transform: `rotate(${angle + 90}deg)`,
                  }}
                />
              )
            })}

            {/* Inner petals (smaller, slightly rotated) */}
            {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const px = 120 + Math.cos(rad) * 14
              const py = 48 + Math.sin(rad) * 14
              return (
                <motion.ellipse
                  key={`inner-petal-${angle}`}
                  cx={px}
                  cy={py}
                  rx="7"
                  ry="11"
                  fill="#F5EDE0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: 1.8 + i * 0.06,
                    type: 'spring',
                  }}
                  style={{
                    transformOrigin: `${px}px ${py}px`,
                    transform: `rotate(${angle + 90}deg)`,
                  }}
                />
              )
            })}

            {/* Flower center */}
            <motion.circle
              cx="120"
              cy="48"
              r="10"
              fill="url(#bloomCenter)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 2.3, type: 'spring', stiffness: 300 }}
            />
            {/* Center detail dots */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              return (
                <motion.circle
                  key={`dot-${angle}`}
                  cx={120 + Math.cos(rad) * 5}
                  cy={48 + Math.sin(rad) * 5}
                  r="1.2"
                  fill="#F9A825"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.5 + i * 0.04 }}
                />
              )
            })}

            {/* Gentle sparkles around flower */}
            {[
              { x: 92, y: 30, delay: 2.6 },
              { x: 152, y: 35, delay: 2.7 },
              { x: 100, y: 65, delay: 2.8 },
              { x: 145, y: 58, delay: 2.9 },
            ].map((s, i) => (
              <motion.circle
                key={`sparkle-${i}`}
                cx={s.x}
                cy={s.y}
                r="2"
                fill="#FFE082"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 1.5,
                  delay: s.delay,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </>
        )}
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

type FormStatus = 'idle' | 'submitting' | 'success'

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

    // Sanitize all inputs before processing
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      organization: sanitizeInput(formData.organization),
      message: sanitizeInput(formData.message),
    }

    setFormStatus('submitting')

    // Simulate form submission with sanitized data
    void sanitizedData // Will be sent to backend in v2
    await new Promise((resolve) => setTimeout(resolve, 1500))

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
      className="relative py-16 md:py-24 lg:py-32 section-cream overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 topographic-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.span
              className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Growing Plant Visualization */}
            <motion.div
              className="hidden lg:block h-[400px] glass rounded-panel p-8"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="text-center mb-4">
                <p className="text-sm text-text-muted">
                  {formProgress === 0 && 'Plant your seed...'}
                  {formProgress === 1 && 'Sprouting!'}
                  {formProgress === 2 && 'Growing stronger...'}
                  {formProgress === 3 && 'Almost there!'}
                  {formProgress === 4 && 'In full bloom!'}
                </p>
              </div>
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
                className="mt-8 flex flex-wrap justify-center gap-8 text-center"
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
                <span className="text-sage-200 hidden md:inline">|</span>
                <a
                  href="tel:+919900393800"
                  className="text-text-muted hover:text-sage-600 transition-colors py-2 min-h-[44px] inline-flex items-center"
                >
                  +919900393800
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
