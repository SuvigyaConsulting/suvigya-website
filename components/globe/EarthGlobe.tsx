'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface EarthGlobeProps {
  visible: boolean
  onReady?: () => void
}

const GLOBE_RADIUS = 2.5
const ATMOSPHERE_RADIUS = 2.62

// ── Atmosphere shaders ──────────────────────────────────────────────────────

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragmentShader = `
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

    vec3 glowColor = vec3(0.3, 0.6, 0.8);
    float alpha = fresnel * 0.15 * uOpacity;

    gl_FragColor = vec4(glowColor, alpha);
  }
`

// ── Component ───────────────────────────────────────────────────────────────

export default function EarthGlobe({ visible, onReady }: EarthGlobeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Mesh>(null)
  const [hasCalledReady, setHasCalledReady] = useState(false)
  const fadeRef = useRef({ progress: 0, target: 0 })

  // ── Textures ────────────────────────────────────────────────────────────

  const [colorMap, bumpMap] = useTexture([
    '/textures/earth.jpg',
    '/textures/earth-topology.png',
  ])

  // ── Earth geometry & material ───────────────────────────────────────────

  const earthGeometry = useMemo(() => {
    return new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64)
  }, [])

  const earthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 1,
      metalness: 0,
      transparent: true,
      opacity: 0,
    })
  }, [colorMap, bumpMap])

  // ── Atmosphere geometry & material ──────────────────────────────────────

  const atmosphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 64, 64)
  }, [])

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uOpacity: { value: 0 },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  // ── Track visibility ──────────────────────────────────────────────────

  useEffect(() => {
    fadeRef.current.target = visible ? 1 : 0
  }, [visible])

  // ── Cleanup on unmount ────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      earthGeometry.dispose()
      earthMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
    }
  }, [earthGeometry, earthMaterial, atmosphereGeometry, atmosphereMaterial])

  // ── Animation loop ────────────────────────────────────────────────────

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const fade = fadeRef.current

    // Fade animation: 0 -> 1 over ~0.8s (delta * 1.25 per frame)
    if (Math.abs(fade.progress - fade.target) > 0.001) {
      const speed = 1.0 / 0.8 // reach target in ~0.8 seconds
      if (fade.target > fade.progress) {
        fade.progress = Math.min(fade.progress + delta * speed, fade.target)
      } else {
        fade.progress = Math.max(fade.progress - delta * speed, fade.target)
      }
    } else {
      fade.progress = fade.target
    }

    const t = fade.progress

    // Update earth material opacity
    earthMaterial.opacity = t

    // Update atmosphere uniform
    atmosphereMaterial.uniforms.uOpacity.value = t

    // Group visibility
    groupRef.current.visible = t > 0.001

    // Scale: 0.9 -> 1.0 as progress goes 0 -> 1
    const scale = 0.9 + 0.1 * t
    groupRef.current.scale.setScalar(scale)

    // Auto-rotate slowly on Y axis
    if (t > 0.001 && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05
    }

    // Call onReady once fully visible
    if (t > 0.95 && !hasCalledReady && onReady) {
      setHasCalledReady(true)
      onReady()
    }
  })

  // Reset ready state when visibility changes
  useEffect(() => {
    if (!visible) {
      setHasCalledReady(false)
    }
  }, [visible])

  return (
    <>
      <group ref={groupRef} visible={false}>
        {/* Directional light for realistic shading */}
        <directionalLight position={[5, 3, 5]} intensity={1.5} />

        {/* Textured Earth */}
        <mesh
          ref={earthRef}
          geometry={earthGeometry}
          material={earthMaterial}
        />

        {/* Subtle atmosphere glow */}
        <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />
      </group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  )
}
