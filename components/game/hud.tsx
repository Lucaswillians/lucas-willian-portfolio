"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, Mail, Phone } from "lucide-react"
import type { CarState } from "./car"
import { CONTACTS, SECTIONS, type BillboardSection, type Contact } from "@/lib/portfolio-data"
import { pointBesideRoad, ROAD_WIDTH } from "@/lib/road-path"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  )
}

const START_Z = 8
const END_Z = -460
const NEAR_DISTANCE = 17 // distância (unidades) para considerar que o carro "chegou" na placa

// Posições (x,z) de cada placa ao lado da estrada, pré-calculadas uma vez.
const BILLBOARD_POSITIONS = SECTIONS.map((s) => {
  const sideSign = s.side === "left" ? -1 : 1
  const p = pointBesideRoad(s.t, sideSign, ROAD_WIDTH / 2 + 4.5)
  return { section: s, x: p.x, z: p.z }
})

const CONTACT_ICON: Record<Contact["kind"], (props: { className?: string }) => JSX.Element> = {
  email: Mail,
  phone: Phone,
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

export function Hud({ stateRef }: { stateRef: React.MutableRefObject<CarState> }) {
  const bar = useRef<HTMLDivElement>(null)
  const speedEl = useRef<HTMLSpanElement>(null)
  const [moved, setMoved] = useState(false)
  const [active, setActive] = useState<BillboardSection | null>(null)
  const activeIdRef = useRef<string | null>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const s = stateRef.current
      const progress = Math.min(1, Math.max(0, (START_Z - s.z) / (START_Z - END_Z)))
      if (bar.current) bar.current.style.width = `${progress * 100}%`
      if (speedEl.current) speedEl.current.textContent = String(Math.round(Math.abs(s.speed) * 4))
      if (!moved && Math.abs(s.speed) > 2) setMoved(true)

      // Encontra a placa mais próxima do carro.
      let best = Number.POSITIVE_INFINITY
      let nearest: BillboardSection | null = null
      for (const bp of BILLBOARD_POSITIONS) {
        const dx = bp.x - s.x
        const dz = bp.z - s.z
        const d = Math.sqrt(dx * dx + dz * dz)
        if (d < best) {
          best = d
          nearest = bp.section
        }
      }
      const within = best <= NEAR_DISTANCE ? nearest : null
      const nextId = within ? within.id : null
      if (nextId !== activeIdRef.current) {
        activeIdRef.current = nextId
        setActive(within)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [stateRef, moved])

  const showProjectCard = active?.kind === "project" && !!active.link
  const showContactCard = active?.kind === "outro"

  return (
    <div className="pointer-events-none absolute inset-0 select-none font-mono">
      {/* Title */}
      <div className="absolute left-4 top-4 md:left-8 md:top-6">
        <h1 className="text-balance text-lg font-bold tracking-[0.25em] text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] md:text-2xl">
          LUCAS WILLIAN
        </h1>
        <p className="mt-1 text-xs tracking-[0.3em] text-[#ff2d95] drop-shadow-[0_0_8px_rgba(255,45,149,0.8)] md:text-sm">
          {"// ENGENHEIRO DE SOFTWARE"}
        </p>
      </div>

      {/* Speedometer */}
      <div className="absolute right-4 top-4 text-right md:right-8 md:top-6">
        <span
          ref={speedEl}
          className="text-2xl font-bold text-[#ffd23f] drop-shadow-[0_0_8px_rgba(255,210,63,0.8)] md:text-4xl"
        >
          0
        </span>
        <span className="ml-1 text-xs tracking-widest text-[#ffd23f]/70">KM/H</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-1/2 w-[80%] max-w-md -translate-x-1/2 md:bottom-20">
        <div className="mb-1 flex justify-between text-[10px] tracking-[0.25em] text-white/60">
          <span>INÍCIO</span>
          <span>JORNADA</span>
          <span>CONTATO</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-[#b14aff]/40 bg-black/40">
          <div
            ref={bar}
            className="h-full w-0 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#b14aff] to-[#ff2d95] transition-[width] duration-150"
          />
        </div>
      </div>

      {/* Controls hint */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg border border-[#00f0ff]/40 bg-black/50 px-4 py-2 text-center backdrop-blur-sm transition-opacity duration-700 md:bottom-6 ${
          moved ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="text-xs tracking-widest text-[#00f0ff] md:text-sm">
          {"↑ ACELERAR   ↓ FREAR   ← → VIRAR"}
        </p>
      </div>

      {/* Botão de projeto — aparece ao chegar perto da placa */}
      {showProjectCard && active && (
        <div className="pointer-events-auto absolute left-1/2 top-20 w-[88%] max-w-xs -translate-x-1/2 md:top-24">
          <div
            className="rounded-xl border bg-black/70 p-4 text-center backdrop-blur-md"
            style={{ borderColor: active.accent, boxShadow: `0 0 24px ${active.accent}55` }}
          >
            <p className="text-[10px] tracking-[0.3em]" style={{ color: active.accent }}>
              {active.tag}
            </p>
            <p className="mt-1 text-base font-bold text-white">{active.title}</p>
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-black transition-transform hover:scale-105"
              style={{ backgroundColor: active.accent, boxShadow: `0 0 16px ${active.accent}aa` }}
            >
              <ExternalLink className="h-4 w-4" />
              ABRIR PROJETO
            </a>
          </div>
        </div>
      )}

      {/* Painel de contatos — aparece no fim da estrada */}
      {showContactCard && (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-2xl border border-[#00f0ff] bg-black/75 p-6 text-center backdrop-blur-md shadow-[0_0_32px_rgba(0,240,255,0.4)]">
            <p className="text-xs tracking-[0.3em] text-[#00f0ff]">ENTRE EM CONTATO</p>
            <h2 className="mt-2 text-xl font-bold text-white">Lucas Willian</h2>
            <div className="mt-4 grid gap-2">
              {CONTACTS.map((c) => {
                const Icon = CONTACT_ICON[c.kind]
                return (
                  <a
                    key={c.kind}
                    href={c.href}
                    target={c.kind === "email" || c.kind === "phone" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-left transition-colors hover:border-[#00f0ff] hover:bg-[#00f0ff]/10"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[#00f0ff]" />
                    <span className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-white/50">{c.label}</span>
                      <span className="text-sm text-white">{c.value}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
