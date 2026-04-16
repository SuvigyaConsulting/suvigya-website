'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

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

  const surfacePos = useMemo(
    () => latLongToVector3(project.lat, project.lon, globeRadius),
    [project.lat, project.lon, globeRadius],
  )

  // Normal direction (outward from globe center)
  const normal = useMemo(() => surfacePos.clone().normalize(), [surfacePos])

  // Pin tip position (end of the line extending outward)
  const pinTipPos = useMemo(
    () => surfacePos.clone().add(normal.clone().multiplyScalar(0.15)),
    [surfacePos, normal],
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
      onPinClick(project.id)
    },
    [onPinClick, project.id],
  )

  // Animate ring pulse and hover scale
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Pulsing ring animation
    if (ringRef.current) {
      const pulse = 1 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + project.id))
      ringRef.current.scale.set(pulse, pulse, 1)
      const material = ringRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.6 * (1 - (pulse - 1) / 0.5)
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
        lineWidth={1}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Pin head sphere */}
      <mesh
        position={pinTipPos}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Pulsing glow ring at pin base */}
      <mesh
        ref={ringRef}
        position={surfacePos}
        quaternion={ringQuaternion}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <ringGeometry args={[0.04, 0.08, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
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
