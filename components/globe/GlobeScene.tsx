'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import EarthGlobe from './EarthGlobe'
import ProjectPins from './ProjectPins'

interface GlobeSceneProps {
  phase: 'particles' | 'morphing' | 'globe'
  onPinClick: (projectId: number) => void
}

// Static star field — always visible, provides depth to space
function StarField() {
  const { geometry, material } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random position in a large sphere shell
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = 30 + Math.random() * 70
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.02 + Math.random() * 0.06
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
          float alpha = smoothstep(0.5, 0.0, dist) * 0.6;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points geometry={geometry} material={material} />
}

export default function GlobeScene({ phase, onPinClick }: GlobeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#c9a84c" />

      {/* Stars always visible — provides depth */}
      <StarField />

      <Suspense fallback={null}>
        {/* Particles always visible — opacity crossfades with earth */}
        <ParticleField
          morphing={phase === 'morphing' || phase === 'globe'}
          opacity={phase === 'globe' ? 0 : 1}
        />

        {/* Earth starts fading in during morphing phase for smooth overlap */}
        <EarthGlobe visible={phase === 'morphing' || phase === 'globe'}>
          <ProjectPins
            visible={phase === 'globe'}
            globeRadius={2.5}
            onPinClick={onPinClick}
          />
        </EarthGlobe>
      </Suspense>
    </Canvas>
  )
}
