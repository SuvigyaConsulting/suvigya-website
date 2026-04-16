'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'
import EarthGlobe from './EarthGlobe'
import ProjectPins from './ProjectPins'

interface GlobeSceneProps {
  phase: 'particles' | 'morphing' | 'globe'
  onPinClick: (projectId: number) => void
}

export default function GlobeScene({ phase, onPinClick }: GlobeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#c9a84c" />

      <Suspense fallback={null}>
        {/* ParticleField always rendered — maintains morph state across phase changes */}
        <ParticleField morphing={phase === 'morphing' || phase === 'globe'} />

        <EarthGlobe visible={phase === 'globe'} />

        <ProjectPins
          visible={phase === 'globe'}
          globeRadius={2.5}
          onPinClick={onPinClick}
        />
      </Suspense>
    </Canvas>
  )
}
