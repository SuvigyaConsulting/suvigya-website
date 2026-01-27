'use client'

import { Canvas, type CanvasProps } from '@react-three/fiber'
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Suspense, type ReactNode } from 'react'

interface SceneCanvasProps extends Omit<CanvasProps, 'children'> {
  children: ReactNode
  className?: string
}

export default function SceneCanvas({
  children,
  className = '',
  ...props
}: SceneCanvasProps) {
  return (
    <div className={`canvas-container ${className}`}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0, 5, 10],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        {...props}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  )
}
