'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

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

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ''

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
              Let&apos;s <span className="gradient-text">Build Something</span> Lasting
            </h2>
            <p className="text-subtitle text-text-body leading-relaxed max-w-2xl mx-auto">
              Have a project in mind? We bring the expertise, the networks, and the field presence to turn ambition into measurable outcomes.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Left: Contact info + credentials */}
            <motion.div
              className="hidden lg:flex flex-col justify-start pt-12 glass rounded-panel p-10"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-text-heading mb-4">Get in Touch</h3>
              <p className="text-text-body mb-8 leading-relaxed">
                Whether you&apos;re planning a new initiative or need expert support for an ongoing project, we&apos;re here to help.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Email</p>
                    <a href="mailto:contact@suvigya.org" className="text-text-heading font-medium hover:text-sage-600 transition-colors">contact@suvigya.org</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Phone</p>
                    <a href="tel:+919900393800" className="text-text-heading font-medium hover:text-sage-600 transition-colors">+91 9900 393 800</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Location</p>
                    <span className="text-text-heading font-medium">Bengaluru, India</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-sage-100">
                <p className="text-sm text-text-muted leading-relaxed">
                  We respond within 24 hours on business days.
                </p>
              </div>
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

              {/* Contact Info — mobile only; on lg+ the "Get in Touch" card on the
                  left already shows email/phone, so hide here to avoid repetition. */}
              <motion.div
                className="mt-8 flex lg:hidden flex-wrap items-center justify-center gap-8 text-center"
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
