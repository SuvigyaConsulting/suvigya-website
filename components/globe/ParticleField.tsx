'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const IS_MOBILE =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(max-width: 767px)').matches

// Fewer particles on phones — the per-frame loop is the dominant mobile CPU cost
const PARTICLE_COUNT = IS_MOBILE ? 1400 : 3000
const SPHERE_RADIUS = 8
const TARGET_RADIUS = 2.5
const MORPH_DURATION = 3.5
const UNMORPH_DURATION = 1.8

// Star field constants
const STAR_COUNT = IS_MOBILE ? 400 : 1000
const STAR_MIN_RADIUS = 40
const STAR_MAX_RADIUS = 80

// ── Idle motion (replaces the old Brownian random-walk, which is what made the
// field "shimmer"/jitter). Each particle floats on slow sine waves around a
// FIXED home position — deterministic, so there's nothing to jitter. ──
const DRIFT_FREQ_X = 0.22
const DRIFT_FREQ_Y = 0.3
const DRIFT_FREQ_Z = 0.18

// ── Cursor interaction: a spring (ease a displacement toward a push target and
// back to zero), not accumulating momentum — smooth out, smooth return. ──
const CURSOR_RADIUS = 2.0
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS
const CURSOR_PUSH = 0.5 // max displacement (world units) next to the cursor
const CURSOR_SPRING = 5 // settle speed

// Subtle scroll parallax: how far (world units) the field lags over one viewport
// of scroll. Small + eased so scrolling reads as gentle depth, never a zoom/jump.
const PARALLAX_Y = 0.8

function fibonacciSphere(index: number, total: number, radius: number): THREE.Vector3 {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const y = 1 - (index / (total - 1)) * 2
  const radiusAtY = Math.sqrt(1 - y * y)
  const theta = goldenAngle * index
  return new THREE.Vector3(
    Math.cos(theta) * radiusAtY * radius,
    y * radius,
    Math.sin(theta) * radiusAtY * radius
  )
}

function randomInSphere(radius: number): THREE.Vector3 {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = radius * Math.cbrt(Math.random())
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  )
}

export default function ParticleField({ morphing, opacity = 1 }: { morphing: boolean; opacity?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const starsRef = useRef<THREE.Points>(null)
  const opacityRef = useRef(1)
  const morphStateRef = useRef({
    active: false,
    direction: 1, // 1 = morphing in, -1 = morphing out
    progress: 0,
    elapsedSinceMorphStart: 0,
  })

  // Keep opacity ref in sync with prop
  opacityRef.current = opacity

  // Pre-allocate all data arrays
  const {
    positions,
    originalPositions,
    targetPositions,
    cursorDisp,
    driftAmp,
    driftPhase,
    colors,
    sizes,
    baseSizes,
    opacities,
    pulseFlags,
    pulseFrequencies,
    pulsePhases,
  } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const origPos = new Float32Array(PARTICLE_COUNT * 3)
    const targPos = new Float32Array(PARTICLE_COUNT * 3)
    const cDisp = new Float32Array(PARTICLE_COUNT * 3)
    const dAmp = new Float32Array(PARTICLE_COUNT)
    const dPhase = new Float32Array(PARTICLE_COUNT)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const bsz = new Float32Array(PARTICLE_COUNT)
    const op = new Float32Array(PARTICLE_COUNT)
    const pFlags = new Float32Array(PARTICLE_COUNT)
    const pFreqs = new Float32Array(PARTICLE_COUNT)
    const pPhases = new Float32Array(PARTICLE_COUNT)

    // White-dominant with a cool-blue minority — the scheme the client liked.
    const white = new THREE.Color('#eef2f8')
    const coolBlue = new THREE.Color('#a9c2e0')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const point = randomInSphere(SPHERE_RADIUS)
      const i3 = i * 3

      pos[i3] = point.x
      pos[i3 + 1] = point.y
      pos[i3 + 2] = point.z

      origPos[i3] = point.x
      origPos[i3 + 1] = point.y
      origPos[i3 + 2] = point.z

      // Fibonacci sphere target
      const target = fibonacciSphere(i, PARTICLE_COUNT, TARGET_RADIUS)
      targPos[i3] = target.x
      targPos[i3 + 1] = target.y
      targPos[i3 + 2] = target.z

      // Idle float parameters (gentle amplitude, randomised phase per particle)
      dAmp[i] = 0.04 + Math.random() * 0.06
      dPhase[i] = Math.random() * Math.PI * 2

      // ~80% white, ~20% faint cool-blue
      const color = Math.random() < 0.2 ? coolBlue : white
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b

      // Smaller than the original (the size the client liked); the soft glow
      // keeps each particle present so the field doesn't read as sparse.
      const baseSize = 0.03 + Math.random() * 0.04
      sz[i] = baseSize
      bsz[i] = baseSize

      // Opacity kept fairly high so the smaller particles still read clearly
      op[i] = 0.5 + Math.random() * 0.45

      // Twinkle — calmed down: fewer particles pulse, gentler amplitude (was
      // ~20% @ 0.3, which read as "shimmering too much").
      pFlags[i] = Math.random() < 0.1 ? 1.0 : 0.0
      pFreqs[i] = 0.3 + Math.random() * 0.8
      pPhases[i] = Math.random() * Math.PI * 2
    }

    return {
      positions: pos,
      originalPositions: origPos,
      targetPositions: targPos,
      cursorDisp: cDisp,
      driftAmp: dAmp,
      driftPhase: dPhase,
      colors: col,
      sizes: sz,
      baseSizes: bsz,
      opacities: op,
      pulseFlags: pFlags,
      pulseFrequencies: pFreqs,
      pulsePhases: pPhases,
    }
  }, [])

  // Star field data (ORIGINAL)
  const { starPositions, starSizes, starOpacities } = useMemo(() => {
    const sPos = new Float32Array(STAR_COUNT * 3)
    const sSz = new Float32Array(STAR_COUNT)
    const sOp = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = STAR_MIN_RADIUS + Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS)
      const i3 = i * 3
      sPos[i3] = r * Math.sin(phi) * Math.cos(theta)
      sPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      sPos[i3 + 2] = r * Math.cos(phi)
      sSz[i] = 0.02 + Math.random() * 0.02
      sOp[i] = 0.2 + Math.random() * 0.4
    }

    return { starPositions: sPos, starSizes: sSz, starOpacities: sOp }
  }, [])

  // Particle shader material (ORIGINAL — soft glow disc, additive). Unchanged.
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uGlobalOpacity: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          vOpacity = opacity;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uGlobalOpacity;
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha * uGlobalOpacity);
        }
      `,
      vertexColors: true,
    })
  }, [])

  // Star shader material (ORIGINAL — white, static). Unchanged.
  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying float vOpacity;
        void main() {
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.05, dist) * vOpacity;
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
    })
  }, [])

  // Track morphing prop changes
  useEffect(() => {
    const state = morphStateRef.current
    if (morphing) {
      state.active = true
      state.direction = 1
      state.progress = 0
      state.elapsedSinceMorphStart = 0
      // Store current positions as originals for the morph animation
      const geo = pointsRef.current?.geometry
      if (geo) {
        const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array
        for (let i = 0; i < arr.length; i++) {
          originalPositions[i] = arr[i]
        }
      }
    } else {
      // Instantly reset to scattered positions — no visible sphere on back transition
      state.active = false
      state.direction = 1
      state.progress = 0
      state.elapsedSinceMorphStart = 0
      const geo = pointsRef.current?.geometry
      if (geo) {
        const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          const point = randomInSphere(SPHERE_RADIUS)
          arr[i3] = point.x
          arr[i3 + 1] = point.y
          arr[i3 + 2] = point.z
          originalPositions[i3] = point.x
          originalPositions[i3 + 1] = point.y
          originalPositions[i3 + 2] = point.z
          cursorDisp[i3] = 0
          cursorDisp[i3 + 1] = 0
          cursorDisp[i3 + 2] = 0
        }
        posAttr.needsUpdate = true
      }
    }
  }, [morphing, originalPositions, cursorDisp])

  // Pause the heavy per-particle loop when the hero is scrolled off-screen
  // (invisible; just saves main-thread time so the rest of the page scrolls light).
  const visibleRef = useRef(true)
  const scrollProgressRef = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1
      const y = window.scrollY
      visibleRef.current = y < h * 0.98
      scrollProgressRef.current = Math.min(1, y / h)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Pre-allocate temp objects for the frame loop (avoid GC pressure)
  const tempRayOrigin = useMemo(() => new THREE.Vector3(), [])
  const tempRayDir = useMemo(() => new THREE.Vector3(), [])
  const tempMat = useMemo(() => new THREE.Matrix4(), [])
  const globalTimeRef = useRef(0)
  const parallaxRef = useRef(0)

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    // Clamp delta so one janky frame (scroll) can't teleport anything; all idle
    // motion is a function of absolute time, so it's frame-rate independent.
    const dt = Math.min(delta, 1 / 30)
    globalTimeRef.current += dt
    const time = globalTimeRef.current

    // Slow night-sky rotation (ORIGINAL)
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.008
      groupRef.current.rotation.x += dt * 0.002

      // Subtle, smooth scroll parallax — the field gently lags the page scroll
      // (eased), so scrolling reads as depth, never a 1:1 jump/zoom. Eased to 0
      // during morph/globe so the sphere stays centred.
      const parallaxTarget = morphing ? 0 : -scrollProgressRef.current * PARALLAX_Y
      parallaxRef.current += (parallaxTarget - parallaxRef.current) * Math.min(dt * 3, 0.12)
      groupRef.current.position.y = parallaxRef.current
    }

    // Smooth lerp for global opacity (crossfade with earth)
    const currentOp = particleMaterial.uniforms.uGlobalOpacity.value
    const targetOp = opacityRef.current
    particleMaterial.uniforms.uGlobalOpacity.value += (targetOp - currentOp) * Math.min(dt * 3, 0.15)

    // Off-screen → skip the heavy work (always run while morphing)
    if (!morphing && !visibleRef.current) return

    const geometry = pointsRef.current.geometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const sizeAttr = geometry.getAttribute('size') as THREE.BufferAttribute
    const sizeArray = sizeAttr.array as Float32Array

    const morphState = morphStateRef.current

    // Cursor ray → group-LOCAL space so the push tracks the visible cursor as the
    // field slowly rotates (was world-space before, so it drifted off-cursor).
    const { pointer, camera, raycaster } = state
    raycaster.setFromCamera(pointer, camera)
    const rayOrigin = tempRayOrigin.copy(raycaster.ray.origin)
    const rayDir = tempRayDir.copy(raycaster.ray.direction)
    if (groupRef.current) {
      const inv = tempMat.copy(groupRef.current.matrixWorld).invert()
      rayOrigin.applyMatrix4(inv)
      rayDir.transformDirection(inv)
    }

    // Gentle twinkle (calmed: amplitude 0.3 → 0.15)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (pulseFlags[i] > 0.5) {
        const pulse = Math.sin(time * pulseFrequencies[i] * Math.PI * 2 + pulsePhases[i])
        sizeArray[i] = baseSizes[i] * (1.0 + pulse * 0.15)
      }
    }
    sizeAttr.needsUpdate = true

    // Update morph progress (ORIGINAL, dt-based)
    if (morphState.active) {
      morphState.elapsedSinceMorphStart += dt
      if (morphState.direction === 1) {
        morphState.progress += dt / MORPH_DURATION
        if (morphState.progress >= 1) {
          morphState.progress = 1
          morphState.active = false
        }
      } else {
        morphState.progress -= dt / UNMORPH_DURATION
        if (morphState.progress <= 0) {
          morphState.progress = 0
          morphState.active = false
          morphState.direction = 1
          const geo = pointsRef.current?.geometry
          if (geo) {
            const pAttr = geo.getAttribute('position') as THREE.BufferAttribute
            const arr = pAttr.array as Float32Array
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const i3 = i * 3
              arr[i3] = targetPositions[i3]
              arr[i3 + 1] = targetPositions[i3 + 1]
              arr[i3 + 2] = targetPositions[i3 + 2]
              originalPositions[i3] = targetPositions[i3]
              originalPositions[i3 + 1] = targetPositions[i3 + 1]
              originalPositions[i3 + 2] = targetPositions[i3 + 2]
              cursorDisp[i3] = 0
              cursorDisp[i3 + 1] = 0
              cursorDisp[i3 + 2] = 0
            }
            pAttr.needsUpdate = true
          }
        }
      }
    }

    const t = morphState.progress
    const eased = t * t * (3 - 2 * t)
    const springK = 1 - Math.exp(-dt * CURSOR_SPRING)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      if (morphState.active || t > 0) {
        // ── Morph branch (ORIGINAL, verbatim) ──
        const ox = originalPositions[i3]
        const oy = originalPositions[i3 + 1]
        const oz = originalPositions[i3 + 2]

        let tx: number, ty: number, tz: number

        if (morphState.direction === 1 || t > 0) {
          if (morphState.direction === 1) {
            const fibTarget = fibonacciSphere(i, PARTICLE_COUNT, TARGET_RADIUS)
            tx = fibTarget.x
            ty = fibTarget.y
            tz = fibTarget.z
          } else {
            tx = targetPositions[i3]
            ty = targetPositions[i3 + 1]
            tz = targetPositions[i3 + 2]
          }
        } else {
          tx = targetPositions[i3]
          ty = targetPositions[i3 + 1]
          tz = targetPositions[i3 + 2]
        }

        if (morphState.active && morphState.direction === 1) {
          const stagger = (i / PARTICLE_COUNT) * 0.4
          const adjustedT = Math.max(0, Math.min(1, (t - stagger) / (1 - stagger)))
          const smooth = adjustedT < 0.5
            ? 16 * adjustedT * adjustedT * adjustedT * adjustedT * adjustedT
            : 1 - Math.pow(-2 * adjustedT + 2, 5) / 2

          posArray[i3] = ox + (tx - ox) * smooth
          posArray[i3 + 1] = oy + (ty - oy) * smooth
          posArray[i3 + 2] = oz + (tz - oz) * smooth
        } else if (morphState.active && morphState.direction === -1) {
          const elapsed = morphState.elapsedSinceMorphStart
          const reverseSpiral = Math.sin(elapsed * 4 + i * 0.01) * (1.0 - (1.0 - t)) * 0.5

          posArray[i3] = ox + (tx - ox) * eased + reverseSpiral
          posArray[i3 + 1] = oy + (ty - oy) * eased
          posArray[i3 + 2] = oz + (tz - oz) * eased + reverseSpiral * 0.7
        } else {
          posArray[i3] = ox + (tx - ox) * eased
          posArray[i3 + 1] = oy + (ty - oy) * eased
          posArray[i3 + 2] = oz + (tz - oz) * eased
        }
      } else {
        // ── Idle: smooth deterministic float around home + spring cursor push.
        // (Replaces the random-walk Brownian motion that caused the shimmer.) ──
        const hx = originalPositions[i3]
        const hy = originalPositions[i3 + 1]
        const hz = originalPositions[i3 + 2]
        const amp = driftAmp[i]
        const ph = driftPhase[i]
        const bx = hx + amp * Math.sin(time * DRIFT_FREQ_X + ph)
        const by = hy + amp * Math.sin(time * DRIFT_FREQ_Y + ph * 1.7)
        const bz = hz + amp * Math.sin(time * DRIFT_FREQ_Z + ph * 0.9)

        let tgx = 0
        let tgy = 0
        let tgz = 0
        if (!IS_MOBILE) {
          const orx = bx - rayOrigin.x
          const ory = by - rayOrigin.y
          const orz = bz - rayOrigin.z
          const proj = orx * rayDir.x + ory * rayDir.y + orz * rayDir.z
          const ddx = bx - (rayOrigin.x + rayDir.x * proj)
          const ddy = by - (rayOrigin.y + rayDir.y * proj)
          const ddz = bz - (rayOrigin.z + rayDir.z * proj)
          const dSq = ddx * ddx + ddy * ddy + ddz * ddz
          if (dSq < CURSOR_RADIUS_SQ && dSq > 0.0001) {
            const dlen = Math.sqrt(dSq)
            const fall = 1 - dlen / CURSOR_RADIUS
            const push = (fall * fall * CURSOR_PUSH) / dlen
            tgx = ddx * push
            tgy = ddy * push
            tgz = ddz * push
          }
        }

        cursorDisp[i3] += (tgx - cursorDisp[i3]) * springK
        cursorDisp[i3 + 1] += (tgy - cursorDisp[i3 + 1]) * springK
        cursorDisp[i3 + 2] += (tgz - cursorDisp[i3 + 2]) * springK

        posArray[i3] = bx + cursorDisp[i3]
        posArray[i3 + 1] = by + cursorDisp[i3 + 1]
        posArray[i3 + 2] = bz + cursorDisp[i3 + 2]
      }
    }

    posAttr.needsUpdate = true
  })

  // Geometry setup (ORIGINAL)
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))
    return geo
  }, [positions, colors, sizes, opacities])

  // Star field geometry (ORIGINAL)
  const starGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
    geo.setAttribute('opacity', new THREE.BufferAttribute(starOpacities, 1))
    return geo
  }, [starPositions, starSizes, starOpacities])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pointsGeometry.dispose()
      starGeometry.dispose()
      particleMaterial.dispose()
      starMaterial.dispose()
    }
  }, [pointsGeometry, starGeometry, particleMaterial, starMaterial])

  return (
    <group ref={groupRef}>
      <points ref={starsRef} geometry={starGeometry} material={starMaterial} />
      <points ref={pointsRef} geometry={pointsGeometry} material={particleMaterial} />
    </group>
  )
}
