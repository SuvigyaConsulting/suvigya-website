'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
// Html removed — labels only show in ProjectDetail panel on click
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
  const hoveredRef = useRef(false)
  const scaleRef = useRef(1)

  const surfacePos = useMemo(
    () => latLongToVector3(project.lat, project.lon, globeRadius),
    [project.lat, project.lon, globeRadius],
  )

  const color = useMemo(() => new THREE.Color(project.color), [project.color])

  useFrame(() => {
    const target = hoveredRef.current ? 1.5 : 1
    scaleRef.current += (target - scaleRef.current) * 0.15
    if (groupRef.current) groupRef.current.scale.setScalar(scaleRef.current)
  })

  return (
    <group ref={groupRef} position={surfacePos}>
      {/* Bright particle-like core — additive blending for glow */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Soft glow halo — additive blending */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow bloom */}
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Invisible click target (bigger hit area) */}
      <mesh
        visible={false}
        onPointerOver={() => {
          hoveredRef.current = true
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          hoveredRef.current = false
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          onPinClick(project.id)
        }}
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
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
