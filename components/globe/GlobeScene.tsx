'use client'

import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import ParticleField from './ParticleField'
import EarthGlobe from './EarthGlobe'
import ProjectPins from './ProjectPins'

interface GlobeSceneProps {
  phase: 'particles' | 'morphing' | 'globe'
  onPinClick: (projectId: number) => void
  selectedProjectId: number | null
}

// Static star field
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

// Camera zooms in slightly during morph, then hands off to OrbitControls
function CameraAnimator({ phase }: { phase: string }) {
  const { camera } = useThree()
  const targetRef = useRef(new THREE.Vector3(0, 0, 8.5))
  const activeRef = useRef(true)

  useEffect(() => {
    if (phase === 'particles') {
      // Pull back to wide view
      targetRef.current.set(0, 0, 8.5)
      activeRef.current = true
    } else if (phase === 'morphing') {
      // Gentle zoom in, slight upward tilt — same direction, no u-turn
      targetRef.current.set(0, 0.8, 7)
      activeRef.current = true
    } else if (phase === 'globe') {
      // Stop animating, OrbitControls takes over
      activeRef.current = false
    }
  }, [phase])

  useFrame((_, delta) => {
    if (!activeRef.current) return
    camera.position.lerp(targetRef.current, Math.min(delta * 1.2, 0.03))
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function GlobeScene({ phase, onPinClick, selectedProjectId }: GlobeSceneProps) {
  const [pinsReady, setPinsReady] = useState(false)

  const handleEarthReady = useCallback(() => {
    setTimeout(() => setPinsReady(true), 400)
  }, [])

  const showPins = phase === 'globe' && pinsReady

  // Reset pins when leaving globe
  useEffect(() => {
    if (phase !== 'globe') setPinsReady(false)
  }, [phase])

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

      <CameraAnimator phase={phase} />
      <StarField />

      <Suspense fallback={null}>
        <ParticleField
          morphing={phase === 'morphing' || phase === 'globe'}
          opacity={phase === 'globe' ? 0 : 1}
        />

        <EarthGlobe
          visible={phase === 'globe'}
          autoRotate={!selectedProjectId}
          onReady={handleEarthReady}
        >
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
