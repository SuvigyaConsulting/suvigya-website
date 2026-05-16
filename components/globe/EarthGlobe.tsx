'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface EarthGlobeProps {
  visible: boolean
  onReady?: () => void
  autoRotate?: boolean
}

const GLOBE_RADIUS = 2.5
const ATMOSPHERE_RADIUS = 2.56

// Calculate accurate sun direction from current time
// Accounts for Earth's axial tilt (23.44°) and day of year for seasonal declination
function getSunDirection(): THREE.Vector3 {
  const now = new Date()

  // Day of year (0-365)
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

  // Solar declination angle (accounts for Earth's 23.44° tilt)
  // Peaks at summer solstice (~day 172), minimum at winter solstice (~day 355)
  const declination = 23.44 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81)) * (Math.PI / 180)

  // Hour angle: sun longitude based on UTC time
  // Solar noon at 0° longitude is ~12:00 UTC
  const hours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600
  const hourAngle = ((12 - hours) * 15) * (Math.PI / 180)

  return new THREE.Vector3(
    Math.cos(declination) * Math.cos(hourAngle),
    Math.sin(declination),
    Math.cos(declination) * Math.sin(hourAngle)
  ).normalize()
}

// Custom earth shader with day/night blending
const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    // Normal in WORLD space (not view space) so sun direction comparison is correct
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
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

    vec3 normal = normalize(vNormal);
    float sunDot = dot(normal, uSunDirection);

    // Start from the texture as-is — it's already vivid (NASA Blue Marble)
    vec3 color = dayColor.rgb;

    // Slight desaturation toward natural — pulls back the cartoonish punch
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, 0.88);

    // Soft directional lighting for 3D depth (slightly stronger directional component)
    float diffuse = max(sunDot, 0.0) * 0.35 + 0.65;
    color *= diffuse;

    // Specular on oceans — softened so the highlight doesn't read as a cyan stripe
    float spec = pow(max(dot(reflect(-uSunDirection, normal), normalize(cameraPosition - vWorldPosition)), 0.0), 40.0);
    float oceanMask = 1.0 - smoothstep(0.08, 0.25, length(dayColor.rgb - vec3(0.05, 0.1, 0.2)));
    color += vec3(0.35, 0.4, 0.5) * spec * oceanMask * 0.1;

    gl_FragColor = vec4(color, uOpacity);
  }
`

// Atmosphere shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
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
    // Sharp falloff — only visible as a thin rim, not a glass shell
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 5.0);

    float sunDot = dot(vNormal, uSunDirection);

    // Rayleigh blue on sunlit side
    vec3 rayleighColor = vec3(0.35, 0.55, 1.0);

    // Sunset orange at terminator
    float terminatorFactor = 1.0 - abs(sunDot);
    terminatorFactor = pow(terminatorFactor, 6.0) * smoothstep(-0.2, 0.05, sunDot);
    vec3 sunsetColor = vec3(1.0, 0.45, 0.15);

    // Night side: nearly invisible
    vec3 nightColor = vec3(0.02, 0.04, 0.12);

    float dayIntensity = smoothstep(-0.05, 0.4, sunDot);

    vec3 atmosColor = mix(nightColor, rayleighColor, dayIntensity);
    atmosColor = mix(atmosColor, sunsetColor, terminatorFactor * 0.5);

    // Very thin rim — barely visible except at the very edge
    float alpha = fresnel * (0.04 + dayIntensity * 0.06) * uOpacity;

    gl_FragColor = vec4(atmosColor, alpha);
  }
`

export default function EarthGlobe({ visible, onReady, autoRotate = true, children }: EarthGlobeProps & { children?: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null)
  const earthRef = useRef<THREE.Mesh>(null)
  const [hasCalledReady, setHasCalledReady] = useState(false)
  const fadeRef = useRef({ progress: 0, target: 0 })

  // Sun direction based on user's current time
  const sunDirection = useMemo(() => getSunDirection(), [])

  // Textures
  const [dayMap, nightMap, bumpMap] = useTexture([
    '/textures/earth-8k.jpg',
    '/textures/earth-night-hd.jpg',
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
      const speed = 1.0 / 1.5 // Slower fade-in (1.5s) for smooth crossfade with particles
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

    // Keep scale at 1.0 — the earth radius must match the particles' converged radius
    // (both = 2.5) so the morph reads as "particles BECOME the globe." A scale-pop
    // entrance breaks that illusion by making the globe appear smaller and grow.
    groupRef.current.scale.setScalar(1)

    // Auto-rotation handled by OrbitControls autoRotate — no manual rotation needed

    // Call onReady once — gated on `visible` so we don't spuriously fire when
    // the fade is decaying *out* (fade.progress can still be > 0.95 for one
    // frame after visible flips to false). Without this gate, the spurious
    // fire sets hasCalledReady=true while we're leaving globe phase, and on
    // re-entry hasCalledReady never resets (the reset effect only fires on
    // !visible, which doesn't re-trigger). Result: no pins on second Explore.
    if (visible && t > 0.95 && !hasCalledReady && onReady) {
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
      {/* Sun light OUTSIDE the rotating group — stays fixed in space */}
      <directionalLight
        position={[sunDirection.x * 10, sunDirection.y * 10, sunDirection.z * 10]}
        intensity={2}
        color="#ffeedd"
      />
      <ambientLight intensity={0.08} />

      {/* Rotating group: earth + atmosphere + pins — rotated so India/South Asia faces the camera.
          The lat→vec3 helper places India at world (~2.35, ~0.86, ~0) under the prior -1.36 rotation,
          i.e. on the right horizon. -2.93 swings the pin cluster directly in front of the camera. */}
      <group ref={groupRef} visible={false} rotation={[0, -2.93, 0]}>
        <mesh
          ref={earthRef}
          geometry={earthGeometry}
          material={earthMaterial}
        />
        <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />
        {children}
      </group>

      <OrbitControls
        makeDefault
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.0}
        maxDistance={9}
        zoomSpeed={0.7}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
        autoRotate={autoRotate}
        autoRotateSpeed={0.25}
      />
    </>
  )
}
