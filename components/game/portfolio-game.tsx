"use client"

import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { Car, type CarState } from "./car"
import { Road } from "./road"
import { Billboards } from "./billboards"
import { SynthwaveEnvironment } from "./environment"
import { Hud } from "./hud"

export function PortfolioGame() {
  const stateRef = useRef<CarState>({ x: 0, z: 8, angle: 0, speed: 0 })

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0118]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ position: [0, 6, 22], fov: 60, near: 0.1, far: 2000 }}
      >
        <Suspense fallback={null}>
          <SynthwaveEnvironment />
          <Road />
          <Billboards />
          <Car stateRef={stateRef} />
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <Hud stateRef={stateRef} />
    </main>
  )
}
