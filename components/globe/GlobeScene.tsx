'use client'

import { Suspense, useMemo, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import EarthGlobe from './EarthGlobe'
import ProjectPins from './ProjectPins'

interface GlobeSceneProps {
  phase: 'particles' | 'morphing' | 'globe'
  onPinClick: (projectId: number) => void
  selectedProjectId: number | null
}

// Static star field — always visible, provides depth to space
function StarField() {
  const { geometry, material } = useMemo(() => {
    const count = 3000
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = 20 + Math.random() * 80
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = Math.random() < 0.1
        ? 0.08 + Math.random() * 0.12
        : 0.02 + Math.random() * 0.05
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, dist) * 0.85;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points geometry={geometry} material={material} />
}

export default function GlobeScene({ phase, onPinClick, selectedProjectId }: GlobeSceneProps) {
  // Pins only appear after earth is fully loaded
  const [pinsReady, setPinsReady] = useState(false)

  const handleEarthReady = useCallback(() => {
    // Delay pins slightly after earth is fully opaque for organic feel
    setTimeout(() => setPinsReady(true), 400)
  }, [])

  // Reset pins when leaving globe phase
  const showPins = phase === 'globe' && pinsReady

  return (
    <Canvas
      camera={{ position: [1.7, 2.9, -7.7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#c9a84c" />

      <StarField />

      <Suspense fallback={null}>
        {/* Particles — opacity crossfades with earth */}
        <ParticleField
          morphing={phase === 'morphing' || phase === 'globe'}
          opacity={phase === 'globe' ? 0 : 1}
        />

        {/* Earth appears after particles form sphere */}
        <EarthGlobe
          visible={phase === 'globe'}
          autoRotate={!selectedProjectId}
          onReady={handleEarthReady}
        >
          {/* Pins appear organically after earth is fully loaded */}
          <ProjectPins
            visible={showPins}
            globeRadius={2.5}
            onPinClick={onPinClick}
            selectedProjectId={selectedProjectId}
          />
        </EarthGlobe>
      </Suspense>
    </Canvas>
  )
}
