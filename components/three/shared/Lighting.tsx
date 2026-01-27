'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightingProps {
  variant?: 'natural' | 'soft' | 'dramatic'
  animated?: boolean
}

export default function Lighting({ variant = 'natural', animated = false }: LightingProps) {
  const sunRef = useRef<THREE.DirectionalLight>(null)

  useFrame(({ clock }) => {
    if (animated && sunRef.current) {
      const time = clock.getElapsedTime()
      sunRef.current.position.x = Math.sin(time * 0.1) * 10
      sunRef.current.position.y = 8 + Math.sin(time * 0.05) * 2
    }
  })

  const configs = {
    natural: {
      ambient: 0.4,
      sun: { intensity: 1.2, color: '#fff9e6', position: [5, 10, 5] as [number, number, number] },
      fill: { intensity: 0.3, color: '#8CB369', position: [-5, 5, -5] as [number, number, number] },
    },
    soft: {
      ambient: 0.6,
      sun: { intensity: 0.8, color: '#ffffff', position: [3, 8, 3] as [number, number, number] },
      fill: { intensity: 0.4, color: '#A8D5BA', position: [-3, 4, -3] as [number, number, number] },
    },
    dramatic: {
      ambient: 0.2,
      sun: { intensity: 1.5, color: '#ffe0b0', position: [8, 12, 8] as [number, number, number] },
      fill: { intensity: 0.2, color: '#4A7C59', position: [-8, 3, -8] as [number, number, number] },
    },
  }

  const config = configs[variant]

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={config.ambient} />

      {/* Main directional light (sun) */}
      <directionalLight
        ref={sunRef}
        intensity={config.sun.intensity}
        color={config.sun.color}
        position={config.sun.position}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light for softer shadows */}
      <directionalLight
        intensity={config.fill.intensity}
        color={config.fill.color}
        position={config.fill.position}
      />

      {/* Subtle hemisphere light for natural color variation */}
      <hemisphereLight
        intensity={0.3}
        color="#8CB369"
        groundColor="#4A7C59"
      />
    </>
  )
}
