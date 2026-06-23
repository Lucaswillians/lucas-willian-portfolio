"use client"

import { Suspense, useEffect, useRef, useState, type PointerEvent } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { Monitor, Smartphone } from "lucide-react"
import { Car, type CarState } from "./car"
import { Road } from "./road"
import { Billboards } from "./billboards"
import { SynthwaveEnvironment } from "./environment"
import { Hud } from "./hud"
import { resetControls, useKeyboardControls, type Keys } from "./use-controls"

type PlayMode = "desktop" | "touch"
type LockableScreenOrientation = ScreenOrientation & {
  lock?: (orientation: string) => Promise<void>
  unlock?: () => void
}

function ModeSelect({
  onSelect,
}: {
  onSelect: (mode: PlayMode) => void
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-[#080112]/80 px-4 font-mono backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg border border-[#00f0ff]/45 bg-black/75 p-5 text-center shadow-[0_0_36px_rgba(0,240,255,0.24)] md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#ff2d95]">Escolha o controle</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[0.12em] text-white md:text-3xl">Como você quer visualizar?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect("desktop")}
            className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-[#00f0ff]/55 bg-[#00f0ff]/10 px-4 py-5 text-[#00f0ff] transition hover:bg-[#00f0ff]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00f0ff]"
          >
            <Monitor className="h-9 w-9" />
            <span className="mt-3 text-sm font-bold uppercase tracking-[0.22em]">Desktop</span>
            <span className="mt-2 text-xs text-white/65">Teclado ou WASD</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect("touch")}
            className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-[#ff2d95]/55 bg-[#ff2d95]/10 px-4 py-5 text-[#ff2d95] transition hover:bg-[#ff2d95]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d95]"
          >
            <Smartphone className="h-9 w-9" />
            <span className="mt-3 text-sm font-bold uppercase tracking-[0.22em]">Mobile / Touch</span>
            <span className="mt-2 text-xs text-white/65">Joystick na tela</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function LandscapePrompt() {
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-[#080112]/90 px-5 font-mono backdrop-blur-md">
      <div className="w-full max-w-sm rounded-lg border border-[#ff2d95]/55 bg-black/80 p-6 text-center shadow-[0_0_32px_rgba(255,45,149,0.28)]">
        <Smartphone className="mx-auto h-12 w-12 rotate-90 text-[#ff2d95]" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#00f0ff]">Modo paisagem</p>
        <h2 className="mt-3 text-xl font-bold tracking-[0.08em] text-white">Gire o celular</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">O jogo mobile fica melhor com a tela na horizontal.</p>
      </div>
    </div>
  )
}

function TouchControls({ controlsRef }: { controlsRef: React.MutableRefObject<Keys> }) {
  const baseRef = useRef<HTMLDivElement>(null)
  const [stick, setStick] = useState({ x: 0, y: 0 })
  const maxDistance = 46
  const deadZone = 10

  const updateControls = (x: number, y: number) => {
    controlsRef.current.forward = y < -deadZone
    controlsRef.current.back = y > deadZone
    controlsRef.current.left = x < -deadZone
    controlsRef.current.right = x > deadZone
  }

  const moveStick = (event: PointerEvent<HTMLDivElement>) => {
    const base = baseRef.current
    if (!base) return

    const rect = base.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rawX = event.clientX - centerX
    const rawY = event.clientY - centerY
    const distance = Math.hypot(rawX, rawY)
    const limit = distance > maxDistance ? maxDistance / distance : 1
    const next = { x: rawX * limit, y: rawY * limit }

    setStick(next)
    updateControls(next.x, next.y)
  }

  const releaseStick = () => {
    setStick({ x: 0, y: 0 })
    resetControls(controlsRef)
  }

  return (
    <div className="pointer-events-auto absolute bottom-6 left-5 z-20 font-mono">
      <div
        ref={baseRef}
        role="application"
        aria-label="Joystick de direção"
        className="relative h-32 w-32 touch-none rounded-full border border-[#00f0ff]/55 bg-black/55 shadow-[0_0_24px_rgba(0,240,255,0.28)] backdrop-blur-md"
        onPointerDown={(event) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture(event.pointerId)
          moveStick(event)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.preventDefault()
            moveStick(event)
          }
        }}
        onPointerUp={(event) => {
          event.preventDefault()
          releaseStick()
        }}
        onPointerCancel={releaseStick}
      >
        <div className="absolute left-1/2 top-3 h-3 w-px -translate-x-1/2 rounded-full bg-[#00f0ff]/45" />
        <div className="absolute bottom-3 left-1/2 h-3 w-px -translate-x-1/2 rounded-full bg-[#00f0ff]/25" />
        <div className="absolute left-3 top-1/2 h-px w-3 -translate-y-1/2 rounded-full bg-[#00f0ff]/45" />
        <div className="absolute right-3 top-1/2 h-px w-3 -translate-y-1/2 rounded-full bg-[#00f0ff]/45" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff2d95]/65 bg-[#00f0ff]/12" />
        <div
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#00f0ff]/80 bg-[#071226]/90 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.42)]"
          style={{ transform: `translate(calc(-50% + ${stick.x}px), calc(-50% + ${stick.y}px))` }}
        >
          Drive
        </div>
      </div>
    </div>
  )
}

export function PortfolioGame() {
  const stateRef = useRef<CarState>({ x: 0, z: 8, angle: 0, speed: 0 })
  const controlsRef = useRef<Keys>({ forward: false, back: false, left: false, right: false })
  const [playMode, setPlayMode] = useState<PlayMode | null>(null)
  const [isPortraitTouch, setIsPortraitTouch] = useState(false)

  useKeyboardControls(controlsRef, playMode === "desktop")

  useEffect(() => {
    if (playMode !== "touch") {
      setIsPortraitTouch(false)
      return
    }

    const updateOrientation = () => {
      setIsPortraitTouch(window.innerHeight > window.innerWidth)
    }

    updateOrientation()
    window.addEventListener("resize", updateOrientation)
    window.addEventListener("orientationchange", updateOrientation)

    return () => {
      window.removeEventListener("resize", updateOrientation)
      window.removeEventListener("orientationchange", updateOrientation)
    }
  }, [playMode])

  useEffect(() => {
    if (isPortraitTouch) resetControls(controlsRef)
  }, [isPortraitTouch])

  const selectMode = (mode: PlayMode) => {
    resetControls(controlsRef)
    const orientation = screen.orientation as LockableScreenOrientation | undefined
    if (mode === "touch") {
      void orientation?.lock?.("landscape").catch(() => undefined)
    } else {
      orientation?.unlock?.()
    }
    setPlayMode(mode)
  }

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
          <Car stateRef={stateRef} controlsRef={controlsRef} />
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.4} mipmapBlur radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <Hud stateRef={stateRef} />
      {playMode === "touch" && !isPortraitTouch && <TouchControls controlsRef={controlsRef} />}
      {playMode === "touch" && isPortraitTouch && <LandscapePrompt />}
      {!playMode && <ModeSelect onSelect={selectMode} />}
    </main>
  )
}
