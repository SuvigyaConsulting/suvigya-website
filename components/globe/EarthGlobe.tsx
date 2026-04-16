'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface EarthGlobeProps {
  visible: boolean
  onReady?: () => void
}

const GLOBE_RADIUS = 2.5
const ATMOSPHERE_RADIUS = 2.7
const OUTER_ATMOSPHERE_RADIUS = 2.95
const SEGMENTS = 64

// Custom shader for the globe surface with grid lines
const globeVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const globeFragmentShader = `
  uniform float uOpacity;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Simplex-like noise for continent shapes
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 baseColor = vec3(0.039, 0.086, 0.157); // #0a1628 deep navy

    // Generate continent-like landmasses using layered noise
    vec3 noisePos = vPosition * 1.2;
    float continent = snoise(noisePos * 0.8 + vec3(3.0, 1.0, 2.0));
    continent += snoise(noisePos * 1.6 + vec3(7.0, 3.0, 5.0)) * 0.5;
    continent += snoise(noisePos * 3.2 + vec3(11.0, 7.0, 13.0)) * 0.25;
    continent = continent / 1.75;

    // Land threshold
    float landMask = smoothstep(0.05, 0.15, continent);

    // Land color: teal-green tones
    vec3 landColor = mix(
      vec3(0.04, 0.45, 0.38),  // darker teal
      vec3(0.078, 0.722, 0.651), // #14b8a6 teal
      snoise(noisePos * 4.0) * 0.5 + 0.5
    );

    // Ocean depth variation
    vec3 oceanColor = mix(
      baseColor,
      vec3(0.05, 0.12, 0.22),
      snoise(noisePos * 2.0) * 0.3 + 0.3
    );

    vec3 surfaceColor = mix(oceanColor, landColor, landMask);

    // Grid lines (latitude/longitude)
    float pi = 3.14159265359;
    vec3 norm = normalize(vPosition);
    float lat = asin(norm.y);
    float lon = atan(norm.z, norm.x);

    // Latitude lines every 30 degrees
    float latLine = abs(fract(lat / (pi / 6.0) + 0.5) - 0.5);
    float latGrid = 1.0 - smoothstep(0.01, 0.03, latLine);

    // Longitude lines every 30 degrees
    float lonLine = abs(fract(lon / (pi / 6.0) + 0.5) - 0.5);
    float lonGrid = 1.0 - smoothstep(0.01, 0.03, lonLine);

    float grid = max(latGrid, lonGrid) * 0.3;
    vec3 gridColor = vec3(0.1, 0.82, 0.74); // brighter teal for data-driven look

    surfaceColor = mix(surfaceColor, gridColor, grid);

    // Subtle glow on land edges
    float edgeGlow = smoothstep(0.05, 0.15, continent) - smoothstep(0.15, 0.25, continent);
    surfaceColor += gridColor * edgeGlow * 0.3;

    // Animated data points (small bright dots scattered on surface)
    float dots = snoise(noisePos * 20.0 + vec3(uTime * 0.5, 0.0, 0.0));
    dots = smoothstep(0.85, 0.9, dots) * landMask;
    vec3 dotColor = vec3(0.788, 0.659, 0.298); // gold #c9a84c
    surfaceColor += dotColor * dots * 0.6;

    // Fresnel rim light for depth — intensified
    float fresnel = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    fresnel = pow(fresnel, 2.0);
    surfaceColor += gridColor * fresnel * 0.4;

    gl_FragColor = vec4(surfaceColor, uOpacity);
  }
`

// Atmosphere glow shader
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
    float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    float sharpFresnel = pow(fresnel, 2.5);
    float softFresnel = pow(fresnel, 1.5);

    // Brighter teal at edges with a warm core blend
    vec3 edgeColor = vec3(0.12, 0.85, 0.78); // brighter teal
    vec3 coreColor = vec3(0.078, 0.722, 0.651); // standard teal
    vec3 glowColor = mix(coreColor, edgeColor, sharpFresnel);

    float alpha = (sharpFresnel * 0.8 + softFresnel * 0.2) * uOpacity;

    gl_FragColor = vec4(glowColor, alpha);
  }
`

// Outer atmosphere (second glow layer) — larger, softer
const outerAtmosphereFragmentShader = `
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    fresnel = pow(fresnel, 2.0);

    vec3 glowColor = vec3(0.06, 0.55, 0.50); // softer teal
    float alpha = fresnel * 0.35 * uOpacity;

    gl_FragColor = vec4(glowColor, alpha);
  }
`

export default function EarthGlobe({ visible, onReady }: EarthGlobeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hasCalledReady, setHasCalledReady] = useState(false)
  const fadeRef = useRef({ opacity: 0, target: 0 })

  // Globe geometry
  const globeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(GLOBE_RADIUS, SEGMENTS, SEGMENTS)
  }, [])

  // Atmosphere geometry
  const atmosphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(ATMOSPHERE_RADIUS, SEGMENTS, SEGMENTS)
  }, [])

  // Outer atmosphere geometry (second glow layer)
  const outerAtmosphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(OUTER_ATMOSPHERE_RADIUS, SEGMENTS, SEGMENTS)
  }, [])

  // Globe shader material
  const globeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: globeVertexShader,
      fragmentShader: globeFragmentShader,
      uniforms: {
        uOpacity: { value: 0 },
        uTime: { value: 0 },
      },
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: true,
    })
  }, [])

  // Atmosphere shader material
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

  // Outer atmosphere shader material (second glow layer)
  const outerAtmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: outerAtmosphereFragmentShader,
      uniforms: {
        uOpacity: { value: 0 },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  // Track visibility changes
  useEffect(() => {
    fadeRef.current.target = visible ? 1 : 0
  }, [visible])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      globeGeometry.dispose()
      atmosphereGeometry.dispose()
      outerAtmosphereGeometry.dispose()
      globeMaterial.dispose()
      atmosphereMaterial.dispose()
      outerAtmosphereMaterial.dispose()
    }
  }, [globeGeometry, atmosphereGeometry, outerAtmosphereGeometry, globeMaterial, atmosphereMaterial, outerAtmosphereMaterial])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const fade = fadeRef.current

    // Fade animation
    if (Math.abs(fade.opacity - fade.target) > 0.001) {
      fade.opacity += (fade.target - fade.opacity) * Math.min(delta * 3, 1)
    } else {
      fade.opacity = fade.target
    }

    // Update uniforms
    globeMaterial.uniforms.uOpacity.value = fade.opacity
    globeMaterial.uniforms.uTime.value += delta
    atmosphereMaterial.uniforms.uOpacity.value = fade.opacity
    outerAtmosphereMaterial.uniforms.uOpacity.value = fade.opacity

    // Show/hide the group
    groupRef.current.visible = fade.opacity > 0.001

    // Scale pop: 0.8 → 1.0 as opacity goes 0 → 1
    const scale = 0.8 + 0.2 * fade.opacity
    groupRef.current.scale.setScalar(scale)

    // Auto-rotate with subtle X-axis wobble
    if (fade.opacity > 0.001) {
      const t = clock.getElapsedTime()
      groupRef.current.rotation.y += 0.002
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.04
    }

    // Call onReady once fully visible
    if (fade.opacity > 0.95 && !hasCalledReady && onReady) {
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
        {/* Main globe */}
        <mesh geometry={globeGeometry} material={globeMaterial} />

        {/* Atmosphere glow — inner layer */}
        <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />

        {/* Atmosphere glow — outer layer (double-glow effect) */}
        <mesh geometry={outerAtmosphereGeometry} material={outerAtmosphereMaterial} />
      </group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  )
}
