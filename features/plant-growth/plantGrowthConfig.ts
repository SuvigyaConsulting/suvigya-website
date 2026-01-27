/**
 * Configuration interface for the organic plant growth animation system
 */

export interface PlantGrowthConfig {
  // Visual properties
  stemColor: string
  branchColor?: string
  leafColor?: string
  strokeWidthRange: [number, number] // [min, max] for organic variation
  leafRevealDelay: number // Delay in scroll progress (0-1) after stem reaches point
  
  // Animation properties
  growthEase: string // GSAP easing string (e.g., "power2.out", "sine.inOut")
  scrollStart: number // Scroll position to start growth (pixels or percentage)
  scrollEnd: number // Scroll position to end growth (pixels or percentage)
  
  // Layout properties
  position: 'left' | 'right' | 'free' // Fixed side or free-flow
  offsetX?: number // Horizontal offset for fixed positioning
  zIndex?: number
  
  // Branching properties
  branchPoints: BranchPoint[] // Array of branch locations and properties
  enableBranches?: boolean
  
  // Performance
  mobileBreakpoint?: number // Hide below this width
  reducedMotionFallback?: 'static' | 'none' // Fallback for reduced motion
}

export interface BranchPoint {
  scrollProgress: number // 0-1, when branch appears
  angle: number // Branch angle in degrees (0 = right, 90 = down, -90 = up)
  length: number // Branch length in pixels
  leafCount?: number // Number of leaves on this branch
  leafDelay?: number // Delay before leaves appear
}

export interface LeafNode {
  id: string
  scrollProgress: number
  x: number
  y: number
  scale: number
  rotation?: number
  branchId?: string // If leaf is on a branch
}

// Default configuration
export const defaultPlantConfig: PlantGrowthConfig = {
  stemColor: 'rgba(34, 139, 34, 0.9)', // More visible green
  branchColor: 'rgba(50, 150, 50, 0.8)',
  leafColor: 'rgba(34, 139, 34, 0.9)',
  strokeWidthRange: [2.5, 3.5], // Thicker for visibility
  leafRevealDelay: 0.02, // 2% scroll progress after stem
  growthEase: 'power2.out', // Organic, non-linear growth
  scrollStart: 0,
  scrollEnd: 0, // Will be calculated dynamically based on document height
  position: 'left',
  offsetX: 24, // 6 * 4px = 24px (left-6 in Tailwind)
  zIndex: 9999, // Very high z-index to ensure visibility
  enableBranches: true,
  mobileBreakpoint: 1024,
  reducedMotionFallback: 'static',
  branchPoints: [
    { scrollProgress: 0.14, angle: 15, length: 30, leafCount: 1, leafDelay: 0.01 },
    { scrollProgress: 0.28, angle: -10, length: 25, leafCount: 1, leafDelay: 0.01 },
    { scrollProgress: 0.42, angle: 20, length: 35, leafCount: 2, leafDelay: 0.01 },
    { scrollProgress: 0.56, angle: -15, length: 28, leafCount: 1, leafDelay: 0.01 },
    { scrollProgress: 0.70, angle: 12, length: 32, leafCount: 2, leafDelay: 0.01 },
    { scrollProgress: 0.85, angle: -8, length: 26, leafCount: 1, leafDelay: 0.01 },
  ],
}
