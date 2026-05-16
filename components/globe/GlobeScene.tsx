'use client'

import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import ParticleField from './ParticleField'
import EarthGlobe from './EarthGlobe'
import ProjectPins from './ProjectPins'

interface GlobeSceneProps {
  phase: 'particles' | 'morphing' | 'globe'
  onPinClick: (projectId: number) => void
  selectedProjectId: number | null
}

// Static star field — visible against the dark space backdrop during globe phase
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
      // Closer shell so stars resolve to more than a sub-pixel
      const r = 15 + Math.random() * 35
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      // Bigger sizes: ~12% are "bright" stars, rest are dim background
      sizes[i] = Math.random() < 0.12
        ? 0.25 + Math.random() * 0.35
        : 0.08 + Math.random() * 0.14
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
          // Bumped pixel scale (200 → 320) so stars resolve to visible pixels
          gl_PointSize = size * (320.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          // Sharper falloff so even small stars read as crisp points, not blobs
          float alpha = smoothstep(0.5, 0.1, dist) * 0.9;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    })

    return { geometry: geo, material: mat }
  }, [])

  return <points geometry={geometry} material={material} />
}

// Watches selectedProjectId and phase, restores camera + OrbitControls.target
// when the user closes a pin or leaves the globe phase. Without this, the
// camera stays close to the pin and the orbit pivot stays on the pin surface
// after the detail panel is dismissed — making rotation feel "off-center" and
// preventing re-zoom on a fresh entry to globe phase.
function CameraStateReset({
  selectedProjectId,
  phase,
}: {
  selectedProjectId: number | null
  phase: 'particles' | 'morphing' | 'globe'
}) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const prevSelRef = useRef<number | null>(null)
  const prevPhaseRef = useRef<string>('particles')
  const tweensRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    const prevSel = prevSelRef.current
    const prevPhase = prevPhaseRef.current
    prevSelRef.current = selectedProjectId
    prevPhaseRef.current = phase

    const orbitCtrl =
      controls && 'enabled' in (controls as object)
        ? (controls as unknown as {
            enabled: boolean
            target: THREE.Vector3
            update?: () => void
          })
        : null

    // Pin closed during globe phase → fly camera back to wide overview.
    if (prevSel !== null && selectedProjectId === null && phase === 'globe' && orbitCtrl) {
      // Kill any in-flight reset tweens before starting new ones.
      tweensRef.current.forEach((t) => t.kill())
      tweensRef.current = []

      orbitCtrl.enabled = false

      // Match the cinematic morph end-position from CameraAnimator (0, 0.8, 7),
      // not the pre-morph (0, 0, 8.5). Otherwise the globe visibly *shrinks*
      // when the user closes a detail panel — first-entry uses one position,
      // post-close used another, and the size mismatch is perceptible.
      const camTween = gsap.to(camera.position, {
        x: 0,
        y: 0.8,
        z: 7,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => orbitCtrl.update?.(),
        onComplete: () => {
          orbitCtrl.enabled = true
        },
      })

      const targetTween = gsap.to(orbitCtrl.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })

      tweensRef.current = [camTween, targetTween]
    }

    // Leaving globe phase entirely (e.g. Back to Home) → snap target back to
    // origin so the next entry is clean. Phase change drives the morph
    // animation; we just clear the orbital state instantly.
    if (prevPhase === 'globe' && phase !== 'globe' && orbitCtrl) {
      tweensRef.current.forEach((t) => t.kill())
      tweensRef.current = []
      orbitCtrl.target.set(0, 0, 0)
      orbitCtrl.enabled = true
    }
  }, [selectedProjectId, phase, camera, controls])

  return null
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
      style={{
        position: 'absolute',
        inset: 0,
        cursor: phase === 'globe' ? 'grab' : 'default',
      }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#14b8a6" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#c9a84c" />

      <CameraAnimator phase={phase} />
      <CameraStateReset selectedProjectId={selectedProjectId} phase={phase} />
      <StarField />

      <Suspense fallback={null}>
        <ParticleField
          morphing={phase === 'morphing' || phase === 'globe'}
          opacity={phase === 'globe' ? 0 : 1}
        />

        <EarthGlobe
          visible={phase === 'globe'}
          autoRotate={false}
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
