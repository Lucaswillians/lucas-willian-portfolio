"use client"

import { Suspense, useEffect, useRef, useState, type PointerEvent } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { Monitor, Smartphone, Menu } from "lucide-react"
import { Car, type CarState } from "./car"
import { Road } from "./road"
import { Billboards } from "./billboards"
import { SynthwaveEnvironment } from "./environment"
import { Hud } from "./hud"
import { PortfolioMenu } from "./portfolio-menu"
import { resetControls, useKeyboardControls, type Keys } from "./use-controls"

type PlayMode = "desktop" | "touch" | "menu"
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
      <div className="w-full max-w-2xl rounded-lg border border-[#00f0ff]/45 bg-black/75 p-5 text-center shadow-[0_0_36px_rgba(0,240,255,0.24)] md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#ff2d95]">Bem-vindo!</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[0.12em] text-white md:text-3xl">Como você quer explorar o portfólio?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onSelect("desktop")}
            className="flex min-h-32 flex-col cursor-pointer items-center justify-center rounded-lg border border-[#00f0ff]/55 bg-[#00f0ff]/10 px-4 py-5 text-[#00f0ff] transition hover:bg-[#00f0ff]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00f0ff]"
          >
            <Monitor className="h-9 w-9" />
            <span className="mt-3 text-sm font-bold uppercase tracking-[0.22em]">Desktop</span>
            <span className="mt-2 text-xs text-white/65">Explore o caminho usando WASD ou as setas do teclado.</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect("touch")}
            className="flex min-h-32 flex-col cursor-pointer items-center justify-center rounded-lg border border-[#ff2d95]/55 bg-[#ff2d95]/10 px-4 py-5 text-[#ff2d95] transition hover:bg-[#ff2d95]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2d95]"
          >
            <Smartphone className="h-9 w-9" />
            <span className="mt-3 text-sm font-bold uppercase tracking-[0.22em]">Mobile</span>
            <span className="mt-2 text-xs text-white/65">Explore o caminho usando os controles touch.</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect("menu")}
            className="flex min-h-32 flex-col cursor-pointer items-center justify-center rounded-lg border border-[#b14aff]/55 bg-[#b14aff]/10 px-4 py-5 text-[#b14aff] transition hover:bg-[#b14aff]/18 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b14aff]"
          >
            <Menu className="h-9 w-9" />
            <span className="mt-3 text-sm font-bold uppercase tracking-[0.22em]">Menu</span>
            <span className="mt-2 text-xs text-white/65">Veja todas as informações organizadas em cards.</span>
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

function ArrowButton({
  icon,
  active,
  onPointerDown,
  onPointerUp,
  color = "#00f0ff",
  className = "",
}: {
  icon: string
  active: boolean
  onPointerDown: () => void
  onPointerUp: () => void
  color?: string
  className?: string
}) {
  return (
    <button
      className={`flex items-center justify-center rounded border transition-all ${active
          ? "bg-[color:var(--btn-color)]/40 border-[color:var(--btn-color)]"
          : "bg-black/40 border-[color:var(--btn-color)]/40 hover:border-[color:var(--btn-color)]/70"
        } touch-none select-none ${className}`}
      style={{ "--btn-color": color } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <span className="text-2xl" style={{ color }}>
        {icon}
      </span>
    </button>
  )
}

function TouchControls({ controlsRef }: { controlsRef: React.MutableRefObject<Keys> }) {
  const [activeKeys, setActiveKeys] = useState({
    forward: false,
    back: false,
    left: false,
    right: false,
  })

  const updateKey = (key: keyof Keys, value: boolean) => {
    controlsRef.current[key] = value
    setActiveKeys((prev) => ({ ...prev, [key]: value }))
  }

  const handlePointerDown = (key: keyof Keys) => {
    updateKey(key, true)
  }

  const handlePointerUp = (key: keyof Keys) => {
    updateKey(key, false)
  }

  return (
    <div className="pointer-events-auto absolute bottom-6 z-20 font-mono flex gap-6 px-5 w-full justify-between">
      {/* Left side - Forward/Back */}
      <div className="flex flex-col gap-3">
        <ArrowButton
          icon="↑"
          active={activeKeys.forward}
          onPointerDown={() => handlePointerDown("forward")}
          onPointerUp={() => handlePointerUp("forward")}
          color="#00f0ff"
          className="w-14 h-14"
        />
        <ArrowButton
          icon="↓"
          active={activeKeys.back}
          onPointerDown={() => handlePointerDown("back")}
          onPointerUp={() => handlePointerUp("back")}
          color="#00f0ff"
          className="w-14 h-14"
        />
      </div>

      {/* Right side - Left/Right */}
      <div className="flex gap-3">
        <ArrowButton
          icon="←"
          active={activeKeys.left}
          onPointerDown={() => handlePointerDown("left")}
          onPointerUp={() => handlePointerUp("left")}
          color="#ff2d95"
          className="w-14 h-14"
        />
        <ArrowButton
          icon="→"
          active={activeKeys.right}
          onPointerDown={() => handlePointerDown("right")}
          onPointerUp={() => handlePointerUp("right")}
          color="#ff2d95"
          className="w-14 h-14"
        />
      </div>
    </div>
  )
}

export function PortfolioGame() {
  const stateRef = useRef<CarState>({ x: 0, z: 8, angle: 0, speed: 0 })
  const controlsRef = useRef<Keys>({ forward: false, back: false, left: false, right: false })
  const [playMode, setPlayMode] = useState<PlayMode | null>(null)
  const [isPortraitTouch, setIsPortraitTouch] = useState(false)

  useKeyboardControls(controlsRef, playMode === "desktop" || playMode === "touch")

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

  const closeMenu = () => {
    setPlayMode(null)
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0118]">
      {playMode !== "menu" && (
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
      )}

      {playMode !== "menu" && <Hud stateRef={stateRef} onOpenMenu={() => setPlayMode("menu")} />}
      {playMode === "touch" && !isPortraitTouch && <TouchControls controlsRef={controlsRef} />}
      {playMode === "touch" && isPortraitTouch && <LandscapePrompt />}
      {!playMode && <ModeSelect onSelect={selectMode} />}
      {playMode === "menu" && <PortfolioMenu onClose={closeMenu} />}
    </main>
  )
}
