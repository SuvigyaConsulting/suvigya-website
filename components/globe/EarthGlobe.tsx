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

// Calculate sun direction from current time (approximate solar position)
function getSunDirection(): THREE.Vector3 {
  const now = new Date()
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60
  // Sun is roughly at longitude = (12 - hours) * 15 degrees (noon = 0 longitude)
  const sunLon = ((12 - hours) * 15) * (Math.PI / 180)
  // Sun declination ~ 0 for simplicity (equinox)
  const sunLat = 0
  return new THREE.Vector3(
    Math.cos(sunLat) * Math.cos(sunLon),
    Math.sin(sunLat),
    Math.cos(sunLat) * Math.sin(sunLon)
  ).normalize()
}

// Custom earth shader with day/night blending
const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const earthFragmentShader = `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uBumpMap;
  uniform vec3 uSunDirection;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 dayColor = texture2D(uDayMap, vUv);
    vec4 nightColor = texture2D(uNightMap, vUv);

    // Calculate sunlight factor
    vec3 normal = normalize(vNormal);
    float sunDot = dot(normal, uSunDirection);

    // Smooth transition between day and night (terminator)
    float dayFactor = smoothstep(-0.15, 0.25, sunDot);

    // Blend day and night textures
    vec3 color = mix(nightColor.rgb * 0.8, dayColor.rgb, dayFactor);

    // Add subtle ambient light to night side so it's not pure black
    color += nightColor.rgb * 0.15;

    // Specular highlight for ocean areas (darker areas in the texture)
    float spec = pow(max(dot(reflect(-uSunDirection, normal), normalize(cameraPosition - vWorldPosition)), 0.0), 20.0);
    float oceanMask = 1.0 - smoothstep(0.1, 0.3, length(dayColor.rgb - vec3(0.05, 0.1, 0.2)));
    color += vec3(0.4, 0.5, 0.6) * spec * oceanMask * 0.3 * dayFactor;

    gl_FragColor = vec4(color, uOpacity);
  }
`

// Atmosphere shader
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
  uniform vec3 uSunDirection;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

    // Atmosphere color shifts based on sun angle — warmer near sun, cooler in shadow
    float sunFactor = dot(vNormal, uSunDirection) * 0.5 + 0.5;
    vec3 warmColor = vec3(0.4, 0.6, 0.9);
    vec3 coolColor = vec3(0.15, 0.25, 0.5);
    vec3 glowColor = mix(coolColor, warmColor, sunFactor);

    float alpha = fresnel * 0.18 * uOpacity;

    gl_FragColor = vec4(glowColor, alpha);
  }
`

export default function EarthGlobe({ visible, onReady }: EarthGlobeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Mesh>(null)
  const [hasCalledReady, setHasCalledReady] = useState(false)
  const fadeRef = useRef({ progress: 0, target: 0 })

  // Sun direction based on user's current time
  const sunDirection = useMemo(() => getSunDirection(), [])

  // Textures
  const [dayMap, nightMap, bumpMap] = useTexture([
    '/textures/earth.jpg',
    '/textures/earth-night.jpg',
    '/textures/earth-topology.png',
  ])

  // Set texture quality
  useMemo(() => {
    dayMap.anisotropy = 16
    nightMap.anisotropy = 16
    bumpMap.anisotropy = 16
    dayMap.minFilter = THREE.LinearMipmapLinearFilter
    nightMap.minFilter = THREE.LinearMipmapLinearFilter
  }, [dayMap, nightMap, bumpMap])

  // Earth geometry (high poly for smooth surface)
  const earthGeometry = useMemo(() => {
    return new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128)
  }, [])

  // Custom shader material with day/night
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayMap: { value: dayMap },
        uNightMap: { value: nightMap },
        uBumpMap: { value: bumpMap },
        uSunDirection: { value: sunDirection },
        uOpacity: { value: 0 },
      },
      transparent: true,
    })
  }, [dayMap, nightMap, bumpMap, sunDirection])

  // Atmosphere
  const atmosphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 64, 64)
  }, [])

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uOpacity: { value: 0 },
        uSunDirection: { value: sunDirection },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [sunDirection])

  // Track visibility
  useEffect(() => {
    fadeRef.current.target = visible ? 1 : 0
  }, [visible])

  // Cleanup
  useEffect(() => {
    return () => {
      earthGeometry.dispose()
      earthMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
    }
  }, [earthGeometry, earthMaterial, atmosphereGeometry, atmosphereMaterial])

  // Animation loop
  useFrame((_, delta) => {
    if (!groupRef.current) return

    const fade = fadeRef.current

    // Fade animation
    if (Math.abs(fade.progress - fade.target) > 0.001) {
      const speed = 1.0 / 0.8
      if (fade.target > fade.progress) {
        fade.progress = Math.min(fade.progress + delta * speed, fade.target)
      } else {
        fade.progress = Math.max(fade.progress - delta * speed, fade.target)
      }
    } else {
      fade.progress = fade.target
    }

    const t = fade.progress

    // Update uniforms
    earthMaterial.uniforms.uOpacity.value = t
    atmosphereMaterial.uniforms.uOpacity.value = t

    // Group visibility
    groupRef.current.visible = t > 0.001

    // Scale pop: 0.9 -> 1.0
    const scale = 0.9 + 0.1 * t
    groupRef.current.scale.setScalar(scale)

    // Auto-rotate slowly
    if (t > 0.001 && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05
    }

    // Call onReady once
    if (t > 0.95 && !hasCalledReady && onReady) {
      setHasCalledReady(true)
      onReady()
    }
  })

  // Reset ready state
  useEffect(() => {
    if (!visible) setHasCalledReady(false)
  }, [visible])

  return (
    <>
      <group ref={groupRef} visible={false}>
        {/* Sun light positioned according to actual time */}
        <directionalLight
          position={[sunDirection.x * 10, sunDirection.y * 10, sunDirection.z * 10]}
          intensity={2}
          color="#ffeedd"
        />
        <ambientLight intensity={0.08} />

        {/* Earth with day/night shader */}
        <mesh
          ref={earthRef}
          geometry={earthGeometry}
          material={earthMaterial}
        />

        {/* Atmosphere */}
        <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />
      </group>

      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
      />
    </>
  )
}
