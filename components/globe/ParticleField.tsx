'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 3000
const SPHERE_RADIUS = 8
const TARGET_RADIUS = 2.5
const CONNECTION_DISTANCE = 2.0
const MAX_CONNECTIONS = 200
const MORPH_DURATION = 2.0
const UNMORPH_DURATION = 1.5
const CENTER_PULL_STRENGTH = 0.00003

// Star field constants
const STAR_COUNT = 1000
const STAR_MIN_RADIUS = 40
const STAR_MAX_RADIUS = 80

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

export default function ParticleField({ morphing }: { morphing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const starsRef = useRef<THREE.Points>(null)
  const morphStateRef = useRef({
    active: false,
    direction: 1, // 1 = morphing in, -1 = morphing out
    progress: 0,
    connectionOpacity: 1,
    elapsedSinceMorphStart: 0,
  })

  // Pre-allocate all data arrays
  const {
    positions,
    originalPositions,
    targetPositions,
    velocities,
    colors,
    sizes,
    baseSizes,
    opacities,
    pulseFlags,
    pulseFrequencies,
    pulsePhases,
    linePositions,
    lineColors,
  } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const origPos = new Float32Array(PARTICLE_COUNT * 3)
    const targPos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const bsz = new Float32Array(PARTICLE_COUNT)
    const op = new Float32Array(PARTICLE_COUNT)
    const pFlags = new Float32Array(PARTICLE_COUNT)
    const pFreqs = new Float32Array(PARTICLE_COUNT)
    const pPhases = new Float32Array(PARTICLE_COUNT)

    const teal = new THREE.Color('#14b8a6')
    const white = new THREE.Color('#f0f2f5')
    const gold = new THREE.Color('#c9a84c')
    const palette = [teal, white, gold]

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

      // Random velocity for Brownian motion
      vel[i3] = (Math.random() - 0.5) * 0.002
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002

      // Random color from palette
      const color = palette[Math.floor(Math.random() * palette.length)]
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b

      // Random size (larger range: 0.04-0.1)
      const baseSize = 0.04 + Math.random() * 0.06
      sz[i] = baseSize
      bsz[i] = baseSize

      // Random opacity (brighter: 0.5-1.0)
      op[i] = 0.5 + Math.random() * 0.5

      // ~20% of particles pulse
      pFlags[i] = Math.random() < 0.2 ? 1.0 : 0.0
      pFreqs[i] = 0.5 + Math.random() * 2.0 // frequency between 0.5 and 2.5 Hz
      pPhases[i] = Math.random() * Math.PI * 2 // random phase offset
    }

    // Connection lines buffer (2 vertices per line, 3 components each)
    const linePosBuffer = new Float32Array(MAX_CONNECTIONS * 2 * 3)
    const lineColBuffer = new Float32Array(MAX_CONNECTIONS * 2 * 4)

    return {
      positions: pos,
      originalPositions: origPos,
      targetPositions: targPos,
      velocities: vel,
      colors: col,
      sizes: sz,
      baseSizes: bsz,
      opacities: op,
      pulseFlags: pFlags,
      pulseFrequencies: pFreqs,
      pulsePhases: pPhases,
      linePositions: linePosBuffer,
      lineColors: lineColBuffer,
    }
  }, [])

  // Star field data
  const { starPositions, starSizes, starOpacities } = useMemo(() => {
    const sPos = new Float32Array(STAR_COUNT * 3)
    const sSz = new Float32Array(STAR_COUNT)
    const sOp = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      // Random position in a shell between STAR_MIN_RADIUS and STAR_MAX_RADIUS
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = STAR_MIN_RADIUS + Math.random() * (STAR_MAX_RADIUS - STAR_MIN_RADIUS)
      const i3 = i * 3
      sPos[i3] = r * Math.sin(phi) * Math.cos(theta)
      sPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      sPos[i3 + 2] = r * Math.cos(phi)

      // Very small sizes (0.02-0.04)
      sSz[i] = 0.02 + Math.random() * 0.02

      // Low opacity (0.2-0.6)
      sOp[i] = 0.2 + Math.random() * 0.4
    }

    return { starPositions: sPos, starSizes: sSz, starOpacities: sOp }
  }, [])

  // Particle shader material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
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
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
    })
  }, [])

  // Star shader material (white, static)
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

  // Line material
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.15,
      color: new THREE.Color('#14b8a6'),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
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
      if (state.progress > 0) {
        state.active = true
        state.direction = -1
        state.progress = 1
        state.elapsedSinceMorphStart = 0
        // Store current positions for reverse animation and regenerate random targets
        const geo = pointsRef.current?.geometry
        if (geo) {
          const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
          const arr = posAttr.array as Float32Array
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            // Current position becomes the start for reverse
            originalPositions[i3] = targetPositions[i3]
            originalPositions[i3 + 1] = targetPositions[i3 + 1]
            originalPositions[i3 + 2] = targetPositions[i3 + 2]
            // Generate new random target positions for un-morph
            const point = randomInSphere(SPHERE_RADIUS)
            targetPositions[i3] = point.x
            targetPositions[i3 + 1] = point.y
            targetPositions[i3 + 2] = point.z
          }
        }
      }
    }
  }, [morphing, originalPositions, targetPositions])

  // Temp vectors to avoid allocations in the frame loop
  const tempVec = useMemo(() => new THREE.Vector3(), [])
  const tempVec2 = useMemo(() => new THREE.Vector3(), [])

  // Track global time for pulsing
  const globalTimeRef = useRef(0)

  useFrame((_, delta) => {
    if (!pointsRef.current || !linesRef.current) return

    // Slow rotation like the night sky
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03
      groupRef.current.rotation.x += delta * 0.008
    }

    globalTimeRef.current += delta

    const geometry = pointsRef.current.geometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array
    const sizeAttr = geometry.getAttribute('size') as THREE.BufferAttribute
    const sizeArray = sizeAttr.array as Float32Array

    const state = morphStateRef.current
    const time = globalTimeRef.current

    // Update pulsing particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (pulseFlags[i] > 0.5) {
        const pulse = Math.sin(time * pulseFrequencies[i] * Math.PI * 2 + pulsePhases[i])
        // Oscillate size between 0.7x and 1.3x of base size
        sizeArray[i] = baseSizes[i] * (1.0 + pulse * 0.3)
      }
    }
    sizeAttr.needsUpdate = true

    // Update morph progress
    if (state.active) {
      state.elapsedSinceMorphStart += delta
      if (state.direction === 1) {
        state.progress += delta / MORPH_DURATION
        if (state.progress >= 1) {
          state.progress = 1
          state.active = false
        }
      } else {
        state.progress -= delta / UNMORPH_DURATION
        if (state.progress <= 0) {
          state.progress = 0
          state.active = false
          state.direction = 1
          // Snap particles to their random target positions and reset for Brownian motion
          const geo = pointsRef.current?.geometry
          if (geo) {
            const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
            const arr = posAttr.array as Float32Array
            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const i3 = i * 3
              arr[i3] = targetPositions[i3]
              arr[i3 + 1] = targetPositions[i3 + 1]
              arr[i3 + 2] = targetPositions[i3 + 2]
              // Also update originalPositions so they match
              originalPositions[i3] = targetPositions[i3]
              originalPositions[i3 + 1] = targetPositions[i3 + 1]
              originalPositions[i3 + 2] = targetPositions[i3 + 2]
              // Reset velocities for fresh Brownian motion
              velocities[i3] = (Math.random() - 0.5) * 0.002
              velocities[i3 + 1] = (Math.random() - 0.5) * 0.002
              velocities[i3 + 2] = (Math.random() - 0.5) * 0.002
            }
            posAttr.needsUpdate = true
          }
        }
      }
    }

    const t = state.progress
    // Smooth ease in-out
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      if (state.active || t > 0) {
        const ox = originalPositions[i3]
        const oy = originalPositions[i3 + 1]
        const oz = originalPositions[i3 + 2]

        let tx: number, ty: number, tz: number

        if (state.direction === 1 || t > 0) {
          if (state.direction === 1) {
            // Fibonacci sphere target
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

        // SPIRAL VORTEX morph (only when morphing IN, direction === 1)
        if (state.active && state.direction === 1) {
          const elapsed = state.elapsedSinceMorphStart
          const totalDuration = MORPH_DURATION

          // Phase 1 (0-0.5s): Chaotic acceleration — particles speed up 3x
          // Phase 2 (0.5-1.5s): Spiral vortex inward — angular velocity around Y
          // Phase 3 (1.5-2.0s): Settle onto sphere surface

          const phase1End = 0.25 * totalDuration  // 0.5s at 2.0 duration
          const phase2End = 0.75 * totalDuration   // 1.5s at 2.0 duration

          // Base lerp position
          let lerpX = ox + (tx - ox) * eased
          let lerpY = oy + (ty - oy) * eased
          let lerpZ = oz + (tz - oz) * eased

          if (elapsed < phase1End) {
            // Phase 1: Chaotic burst — add velocity-like displacement
            const chaosIntensity = 1.0 - (elapsed / phase1End) // fades out
            const chaos = chaosIntensity * 3.0
            // Each particle gets a unique chaotic offset based on its index
            const seed = i * 1.618033988749
            const cx = Math.sin(seed * 3.7 + elapsed * 12.0) * chaos * 0.5
            const cy = Math.cos(seed * 2.3 + elapsed * 10.0) * chaos * 0.3
            const cz = Math.sin(seed * 5.1 + elapsed * 14.0) * chaos * 0.5
            lerpX += cx
            lerpY += cy
            lerpZ += cz
          } else if (elapsed < phase2End) {
            // Phase 2: Spiral vortex — rotate around Y axis while converging
            const phase2Progress = (elapsed - phase1End) / (phase2End - phase1End)
            // Angular velocity increases over time then stabilizes
            const angularSpeed = phase2Progress * 6.0 // max ~6 radians/sec
            const angle = angularSpeed * (elapsed - phase1End) + i * 0.002
            // Spiral radius decreases as particles converge
            const spiralRadius = (1.0 - eased) * 2.5

            // Rotate the offset (from center) around Y axis
            const dx = lerpX
            const dz = lerpZ
            const cosA = Math.cos(angle)
            const sinA = Math.sin(angle)
            lerpX = dx * cosA - dz * sinA + Math.cos(angle + i * 0.01) * spiralRadius * (1.0 - phase2Progress)
            lerpZ = dx * sinA + dz * cosA + Math.sin(angle + i * 0.01) * spiralRadius * (1.0 - phase2Progress)
          } else {
            // Phase 3: Settle — damped oscillation toward target
            const phase3Progress = (elapsed - phase2End) / (totalDuration - phase2End)
            const settleOscillation = Math.sin(phase3Progress * Math.PI * 3 + i * 0.1) * (1.0 - phase3Progress) * 0.15
            // Diminishing angular rotation
            const residualAngle = (1.0 - phase3Progress) * 1.5 * (elapsed - phase2End)
            const dx = lerpX
            const dz = lerpZ
            const cosA = Math.cos(residualAngle * 0.3)
            const sinA = Math.sin(residualAngle * 0.3)
            lerpX = dx * cosA - dz * sinA + settleOscillation
            lerpZ = dx * sinA + dz * cosA + settleOscillation * 0.5
          }

          posArray[i3] = lerpX
          posArray[i3 + 1] = lerpY
          posArray[i3 + 2] = lerpZ
        } else if (state.active && state.direction === -1) {
          // Un-morphing: simpler reverse with some spiral flair
          const elapsed = state.elapsedSinceMorphStart
          const reverseSpiral = Math.sin(elapsed * 4 + i * 0.01) * (1.0 - (1.0 - t)) * 0.5

          posArray[i3] = ox + (tx - ox) * eased + reverseSpiral
          posArray[i3 + 1] = oy + (ty - oy) * eased
          posArray[i3 + 2] = oz + (tz - oz) * eased + reverseSpiral * 0.7
        } else {
          // Holding at morphed position (not active but t > 0)
          posArray[i3] = ox + (tx - ox) * eased
          posArray[i3 + 1] = oy + (ty - oy) * eased
          posArray[i3 + 2] = oz + (tz - oz) * eased
        }
      } else {
        // Brownian motion when not morphing
        posArray[i3] += velocities[i3]
        posArray[i3 + 1] += velocities[i3 + 1]
        posArray[i3 + 2] += velocities[i3 + 2]

        // Slight random perturbation
        velocities[i3] += (Math.random() - 0.5) * 0.0004
        velocities[i3 + 1] += (Math.random() - 0.5) * 0.0004
        velocities[i3 + 2] += (Math.random() - 0.5) * 0.0004

        // Damping
        velocities[i3] *= 0.99
        velocities[i3 + 1] *= 0.99
        velocities[i3 + 2] *= 0.99

        // Soft boundary: pull back toward sphere
        tempVec.set(posArray[i3], posArray[i3 + 1], posArray[i3 + 2])
        const dist = tempVec.length()
        if (dist > SPHERE_RADIUS) {
          const pullback = (dist - SPHERE_RADIUS) * 0.001
          posArray[i3] -= tempVec.x / dist * pullback
          posArray[i3 + 1] -= tempVec.y / dist * pullback
          posArray[i3 + 2] -= tempVec.z / dist * pullback
        }

        // Gentle drift toward center (linear, not quadratic — prevents collapse)
        if (dist > 2.0) {
          const pull = CENTER_PULL_STRENGTH
          posArray[i3] -= tempVec.x / dist * pull
          posArray[i3 + 1] -= tempVec.y / dist * pull
          posArray[i3 + 2] -= tempVec.z / dist * pull
        }
        // Repulsion at close range — prevents particles from clustering at origin
        if (dist < 1.0 && dist > 0.01) {
          const push = 0.0003 * (1.0 - dist)
          posArray[i3] += tempVec.x / dist * push
          posArray[i3 + 1] += tempVec.y / dist * push
          posArray[i3 + 2] += tempVec.z / dist * push
        }
      }
    }

    posAttr.needsUpdate = true

    // Update connection lines
    const lineGeo = linesRef.current.geometry
    const linePosAttr = lineGeo.getAttribute('position') as THREE.BufferAttribute
    const linePosArray = linePosAttr.array as Float32Array

    // Fade connections during morph
    const connectionOpacity = state.active && state.direction === 1
      ? Math.max(0, 1 - eased * 3)
      : state.progress > 0 ? 0 : 1
    lineMaterial.opacity = 0.15 * connectionOpacity

    let lineCount = 0

    if (connectionOpacity > 0) {
      // Only check a subset of particles for connections (performance)
      const step = Math.max(1, Math.floor(PARTICLE_COUNT / 300))
      outer:
      for (let i = 0; i < PARTICLE_COUNT; i += step) {
        const i3 = i * 3
        tempVec.set(posArray[i3], posArray[i3 + 1], posArray[i3 + 2])

        for (let j = i + step; j < PARTICLE_COUNT; j += step) {
          const j3 = j * 3
          tempVec2.set(posArray[j3], posArray[j3 + 1], posArray[j3 + 2])

          const dx = tempVec.x - tempVec2.x
          const dy = tempVec.y - tempVec2.y
          const dz = tempVec.z - tempVec2.z
          const distSq = dx * dx + dy * dy + dz * dz

          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const idx = lineCount * 6
            linePosArray[idx] = tempVec.x
            linePosArray[idx + 1] = tempVec.y
            linePosArray[idx + 2] = tempVec.z
            linePosArray[idx + 3] = tempVec2.x
            linePosArray[idx + 4] = tempVec2.y
            linePosArray[idx + 5] = tempVec2.z
            lineCount++

            if (lineCount >= MAX_CONNECTIONS) break outer
          }
        }
      }
    }

    // Zero out unused line vertices
    for (let i = lineCount * 6; i < linePosArray.length; i++) {
      linePosArray[i] = 0
    }

    linePosAttr.needsUpdate = true
    lineGeo.setDrawRange(0, lineCount * 2)
  })

  // Geometry setup
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))
    return geo
  }, [positions, colors, sizes, opacities])

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geo.setDrawRange(0, 0)
    return geo
  }, [linePositions])

  // Star field geometry (static, no animation)
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
      lineGeometry.dispose()
      starGeometry.dispose()
      particleMaterial.dispose()
      starMaterial.dispose()
      lineMaterial.dispose()
    }
  }, [pointsGeometry, lineGeometry, starGeometry, particleMaterial, starMaterial, lineMaterial])

  return (
    <group ref={groupRef}>
      <points ref={starsRef} geometry={starGeometry} material={starMaterial} />
      <points ref={pointsRef} geometry={pointsGeometry} material={particleMaterial} />
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </group>
  )
}
