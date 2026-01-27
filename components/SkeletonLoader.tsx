'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  className?: string
  count?: number
}

export default function SkeletonLoader({ className = '', count = 1 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`skeleton ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </>
  )
}
