'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Project location data ──────────────────────────────────────────────────────

// One pin per geography, each holding the engagements delivered there. The
// brochure lists ~20 select projects, many clustered in NE India / Meghalaya —
// far too close to render as individual clickable pins at globe zoom — so they
// are grouped by location. The ProjectDetail panel lists each location's
// projects. Some engagements have a headline value; advisory/evaluation work
// often doesn't, so `value` is optional.
const PIN_COLOR = '#3b82f6'

export interface ProjectEntry {
  title: string
  client: string
  category: string
  description: string
  tags: string[]
  value?: string
  valueLabel?: string
}

export interface ProjectLocation {
  id: number
  region: string
  lat: number
  lon: number
  color: string
  projects: ProjectEntry[]
}

export const projectLocations: ProjectLocation[] = [
  {
    id: 1,
    region: 'North East India',
    lat: 25.7,
    lon: 92.3,
    color: PIN_COLOR,
    projects: [
      {
        title: 'ELEMENT — Nagaland & Tripura',
        client: 'World Bank',
        category: 'Agriculture, Livelihoods & Value Chains',
        value: '$242M',
        valueLabel: 'Project value supported',
        description:
          'Project design, investment planning, and operations manual for forest value chains, eco-tourism, and NTFP livelihood frameworks.',
        tags: ['Project Design', 'NTFP Value Chains', 'Eco-Tourism'],
      },
      {
        title: 'Community-Based Forest Management & Livelihoods, Meghalaya',
        client: 'GoM / JICA',
        category: 'Rural Development & Livelihoods',
        value: '$124M',
        valueLabel: 'Project value supported',
        description:
          'DPR and investment planning for community forestry and livelihood systems.',
        tags: ['Community Forestry', 'DPR', 'Livelihoods'],
      },
      {
        title: 'Community-Led Landscape Management, Meghalaya',
        client: 'World Bank',
        category: 'Biodiversity, Landscapes & Ecosystems',
        value: '$60M',
        valueLabel: 'Project value supported',
        description:
          'Community-driven landscape and NRM strategies with a full project implementation plan.',
        tags: ['Landscape Management', 'NRM', 'Implementation Plan'],
      },
      {
        title: 'Climate Adaptation — Vulnerable Catchments, Meghalaya',
        client: 'KfW',
        category: 'Climate, Environment & Natural Resources',
        value: '€35M',
        valueLabel: 'Project value supported',
        description:
          'DPR, investment plan, and ESMF for climate-resilient watershed and catchment restoration.',
        tags: ['DPR', 'ESMF', 'Watershed Restoration'],
      },
      {
        title: 'Watershed Development Guidelines, Meghalaya',
        client: 'ADB',
        category: 'Biodiversity, Landscapes & Ecosystems',
        description:
          'Technical frameworks for climate-resilient watershed restoration.',
        tags: ['Watershed', 'Technical Frameworks'],
      },
      {
        title: 'Livelihoods & Access to Markets, Meghalaya',
        client: 'GoM / IFAD',
        category: 'Rural Development & Livelihoods',
        description:
          'Market access and value chain strategies for smallholder producers.',
        tags: ['Market Access', 'Value Chains'],
      },
      {
        title: 'Eco-Tourism as Climate Adaptation, Meghalaya',
        client: 'NDB',
        category: 'Climate Finance & Emerging Themes',
        description:
          'Concept design, DPR, and environmental & social frameworks for sustainable tourism.',
        tags: ['Eco-Tourism', 'DPR', 'Safeguards'],
      },
      {
        title: 'North East Rural Livelihoods Project',
        client: 'World Bank',
        category: 'Rural Development & Livelihoods',
        description: 'Project completion report and results assessment.',
        tags: ['Evaluation', 'Livelihoods'],
      },
      {
        title: 'Climate Change Adaptation — North East India (CCA-NER)',
        client: 'GIZ',
        category: 'Monitoring, Evaluation & Learning',
        description:
          'Final evaluation and impact assessment with sustainability and scalability analysis.',
        tags: ['Evaluation', 'Impact Assessment'],
      },
    ],
  },
  {
    id: 2,
    region: 'Central & Pan-India',
    lat: 22.5,
    lon: 78.8,
    color: PIN_COLOR,
    projects: [
      {
        title: 'CONSERVE — Biodiversity Conservation & Sustainable Use',
        client: 'GEF-GBFF / UNDP / World Bank',
        category: 'Biodiversity, Landscapes & Ecosystems',
        value: '$12.3M',
        valueLabel: 'GEF grant mobilized',
        description:
          'ProDoc, GEF CEO Endorsement, Theory of Change, Results Framework, MEL, and co-financing for a multi-state implementation design.',
        tags: ['ProDoc', 'Results Framework', 'MEL'],
      },
      {
        title: 'Umbrella Programme for Natural Resource Management',
        client: 'GIZ / KfW / NABARD',
        category: 'Monitoring, Evaluation & Learning',
        description:
          'Appraisal, monitoring, and evaluation of 50+ community-led NRM projects with mid-term reviews and performance assessments.',
        tags: ['M&E', 'NRM', 'Third-Party Monitoring'],
      },
      {
        title: 'Sustainable Watershed Development Fund Guidelines',
        client: 'KfW / NABARD',
        category: 'Biodiversity, Landscapes & Ecosystems',
        description:
          'Financing models and technical guidelines for watershed investments.',
        tags: ['Watershed Finance', 'Guidelines'],
      },
      {
        title: 'Climate Adaptation in Agribusiness Value Chains',
        client: 'GIZ',
        category: 'Agriculture, Livelihoods & Value Chains',
        description:
          'Climate risk assessments for agri-horticulture with adaptation and risk-mitigation strategies.',
        tags: ['Climate Risk', 'Agribusiness', 'Adaptation'],
      },
      {
        title: 'Drought, Land Degradation & Desertification Strategy — South Asia',
        client: 'ADB',
        category: 'Climate, Environment & Natural Resources',
        description:
          'Regional strategy for drought resilience and land restoration with policy and investment frameworks.',
        tags: ['Drought Resilience', 'Land Restoration', 'Policy'],
      },
    ],
  },
  {
    id: 3,
    region: 'Himachal Pradesh',
    lat: 31.1,
    lon: 77.2,
    color: PIN_COLOR,
    projects: [
      {
        title: 'Climate Proofing of Forest Ecosystems',
        client: 'KfW',
        category: 'Climate, Environment & Natural Resources',
        description:
          'DPR and investment plan with mid-term review and performance assessment.',
        tags: ['DPR', 'Forest Ecosystems', 'Review'],
      },
    ],
  },
  {
    id: 4,
    region: 'Kerala',
    lat: 10.5,
    lon: 76.3,
    color: PIN_COLOR,
    projects: [
      {
        title: 'Kerala Climate-Resilient Agri-Value Chain (KERA)',
        client: 'World Bank',
        category: 'Agriculture, Livelihoods & Value Chains',
        value: '$285M',
        valueLabel: 'Project value supported',
        description:
          'End-to-end project design, costing, and PIM for climate-resilient value chains across rubber, coffee, and cardamom, with economic and financial analysis.',
        tags: ['Project Design', 'Value Chains', 'Economic Analysis'],
      },
    ],
  },
  {
    id: 5,
    region: 'Coastal Karnataka',
    lat: 14.5,
    lon: 74.3,
    color: PIN_COLOR,
    projects: [
      {
        title: 'Blue Economy — Plastic Waste Management',
        client: 'GoK / World Bank',
        category: 'Climate Finance & Emerging Themes',
        description:
          'Concept note and investment framework for plastic waste management and blue economy transformation.',
        tags: ['Blue Economy', 'Waste Management', 'Investment Framework'],
      },
    ],
  },
  {
    id: 6,
    region: 'Afghanistan',
    lat: 34.52,
    lon: 69.17,
    color: PIN_COLOR,
    projects: [
      {
        title: 'Afghanistan Emergency Food Security',
        client: 'World Bank / FAO',
        category: 'Agriculture, Livelihoods & Value Chains',
        value: '$415M',
        valueLabel: 'Project value supported',
        description:
          'Economic and financial analysis, PAD inputs, and PIM components for agriculture resilience and food security interventions.',
        tags: ['Economic Analysis', 'Food Security', 'PAD / PIM'],
      },
    ],
  },
  {
    id: 7,
    region: 'Lao PDR',
    lat: 17.97,
    lon: 102.63,
    color: PIN_COLOR,
    projects: [
      {
        title: 'Hand-in-Hand Initiative',
        client: 'FAO',
        category: 'Agriculture, Livelihoods & Value Chains',
        description:
          'Integrated agriculture, commodity value chains, and enterprise development with investment-ready model projects.',
        tags: ['Agriculture', 'Value Chains', 'Enterprise'],
      },
    ],
  },
  {
    id: 8,
    region: 'Hindu Kush Himalaya',
    lat: 28.5,
    lon: 84.5,
    color: PIN_COLOR,
    projects: [
      {
        title: 'GCF Regional Programme — Hindu Kush Himalaya',
        client: 'GCF · 8 Countries',
        category: 'Climate Finance & Emerging Themes',
        value: '72M',
        valueLabel: 'People across 8 countries',
        description:
          'Blended finance facility concept benefiting 72 million people across the Hindu Kush Himalayan region.',
        tags: ['Climate Finance', 'Blended Finance', 'Regional'],
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

// ── Crisp pin sprite texture (generated via canvas) ─────────────────────────

function createPinTexture(color: string): THREE.Texture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2

  // Outer glow (very soft)
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx)
  outerGlow.addColorStop(0, color + 'ff')
  outerGlow.addColorStop(0.15, color + 'aa')
  outerGlow.addColorStop(0.4, color + '33')
  outerGlow.addColorStop(1, color + '00')
  ctx.fillStyle = outerGlow
  ctx.fillRect(0, 0, size, size)

  // Bright core
  const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.08)
  coreGlow.addColorStop(0, '#ffffff')
  coreGlow.addColorStop(0.5, color)
  coreGlow.addColorStop(1, color + '00')
  ctx.fillStyle = coreGlow
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

// ── Pulse ring shader ─────────────────────────────────────────────────────────

const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ringFragmentShader = `
  uniform vec3 uColor;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    float dist = length(vUv - center) * 2.0;

    // Ring at the expanding edge
    float ringRadius = uProgress;
    float ringWidth = 0.08;
    float ring = smoothstep(ringRadius - ringWidth, ringRadius, dist)
               * (1.0 - smoothstep(ringRadius, ringRadius + ringWidth, dist));

    // Fade out as ring expands
    float fade = 1.0 - uProgress;

    float alpha = ring * fade * 0.6;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// ── Props ──────────────────────────────────────────────────────────────────────

interface ProjectPinsProps {
  visible: boolean
  globeRadius: number
  onPinClick: (projectId: number) => void
  selectedProjectId: number | null
}

interface PinProps {
  project: ProjectLocation
  globeRadius: number
  onPinClick: (projectId: number) => void
  selectedProjectId: number | null
}

// ── Single Pin ─────────────────────────────────────────────────────────────────

function Pin({ project, globeRadius, onPinClick, selectedProjectId }: PinProps) {
  const groupRef = useRef<THREE.Group>(null)
  const spriteRef = useRef<THREE.Sprite>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const beamRef = useRef<THREE.Mesh>(null)
  const hoveredRef = useRef(false)
  const scaleRef = useRef(1)

  const { camera, controls } = useThree((state) => ({
    camera: state.camera,
    controls: state.controls,
  }))

  const surfacePos = useMemo(
    () => latLongToVector3(project.lat, project.lon, globeRadius),
    [project.lat, project.lon, globeRadius]
  )

  // Normal direction (outward from globe center)
  const normal = useMemo(() => surfacePos.clone().normalize(), [surfacePos])

  // Fly camera to pin when this pin is selected
  useEffect(() => {
    if (selectedProjectId !== project.id) return
    if (!spriteRef.current) return

    // Convert pin LOCAL position to WORLD position (accounts for the earth
    // group's rotation). Globe center is at world origin, so the world
    // outward-normal is just the normalized world position.
    spriteRef.current.updateMatrixWorld(true)
    const worldSurfacePos = new THREE.Vector3()
    spriteRef.current.getWorldPosition(worldSurfacePos)
    const worldNormal = worldSurfacePos.clone().normalize()

    // Camera sits 3.0 units beyond the pin along the outward normal.
    // Distance from OrbitControls target (= pin surface) to camera is 3.0,
    // which is exactly the OrbitControls minDistance — so when controls
    // re-enable, the spherical-radius clamp finds the camera already inside
    // bounds and doesn't kick it back. Distance from globe center: 2.5 + 3.0 = 5.5.
    const targetCamPos = worldSurfacePos
      .clone()
      .add(worldNormal.clone().multiplyScalar(3.0))

    // Temporarily disable OrbitControls during fly-in so damping/input doesn't
    // fight the GSAP tween. Re-enable on completion.
    const orbitCtrl = (controls && 'enabled' in controls)
      ? (controls as unknown as { enabled: boolean; target: THREE.Vector3; update: () => void })
      : null

    if (orbitCtrl) orbitCtrl.enabled = false

    const camTween = gsap.to(camera.position, {
      x: targetCamPos.x,
      y: targetCamPos.y,
      z: targetCamPos.z,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => orbitCtrl?.update(),
      onComplete: () => {
        if (orbitCtrl) orbitCtrl.enabled = true
      },
    })

    let targetTween: gsap.core.Tween | undefined
    if (orbitCtrl) {
      targetTween = gsap.to(orbitCtrl.target, {
        x: worldSurfacePos.x,
        y: worldSurfacePos.y,
        z: worldSurfacePos.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })
    }

    return () => {
      camTween.kill()
      targetTween?.kill()
      if (orbitCtrl) orbitCtrl.enabled = true
    }
  }, [selectedProjectId, project.id, camera, controls])

  // Slightly above surface for the pin
  const pinPos = useMemo(
    () => surfacePos.clone().add(normal.clone().multiplyScalar(0.02)),
    [surfacePos, normal]
  )

  // Beam end position (extends outward)
  const beamEndPos = useMemo(
    () => surfacePos.clone().add(normal.clone().multiplyScalar(0.2)),
    [surfacePos, normal]
  )

  // All pins same color — clean teal
  const pinColor = '#3b82f6'
  const color = useMemo(() => new THREE.Color(pinColor), [])

  const isSelected = selectedProjectId === project.id

  // Crisp sprite texture — same color for all
  const spriteTexture = useMemo(() => createPinTexture(pinColor), [])

  // Sprite material
  const spriteMaterial = useMemo(() => {
    return new THREE.SpriteMaterial({
      map: spriteTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  }, [spriteTexture])

  // Pulse ring material
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      uniforms: {
        uColor: { value: color },
        uProgress: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  }, [color])

  // Ring orientation — face outward from globe surface
  const ringQuaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [normal])

  // Beam geometry (thin cylinder along normal)
  const beamGeometry = useMemo(() => {
    const length = 0.18
    const geo = new THREE.CylinderGeometry(0.003, 0.001, length, 4)
    geo.translate(0, length / 2, 0)
    // Rotate to align with normal direction
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
    geo.applyQuaternion(q)
    return geo
  }, [normal])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Hover scale interpolation
    const target = hoveredRef.current ? 1.8 : 1
    scaleRef.current += (target - scaleRef.current) * 0.12
    if (spriteRef.current) {
      const s = 0.15 * scaleRef.current
      spriteRef.current.scale.set(s, s, 1)
    }

    // Only selected pin pulses — rest stay static
    if (isSelected) {
      const period = 3.0
      const phase = (t % period) / period
      ringMaterial.uniforms.uProgress.value = phase
    } else {
      ringMaterial.uniforms.uProgress.value = 0 // static, no pulse
    }

    // Beam — brighter on selected, subtle on others
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial
      if (isSelected) {
        mat.opacity = 0.5 + Math.sin(t * 1.5) * 0.2
      } else {
        mat.opacity = 0.2
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Crisp sprite marker — always faces camera */}
      <sprite
        ref={spriteRef}
        position={pinPos}
        material={spriteMaterial}
        scale={[0.15, 0.15, 1]}
      />

      {/* Animated pulse ring on surface */}
      <mesh
        position={surfacePos}
        quaternion={ringQuaternion}
        material={ringMaterial}
      >
        <planeGeometry args={[0.4, 0.4]} />
      </mesh>

      {/* Thin light beam extending from surface */}
      <mesh
        ref={beamRef}
        position={surfacePos}
        geometry={beamGeometry}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Invisible click target */}
      <mesh
        position={pinPos}
        visible={false}
        onPointerOver={() => { hoveredRef.current = true; document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { hoveredRef.current = false; document.body.style.cursor = 'auto' }}
        onClick={(e) => {
          e.stopPropagation()
          // The detail panel covers the canvas on open, so this pin's pointerOut
          // won't fire — reset hover/cursor here to avoid a stuck pointer cursor.
          hoveredRef.current = false
          document.body.style.cursor = 'auto'
          onPinClick(project.id)
        }}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

// ── ProjectPins ────────────────────────────────────────────────────────────────

export default function ProjectPins({ visible, globeRadius, onPinClick, selectedProjectId }: ProjectPinsProps) {
  if (!visible) return null

  return (
    <group>
      {projectLocations.map((project) => (
        <Pin
          key={project.id}
          project={project}
          globeRadius={globeRadius}
          onPinClick={onPinClick}
          selectedProjectId={selectedProjectId}
        />
      ))}
    </group>
  )
}
