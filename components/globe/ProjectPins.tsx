'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Project location data ──────────────────────────────────────────────────────

export const projectLocations = [
  {
    id: 1,
    title: 'Afghanistan Emergency Food Security',
    client: 'World Bank / FAO',
    value: '$415M',
    lat: 34.52,
    lon: 69.17,
    color: '#14b8a6',
  },
  {
    id: 2,
    title: 'Kerala Climate Resilient Agri-Value Chain',
    client: 'World Bank',
    value: '$285M',
    lat: 10.85,
    lon: 76.27,
    color: '#c9a84c',
  },
  {
    id: 3,
    title: 'ELEMENT Project: Nagaland & Tripura',
    client: 'World Bank',
    value: '$242M',
    lat: 25.67,
    lon: 94.11,
    color: '#14b8a6',
  },
  {
    id: 4,
    title: 'GCF Hindu Kush Himalayan Region',
    client: 'GCF',
    value: '72M people',
    lat: 27.98,
    lon: 86.92,
    color: '#c9a84c',
  },
  {
    id: 5,
    title: 'Community Forest Management',
    client: 'JICA',
    value: '$124M',
    lat: 25.47,
    lon: 91.88,
    color: '#14b8a6',
  },
  {
    id: 6,
    title: 'CONSERVE Biodiversity',
    client: 'GEF / UNDP',
    value: '$12.3M',
    lat: 20.59,
    lon: 78.96,
    color: '#c9a84c',
  },
  {
    id: 7,
    title: 'Umbrella NRM Programme',
    client: 'GIZ / KfW',
    value: '50+ projects',
    lat: 23.26,
    lon: 77.41,
    color: '#14b8a6',
  },
  {
    id: 8,
    title: 'Blue Economy: Plastic Waste',
    client: 'World Bank',
    value: '$60M',
    lat: 14.55,
    lon: 74.35,
    color: '#c9a84c',
  },
] as const

export type ProjectLocation = (typeof projectLocations)[number]

// ── Helpers ────────────────────────────────────────────────────────────────────

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectPinsProps {
  visible: boolean
  globeRadius: number
  onPinClick: (projectId: number) => void
}

// ── Single Pin ─────────────────────────────────────────────────────────────────

interface PinProps {
  project: ProjectLocation
  globeRadius: number
  onPinClick: (projectId: number) => void
}

function Pin({ project, globeRadius, onPinClick }: PinProps) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const hoveredRef = useRef(false)
  const scaleRef = useRef(1)
  const { camera } = useThree()
  const getControls = useThree((state) => () => state.controls)

  const surfacePos = useMemo(
    () => latLongToVector3(project.lat, project.lon, globeRadius),
    [project.lat, project.lon, globeRadius],
  )

  // Normal direction (outward from globe center)
  const normal = useMemo(() => surfacePos.clone().normalize(), [surfacePos])

  // Pin tip position (end of the line extending outward)
  const pinTipPos = useMemo(
    () => surfacePos.clone().add(normal.clone().multiplyScalar(0.25)),
    [surfacePos, normal],
  )

  // Label position (slightly above and offset from pin tip)
  const labelPos = useMemo(
    () => pinTipPos.clone().add(normal.clone().multiplyScalar(0.08)),
    [pinTipPos, normal],
  )

  // Line points (from surface to pin tip)
  const linePoints = useMemo(
    () => [surfacePos.toArray(), pinTipPos.toArray()] as [
      [number, number, number],
      [number, number, number],
    ],
    [surfacePos, pinTipPos],
  )

  const color = useMemo(() => new THREE.Color(project.color), [project.color])

  // Ring orientation quaternion: align ring plane perpendicular to normal
  const ringQuaternion = useMemo(() => {
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return quaternion
  }, [normal])

  const handlePointerOver = useCallback(() => {
    hoveredRef.current = true
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    hoveredRef.current = false
    document.body.style.cursor = 'auto'
  }, [])

  const handleClick = useCallback(
    (e: THREE.Event) => {
      // Stop propagation so globe drag isn't triggered
      if (e && typeof (e as any).stopPropagation === 'function') {
        ;(e as any).stopPropagation()
      }

      // Camera fly-to: position camera ~4 units along pin's outward normal
      const flyTarget = normal.clone().multiplyScalar(4)
      gsap.to(camera.position, {
        x: flyTarget.x,
        y: flyTarget.y,
        z: flyTarget.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      // Animate OrbitControls target to look at the pin
      const controls = getControls() as any
      if (controls && controls.target) {
        gsap.to(controls.target, {
          x: pinTipPos.x,
          y: pinTipPos.y,
          z: pinTipPos.z,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => controls.update?.(),
        })
      }

      onPinClick(project.id)
    },
    [onPinClick, project.id, camera, getControls, normal, pinTipPos],
  )

  // Animate ring pulse and hover scale
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Pulsing ring animation — bigger pulse range (1 → 2.0)
    if (ringRef.current) {
      const pulse = 1 + 1.0 * (0.5 + 0.5 * Math.sin(t * 2 + project.id))
      ringRef.current.scale.set(pulse, pulse, 1)
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.8 * (1 - (pulse - 1) / 1.0)
    }

    // Hover scale interpolation
    const targetScale = hoveredRef.current ? 1.5 : 1
    scaleRef.current += (targetScale - scaleRef.current) * 0.15
    if (groupRef.current) {
      groupRef.current.scale.setScalar(scaleRef.current)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Vertical line (pin stem) */}
      <Line
        points={linePoints}
        color={color}
        transparent
        opacity={0.7}
        lineWidth={1.5}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Pin head sphere — larger and more emissive */}
      <mesh
        position={pinTipPos}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.0}
          toneMapped={false}
        />
      </mesh>

      {/* Value label floating next to pin */}
      <Html
        position={labelPos}
        center
        sprite
        distanceFactor={8}
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#f0f2f5',
          background: 'rgba(8,13,26,0.8)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {project.value}
      </Html>

      {/* Pulsing glow ring at pin base — bigger ring */}
      <mesh
        ref={ringRef}
        position={surfacePos}
        quaternion={ringQuaternion}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <ringGeometry args={[0.06, 0.12, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ── ProjectPins ────────────────────────────────────────────────────────────────

export default function ProjectPins({ visible, globeRadius, onPinClick }: ProjectPinsProps) {
  if (!visible) return null

  return (
    <group>
      {projectLocations.map((project) => (
        <Pin
          key={project.id}
          project={project}
          globeRadius={globeRadius}
          onPinClick={onPinClick}
        />
      ))}
    </group>
  )
}
