'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { usePersonalizationStore } from '@/store/personalization'

// Growing plant visualization based on form progress
function GrowingPlant({ progress }: { progress: number }) {
  // Progress: 0-4 (number of filled fields)
  const stage = Math.min(Math.floor(progress), 4)

  return (
    <div className="relative w-full h-full flex items-end justify-center pb-8">
      <svg
        viewBox="0 0 200 300"
        className="w-48 h-72"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(74, 124, 89, 0.2))' }}
      >
        {/* Pot */}
        <motion.path
          d="M60 260 L70 290 L130 290 L140 260 Z"
          fill="#C4A77D"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M55 250 L60 260 L140 260 L145 250 Z"
          fill="#A88B5C"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Soil */}
        <motion.ellipse
          cx="100"
          cy="258"
          rx="38"
          ry="8"
          fill="#6B5738"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {/* Stem - grows with progress */}
        <motion.path
          d="M100 255 L100 255"
          stroke="#4A7C59"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ d: 'M100 255 L100 255' }}
          animate={{
            d: stage >= 1 ? 'M100 255 L100 180' : 'M100 255 L100 255',
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Main stem extension */}
        <motion.path
          d="M100 180 L100 180"
          stroke="#4A7C59"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          initial={{ d: 'M100 180 L100 180' }}
          animate={{
            d: stage >= 2 ? 'M100 180 L100 120' : 'M100 180 L100 180',
          }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Top stem */}
        <motion.path
          d="M100 120 L100 120"
          stroke="#4A7C59"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          initial={{ d: 'M100 120 L100 120' }}
          animate={{
            d: stage >= 3 ? 'M100 120 L100 70' : 'M100 120 L100 120',
          }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        />

        {/* Leaf 1 (left) */}
        <motion.path
          d="M100 200 Q60 180 70 150 Q80 170 100 180"
          fill="#8CB369"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 1 ? 1 : 0,
            opacity: stage >= 1 ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ transformOrigin: '100px 200px' }}
        />

        {/* Leaf 2 (right) */}
        <motion.path
          d="M100 180 Q140 160 130 130 Q120 150 100 160"
          fill="#8CB369"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 2 ? 1 : 0,
            opacity: stage >= 2 ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ transformOrigin: '100px 180px' }}
        />

        {/* Leaf 3 (left upper) */}
        <motion.path
          d="M100 140 Q50 120 65 85 Q75 110 100 120"
          fill="#A8D5BA"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 3 ? 1 : 0,
            opacity: stage >= 3 ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{ transformOrigin: '100px 140px' }}
        />

        {/* Leaf 4 (right upper) */}
        <motion.path
          d="M100 120 Q150 100 135 65 Q125 90 100 100"
          fill="#A8D5BA"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: stage >= 3 ? 1 : 0,
            opacity: stage >= 3 ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{ transformOrigin: '100px 120px' }}
        />

        {/* Flower/bloom (appears at stage 4 - form complete) */}
        {stage >= 4 && (
          <>
            <motion.circle
              cx="100"
              cy="55"
              r="20"
              fill="#8CB369"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5, type: 'spring' }}
            />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <motion.ellipse
                key={angle}
                cx={100 + Math.cos((angle * Math.PI) / 180) * 25}
                cy={55 + Math.sin((angle * Math.PI) / 180) * 25}
                rx="12"
                ry="18"
                fill="#A8D5BA"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.7 + i * 0.1, type: 'spring' }}
                style={{
                  transformOrigin: `${100 + Math.cos((angle * Math.PI) / 180) * 25}px ${55 + Math.sin((angle * Math.PI) / 180) * 25}px`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              />
            ))}
            <motion.circle
              cx="100"
              cy="55"
              r="10"
              fill="#C4A77D"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 2.2, type: 'spring' }}
            />
          </>
        )}
      </svg>
    </div>
  )
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { getContextualCTA } = usePersonalizationStore()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', organization: '', message: '' })
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const inputClasses = "w-full px-5 py-4 bg-background-card border-2 border-sage-100 rounded-button text-text-body placeholder-text-muted focus:outline-none focus:border-sage-400 transition-all duration-300"

  return (
    <section
      id="contact"
      className="relative py-24 section-cream overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 topographic-bg opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.span
              className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4 block"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Start a Conversation
            </motion.span>
            <h2 className="text-display font-bold mb-6">
              Let&apos;s <span className="gradient-text">Grow</span> Together
            </h2>
            <p className="text-xl text-text-body leading-relaxed max-w-2xl mx-auto">
              {getContextualCTA()} Ready to make an impact? We&apos;d love to hear about your project.
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
              {submitted ? (
                <motion.div
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
                <form onSubmit={handleSubmit} className="glass rounded-panel p-8 md:p-10 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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
                  href="mailto:contact@suvigyaconsulting.com"
                  className="text-text-muted hover:text-sage-600 transition-colors"
                >
                  contact@suvigyaconsulting.com
                </a>
                <span className="text-sage-200">|</span>
                <a
                  href="tel:+15551234567"
                  className="text-text-muted hover:text-sage-600 transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
