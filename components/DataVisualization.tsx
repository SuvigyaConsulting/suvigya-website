'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAccessibility } from '@/components/AccessibilityProvider'

interface DataPoint {
  label: string
  value: number
  color: string
}

interface DataVisualizationProps {
  data: DataPoint[]
  title?: string
  animated?: boolean
}

export default function DataVisualization({ data, title, animated = true }: DataVisualizationProps) {
  const { reducedMotion } = useAccessibility()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div ref={ref} className="w-full">
      {title && (
        <h3 className="text-2xl font-bold mb-6 text-slate-900">{title}</h3>
      )}
      <div className="space-y-4">
        {data.map((item, index) => {
          const width = (item.value / maxValue) * 100

          return (
            <div key={item.label} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
              <div className="h-3 bg-beige-200/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={reducedMotion ? false : { width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={reducedMotion ? { duration: 0 } : { delay: index * 0.1, duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
