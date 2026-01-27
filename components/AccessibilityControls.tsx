'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibility } from './AccessibilityProvider'

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const { reducedMotion, highContrast, toggleReducedMotion, toggleHighContrast } = useAccessibility()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="glass rounded-2xl p-4 mb-4 min-w-[200px]"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Accessibility</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={toggleReducedMotion}
                  className="w-4 h-4 rounded border-beige-300/50 bg-white/80 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Reduce Motion</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  className="w-4 h-4 rounded border-beige-300/50 bg-white/80 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">High Contrast</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 glass rounded-full flex items-center justify-center text-slate-900 hover:bg-beige-200/50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Accessibility settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </motion.button>
    </div>
  )
}
