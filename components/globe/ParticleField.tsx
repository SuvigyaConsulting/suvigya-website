'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const SPHERE_RADIUS = 8
const TARGET_RADIUS = 2.5
const CONNECTION_DISTANCE = 1.5
const MAX_CONNECTIONS = 100
const MORPH_DURATION = 2.0
const UNMORPH_DURATION = 1.5

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
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const morphStateRef = useRef({
    active: false,
    direction: 1, // 1 = morphing in, -1 = morphing out
    progress: 0,
    connectionOpacity: 1,
  })

  // Pre-allocate all data arrays
  const {
    positions,
    originalPositions,
    targetPositions,
    velocities,
    colors,
    sizes,
    opacities,
    linePositions,
    lineColors,
  } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const origPos = new Float32Array(PARTICLE_COUNT * 3)
    const targPos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const sz = new Float32Array(PARTICLE_COUNT)
    const op = new Float32Array(PARTICLE_COUNT)

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

      // Random size
      sz[i] = 0.03 + Math.random() * 0.03

      // Random opacity
      op[i] = 0.3 + Math.random() * 0.5
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
      opacities: op,
      linePositions: linePosBuffer,
      lineColors: lineColBuffer,
    }
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

  // Line material
  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.1,
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

  useFrame((_, delta) => {
    if (!pointsRef.current || !linesRef.current) return

    const geometry = pointsRef.current.geometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    const state = morphStateRef.current

    // Update morph progress
    if (state.active) {
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
          // Restore original random positions to positions array
          for (let i = 0; i < targetPositions.length; i++) {
            originalPositions[i] = targetPositions[i]
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
        // During morph: lerp between original and target, with spiral effect
        const ox = originalPositions[i3]
        const oy = originalPositions[i3 + 1]
        const oz = originalPositions[i3 + 2]

        let tx: number, ty: number, tz: number

        if (state.direction === 1 || t > 0) {
          // Morphing toward globe or holding at globe
          tx = state.direction === -1 ? targetPositions[i3] : targetPositions[i3]
          ty = state.direction === -1 ? targetPositions[i3 + 1] : targetPositions[i3 + 1]
          tz = state.direction === -1 ? targetPositions[i3 + 2] : targetPositions[i3 + 2]

          if (state.direction === 1) {
            // Fibonacci sphere target
            const fibTarget = fibonacciSphere(i, PARTICLE_COUNT, TARGET_RADIUS)
            tx = fibTarget.x
            ty = fibTarget.y
            tz = fibTarget.z
          }
        } else {
          tx = targetPositions[i3]
          ty = targetPositions[i3 + 1]
          tz = targetPositions[i3 + 2]
        }

        // Add spiral during active morph
        let spiralX = 0
        let spiralZ = 0
        if (state.active) {
          const spiralIntensity = Math.sin(eased * Math.PI) * 0.8
          const angle = eased * Math.PI * 4 + i * 0.01
          spiralX = Math.cos(angle) * spiralIntensity * (1 - eased)
          spiralZ = Math.sin(angle) * spiralIntensity * (1 - eased)
        }

        posArray[i3] = ox + (tx - ox) * eased + spiralX
        posArray[i3 + 1] = oy + (ty - oy) * eased
        posArray[i3 + 2] = oz + (tz - oz) * eased + spiralZ
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
    lineMaterial.opacity = 0.1 * connectionOpacity

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pointsGeometry.dispose()
      lineGeometry.dispose()
      particleMaterial.dispose()
      lineMaterial.dispose()
    }
  }, [pointsGeometry, lineGeometry, particleMaterial, lineMaterial])

  return (
    <group>
      <points ref={pointsRef} geometry={pointsGeometry} material={particleMaterial} />
      <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
    </group>
  )
}
