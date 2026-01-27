/**
 * Example usage of the OrganicPlantGrowth component
 * 
 * This file demonstrates various configuration options
 * and use cases for the plant growth animation system.
 */

import OrganicPlantGrowth from './OrganicPlantGrowth'
import { PlantGrowthConfig } from './plantGrowthConfig'

// Example 1: Default configuration
export function DefaultPlant() {
  return <OrganicPlantGrowth />
}

// Example 2: Custom colors and styling
export function CustomStyledPlant() {
  const config: Partial<PlantGrowthConfig> = {
    stemColor: 'rgba(139, 195, 74, 0.8)', // Green
    branchColor: 'rgba(76, 175, 80, 0.6)',
    leafColor: 'rgba(104, 159, 56, 0.7)',
    strokeWidthRange: [2, 3.5],
    position: 'right',
    offsetX: 32,
  }

  return <OrganicPlantGrowth config={config} />
}

// Example 3: Minimal plant (no branches)
export function MinimalPlant() {
  const config: Partial<PlantGrowthConfig> = {
    enableBranches: false,
    stemColor: 'rgba(74, 122, 98, 0.5)',
    strokeWidthRange: [1, 1.5],
  }

  return <OrganicPlantGrowth config={config} />
}

// Example 4: Dense branching
export function DenseBranchingPlant() {
  const config: Partial<PlantGrowthConfig> = {
    enableBranches: true,
    branchPoints: [
      { scrollProgress: 0.1, angle: 20, length: 40, leafCount: 2, leafDelay: 0.01 },
      { scrollProgress: 0.2, angle: -15, length: 35, leafCount: 1, leafDelay: 0.01 },
      { scrollProgress: 0.3, angle: 25, length: 45, leafCount: 3, leafDelay: 0.01 },
      { scrollProgress: 0.4, angle: -20, length: 38, leafCount: 2, leafDelay: 0.01 },
      { scrollProgress: 0.5, angle: 18, length: 42, leafCount: 2, leafDelay: 0.01 },
      { scrollProgress: 0.6, angle: -22, length: 36, leafCount: 1, leafDelay: 0.01 },
      { scrollProgress: 0.7, angle: 15, length: 40, leafCount: 2, leafDelay: 0.01 },
      { scrollProgress: 0.8, angle: -18, length: 34, leafCount: 1, leafDelay: 0.01 },
    ],
  }

  return <OrganicPlantGrowth config={config} />
}

// Example 5: Custom section milestones
export function CustomMilestonesPlant() {
  const milestones = [
    { id: 'intro', label: 'Introduction', progress: 0 },
    { id: 'features', label: 'Features', progress: 0.2 },
    { id: 'pricing', label: 'Pricing', progress: 0.5 },
    { id: 'testimonials', label: 'Testimonials', progress: 0.75 },
    { id: 'cta', label: 'Call to Action', progress: 0.95 },
  ]

  return <OrganicPlantGrowth sectionMilestones={milestones} />
}

// Example 6: Fast growth with quick leaf reveals
export function FastGrowthPlant() {
  const config: Partial<PlantGrowthConfig> = {
    growthEase: 'power1.out', // Faster easing
    leafRevealDelay: 0.01, // Quicker leaf appearance
    branchPoints: [
      { scrollProgress: 0.2, angle: 15, length: 30, leafCount: 1, leafDelay: 0.005 },
      { scrollProgress: 0.4, angle: -10, length: 28, leafCount: 1, leafDelay: 0.005 },
      { scrollProgress: 0.6, angle: 20, length: 32, leafCount: 2, leafDelay: 0.005 },
      { scrollProgress: 0.8, angle: -15, length: 30, leafCount: 1, leafDelay: 0.005 },
    ],
  }

  return <OrganicPlantGrowth config={config} />
}

// Example 7: Slow, organic growth
export function SlowOrganicPlant() {
  const config: Partial<PlantGrowthConfig> = {
    growthEase: 'sine.inOut', // Slower, more organic
    leafRevealDelay: 0.05, // Slower leaf appearance
    strokeWidthRange: [2, 3],
  }

  return <OrganicPlantGrowth config={config} />
}

// Example 8: Right-side plant
export function RightSidePlant() {
  const config: Partial<PlantGrowthConfig> = {
    position: 'right',
    offsetX: 24,
  }

  return <OrganicPlantGrowth config={config} />
}
