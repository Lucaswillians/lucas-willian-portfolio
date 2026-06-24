"use client"

import { useState } from "react"
import { ExternalLink, Mail, Phone, X } from "lucide-react"
import { CONTACTS, INTRO_MENU, SECTIONS, type BillboardSection } from "@/lib/portfolio-data"
import type { ComponentType } from "react"

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

const CONTACT_ICON: Record<"email" | "phone" | "github" | "linkedin", ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  github: GithubIcon,
  linkedin: LinkedinIcon,
}

export function PortfolioMenu({ onClose }: { onClose: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<"experience" | "education" | "about" | "contacts" | null>(null)
  const [selectedItem, setSelectedItem] = useState<BillboardSection | null>(null)

  const experiences = SECTIONS.filter((s) => s.kind === "experience")
  const education = SECTIONS.filter((s) => s.kind === "education")
  const projects = SECTIONS.filter((s) => s.kind === "project")

  if (selectedItem) {
    return (
      <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-[#080112]/95 px-4 font-mono backdrop-blur-lg">
        <div className="w-full max-w-2xl max-h-[90vh] rounded-lg border border-[#00f0ff]/45 bg-black/85 shadow-[0_0_36px_rgba(0,240,255,0.24)] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setSelectedItem(null)}
            className="sticky top-0 left-0 right-0 flex justify-end p-4 z-10 bg-black/50 backdrop-blur-sm"
          >
            <X className="h-6 w-6 text-[#ff2d95] hover:text-[#ff2d95]/80 transition" />
          </button>

          <div className="p-6 md:p-8">
            {/* Header */}
            <div
              className="mb-6 pb-4 border-b"
              style={{ borderColor: selectedItem.accent + "44" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.32em] mb-2"
                style={{ color: selectedItem.accent }}
              >
                {selectedItem.kind === "experience"
                  ? "Experiência"
                  : selectedItem.kind === "education"
                    ? "Formação"
                    : "Projeto"}
              </p>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
              {selectedItem.subtitle && (
                <p className="text-sm text-white/70">{selectedItem.subtitle}</p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              {selectedItem.lines.map((line, idx) => (
                <p
                  key={idx}
                  className="text-sm leading-relaxed text-white/85 md:text-base"
                >
                  {line || <br />}
                </p>
              ))}
            </div>

            {/* Tech tags */}
            {selectedItem.tech && selectedItem.tech.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedItem.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.16em] border"
                    style={{
                      color: selectedItem.accent,
                      borderColor: selectedItem.accent + "55",
                      backgroundColor: selectedItem.accent + "15",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Project link */}
            {selectedItem.link && (
              <a
                href={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold uppercase tracking-[0.16em] text-sm transition border"
                style={{
                  color: selectedItem.accent,
                  borderColor: selectedItem.accent + "77",
                  backgroundColor: selectedItem.accent + "22",
                }}
              >
                Ver no GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-[#080112]/95 px-4 font-mono backdrop-blur-lg">
      <div className="w-full max-w-3xl">
        {!selectedCategory ? (
          // Category selection
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-[0.12em] text-white mb-2">
                Explore meu portfólio
              </h2>
              <p className="text-sm text-white/60">
                Escolha uma categoria para ver os detalhes
              </p>
            </div>

            <button
              onClick={() => setSelectedCategory("about")}
              className="w-full p-6 rounded-lg cursor-pointer border border-[#00f0ff]/45 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/18 transition text-left"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#00f0ff] mb-2">
                Seção
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Sobre mim
              </h3>
              <p className="text-sm text-white/70">
                Conheça melhor meu perfil, habilidades e estilo de trabalho.
              </p>
            </button>

            <button
              onClick={() => setSelectedCategory("experience")}
              className="w-full p-6 rounded-lg cursor-pointer border border-[#ff2d95]/45 bg-[#ff2d95]/10 hover:bg-[#ff2d95]/18 transition text-left"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#ff2d95] mb-2">
                Categoria
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Experiências Profissionais
              </h3>
              <p className="text-sm text-white/70">
                {experiences.length} posições — Conheça minha jornada profissional
              </p>
            </button>

            <button
              onClick={() => setSelectedCategory("education")}
              className="w-full p-6 rounded-lg cursor-pointer border border-[#ffd23f]/45 bg-[#ffd23f]/10 hover:bg-[#ffd23f]/18 transition text-left"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#ffd23f] mb-2">
                Categoria
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Formações & Projetos
              </h3>
              <p className="text-sm text-white/70">
                {education.length} formações + {projects.length} projetos
              </p>
            </button>

            <button
              onClick={() => setSelectedCategory("contacts")}
              className="w-full p-6 rounded-lg cursor-pointer border border-[#b14aff]/45 bg-[#b14aff]/10 hover:bg-[#b14aff]/18 transition text-left"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b14aff] mb-2">
                Seção
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                Contatos
              </h3>
              <p className="text-sm text-white/70">
                Encontre meus dados de contato direto do menu.
              </p>
            </button>

            <button
              onClick={onClose}
              className="w-full p-4 rounded-lg border cursor-pointer border-[#00f0ff]/35 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/12 transition text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#00f0ff]">
                ← Voltar ao jogo
              </p>
            </button>
          </div>
        ) : (
          // Category content
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 flex items-center cursor-pointer gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#00f0ff] hover:text-[#00f0ff]/80 transition"
            >
              ← Voltar
            </button>

            {selectedCategory === "about" ? (
              <div className="rounded-2xl border border-[#00f0ff]/35 bg-[#01030f]/80 p-6 shadow-[0_0_32px_rgba(0,240,255,0.2)]">
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#00f0ff] mb-3">Sobre mim</p>
                <h2 className="text-3xl font-bold text-white mb-4">{INTRO_MENU.title}</h2>
                {INTRO_MENU.subtitle && (
                  <p className="text-sm text-white/70 mb-4">{INTRO_MENU.subtitle}</p>
                )}
                <div className="space-y-4">
                  {INTRO_MENU.lines.map((line, idx) => (
                    <p key={idx} className="text-sm leading-relaxed text-white/80">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : selectedCategory === "contacts" ? (
              <div className="grid gap-4">
                {CONTACTS.map((contact) => {
                  const Icon = CONTACT_ICON[contact.kind]
                  return (
                    <a
                      key={contact.kind}
                      href={contact.href}
                      target={contact.kind === "email" || contact.kind === "phone" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left transition hover:border-[#b14aff]/40 hover:bg-[#b14aff]/10"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[#b14aff]" />
                        <span>
                          <span className="block text-[10px] uppercase tracking-[0.3em] text-white/50">{contact.label}</span>
                          <span className="block text-sm font-bold text-white">{contact.value}</span>
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4 text-white/70" />
                    </a>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {(selectedCategory === "experience" ? experiences : [...education, ...projects]).map(
                  (item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full p-4 rounded-lg border cursor-pointer transition text-left"
                      style={{
                        borderColor: item.accent + "55",
                        backgroundColor: item.accent + "12",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p
                            className="text-xs font-bold uppercase tracking-[0.24em] mb-1"
                            style={{ color: item.accent }}
                          >
                            {item.kind === "experience"
                              ? "Experiência"
                              : item.kind === "education"
                                ? "Formação"
                                : "Projeto"}
                          </p>
                          <h4 className="text-lg font-bold text-white">{item.title}</h4>
                          {item.subtitle && (
                            <p className="text-xs text-white/60 mt-1">{item.subtitle}</p>
                          )}
                        </div>
                        <ExternalLink className="h-4 w-4 shrink-0" style={{ color: item.accent }} />
                      </div>
                    </button>
                  )
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-6 p-4 rounded-lg border cursor-pointer border-[#00f0ff]/35 bg-[#00f0ff]/5 hover:bg-[#00f0ff]/12 transition text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#00f0ff]">
                ← Voltar ao jogo
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
