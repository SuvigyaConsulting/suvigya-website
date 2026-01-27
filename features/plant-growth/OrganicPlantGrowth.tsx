'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAccessibility } from '@/components/AccessibilityProvider'
import { PlantGrowthConfig, defaultPlantConfig } from './plantGrowthConfig'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface OrganicPlantGrowthProps {
  config?: Partial<PlantGrowthConfig>
  sectionMilestones?: Array<{ id: string; label: string; progress: number }>
}

/**
 * Full-screen organic plant growth system
 * Covers the entire viewport with organic plant growth
 */
export default function OrganicPlantGrowth({ 
  config = {},
  sectionMilestones = [
    { id: 'home', label: 'Home', progress: 0 },
    { id: 'about', label: 'About', progress: 0.14 },
    { id: 'services', label: 'Services', progress: 0.28 },
    { id: 'projects', label: 'Projects', progress: 0.42 },
    { id: 'partners', label: 'Partners', progress: 0.56 },
    { id: 'impact', label: 'Impact', progress: 0.70 },
    { id: 'contact', label: 'Contact', progress: 0.85 },
  ]
}: OrganicPlantGrowthProps) {
  const { reducedMotion } = useAccessibility()
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const scrollTriggersRef = useRef<ScrollTrigger[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [documentHeight, setDocumentHeight] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // Merge config with defaults
  const finalConfig: PlantGrowthConfig = useMemo(() => ({
    ...defaultPlantConfig,
    ...config,
    branchPoints: config.branchPoints || defaultPlantConfig.branchPoints || [],
  }), [config])

  // Generate multiple organic paths that cover the screen
  const generateFullScreenPaths = useCallback((width: number, height: number) => {
    const paths: Array<{ d: string; id: string; progress: number }> = []
    
    // Main vertical stems (3-4 across the screen)
    const stemCount = 4
    const stemSpacing = width / (stemCount + 1)
    
    for (let i = 0; i < stemCount; i++) {
      const x = stemSpacing * (i + 1)
      const variation = (Math.random() - 0.5) * 40
      const startX = x + variation
      const endX = x + (Math.random() - 0.5) * 60
      
      // Create organic S-curve
      const midX1 = startX + (Math.random() - 0.5) * 30
      const midX2 = endX + (Math.random() - 0.5) * 30
      
      paths.push({
        id: `stem-${i}`,
        d: `M ${startX} 0 C ${midX1} ${height * 0.3}, ${midX2} ${height * 0.7}, ${endX} ${height}`,
        progress: i * 0.15, // Stagger the growth
      })
    }
    
    // Horizontal connecting branches
    const branchCount = 8
    for (let i = 0; i < branchCount; i++) {
      const y = (height / (branchCount + 1)) * (i + 1)
      const startX = Math.random() * width * 0.3
      const endX = width * 0.7 + Math.random() * width * 0.3
      const midY = y + (Math.random() - 0.5) * 50
      
      paths.push({
        id: `branch-h-${i}`,
        d: `M ${startX} ${y} Q ${(startX + endX) / 2} ${midY}, ${endX} ${y}`,
        progress: 0.2 + (i * 0.1),
      })
    }
    
    // Diagonal vines
    const vineCount = 6
    for (let i = 0; i < vineCount; i++) {
      const startX = Math.random() * width
      const startY = Math.random() * height * 0.5
      const endX = startX + (Math.random() - 0.5) * width * 0.6
      const endY = startY + 200 + Math.random() * 300
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 40
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 40
      
      paths.push({
        id: `vine-${i}`,
        d: `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`,
        progress: 0.3 + (i * 0.08),
      })
    }
    
    return paths
  }, [])

  // Generate leaf path
  const generateLeafPath = (): string => {
    return `M 10 4 Q 13 7, 11 10 Q 12 12, 10 12 Q 8 12, 9 10 Q 7 7, 10 4`
  }

  // Update dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const isMobileDevice = window.innerWidth < (finalConfig.mobileBreakpoint || 1024)
    setIsMobile(isMobileDevice)
    
    const width = window.innerWidth
    const height = Math.max(
      document.documentElement.scrollHeight,
      window.innerHeight * 2
    )
    setDocumentHeight(height)

    if (svgRef.current) {
      svgRef.current.setAttribute('width', width.toString())
      svgRef.current.setAttribute('height', height.toString())
      svgRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`)
    }
  }, [finalConfig.mobileBreakpoint])

  // Initialize
  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion || isMobile) {
      if (reducedMotion && finalConfig.reducedMotionFallback === 'static') {
        updateDimensions()
        setIsReady(true)
      }
      return
    }

    updateDimensions()
    
    const timeoutId = setTimeout(() => {
      setIsReady(true)
    }, 200)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [reducedMotion, isMobile, updateDimensions, finalConfig.reducedMotionFallback])

  // Setup ScrollTrigger animations
  useEffect(() => {
    if (!isReady || reducedMotion || isMobile || !svgRef.current || !containerRef.current) return

    // Clean up previous triggers
    scrollTriggersRef.current.forEach(trigger => trigger.kill())
    scrollTriggersRef.current = []

    const width = window.innerWidth
    const height = documentHeight || window.innerHeight * 2
    
    // Generate all paths
    const paths = generateFullScreenPaths(width, height)
    
    // Create SVG paths and animate them
    paths.forEach((pathData, index) => {
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathElement.setAttribute('id', pathData.id)
      pathElement.setAttribute('d', pathData.d)
      pathElement.setAttribute('fill', 'none')
      pathElement.setAttribute('stroke', finalConfig.stemColor)
      pathElement.setAttribute('stroke-width', String(finalConfig.strokeWidthRange[1]))
      pathElement.setAttribute('stroke-linecap', 'round')
      pathElement.setAttribute('stroke-linejoin', 'round')
      pathElement.setAttribute('opacity', '0.8')
      
      svgRef.current?.appendChild(pathElement)
      
      const pathLength = pathElement.getTotalLength()
      
      // Set initial state
      gsap.set(pathElement, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      })

      // Create ScrollTrigger
      const trigger = ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const pathStart = pathData.progress
          
          if (progress >= pathStart) {
            const pathProgress = Math.min(1, (progress - pathStart) / (1 - pathStart))
            const easedProgress = gsap.parseEase(finalConfig.growthEase)(pathProgress)
            const offset = pathLength * (1 - easedProgress)
            
            gsap.set(pathElement, {
              strokeDashoffset: offset,
              opacity: 0.6 + (easedProgress * 0.4),
            })
          } else {
            gsap.set(pathElement, {
              strokeDashoffset: pathLength,
              opacity: 0,
            })
          }
        },
      })
      
      scrollTriggersRef.current.push(trigger)
    })

    // Add leaves throughout
    sectionMilestones.forEach((milestone, index) => {
      if (milestone.progress <= 0 || milestone.progress >= 1) return
      
      const leafX = (width / (sectionMilestones.length + 1)) * (index + 1) + (Math.random() - 0.5) * 100
      const leafY = height * milestone.progress
      
      const leafGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      leafGroup.setAttribute('id', `leaf-${milestone.id}`)
      leafGroup.setAttribute('transform', `translate(${leafX}, ${leafY}) rotate(${(index % 2 === 0 ? 1 : -1) * 20})`)
      leafGroup.setAttribute('opacity', '0')
      
      const leafPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      leafPath.setAttribute('d', generateLeafPath())
      leafPath.setAttribute('fill', 'none')
      leafPath.setAttribute('stroke', finalConfig.leafColor || finalConfig.stemColor)
      leafPath.setAttribute('stroke-width', '2')
      leafPath.setAttribute('stroke-linecap', 'round')
      leafPath.setAttribute('stroke-linejoin', 'round')
      
      leafGroup.appendChild(leafPath)
      svgRef.current?.appendChild(leafGroup)
      
      // Animate leaf
      const leafTrigger = ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const revealStart = milestone.progress
          const revealEnd = Math.min(1, revealStart + finalConfig.leafRevealDelay)

          if (progress >= revealStart) {
            const leafProgress = Math.min(1, (progress - revealStart) / (revealEnd - revealStart))
            const easedProgress = gsap.parseEase('power2.out')(leafProgress)
            
            gsap.set(leafGroup, {
              opacity: easedProgress * 0.9,
              scale: 0.7 + (easedProgress * 0.3),
              transformOrigin: 'center center',
            })
          } else {
            gsap.set(leafGroup, {
              opacity: 0,
              scale: 0.7,
            })
          }
        },
      })
      
      scrollTriggersRef.current.push(leafTrigger)
    })

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      // Clear and regenerate on resize
      if (svgRef.current) {
        while (svgRef.current.firstChild) {
          svgRef.current.removeChild(svgRef.current.firstChild)
        }
      }
      updateDimensions()
      ScrollTrigger.refresh()
    })
    resizeObserver.observe(document.body)
    
    window.addEventListener('resize', () => {
      updateDimensions()
      ScrollTrigger.refresh()
    })

    return () => {
      scrollTriggersRef.current.forEach(trigger => trigger.kill())
      scrollTriggersRef.current = []
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isReady, reducedMotion, isMobile, documentHeight, updateDimensions, finalConfig, sectionMilestones, generateFullScreenPaths, generateLeafPath])

  // Early return for mobile
  if (isMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  // Reduced motion fallback
  if (reducedMotion) {
    if (finalConfig.reducedMotionFallback === 'static' && isReady) {
      return (
        <div
          ref={containerRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: finalConfig.zIndex || 9999 }}
          aria-hidden="true"
        >
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: 'transform' }}
          />
        </div>
      )
    }
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none hidden lg:block"
      style={{ zIndex: finalConfig.zIndex || 9999 }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
