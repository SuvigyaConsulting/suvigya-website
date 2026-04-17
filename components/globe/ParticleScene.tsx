'use client'

import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

export default function ParticleScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ParticleField morphing={false} opacity={1} />
    </Canvas>
  )
}
