"use client"

import { useEffect, useRef } from "react"

export type Keys = {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

const KEY_MAP: Record<string, keyof Keys> = {
  ArrowUp: "forward",
  ArrowDown: "back",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "forward",
  s: "back",
  a: "left",
  d: "right",
  W: "forward",
  S: "back",
  A: "left",
  D: "right",
}

export function useControls() {
  const keys = useRef<Keys>({ forward: false, back: false, left: false, right: false })

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const mapped = KEY_MAP[e.key]
      if (mapped) {
        keys.current[mapped] = true
        // Prevent the page from scrolling while driving.
        if (e.key.startsWith("Arrow")) e.preventDefault()
      }
    }
    const onUp = (e: KeyboardEvent) => {
      const mapped = KEY_MAP[e.key]
      if (mapped) keys.current[mapped] = false
    }
    window.addEventListener("keydown", onDown, { passive: false })
    window.addEventListener("keyup", onUp)
    return () => {
      window.removeEventListener("keydown", onDown)
      window.removeEventListener("keyup", onUp)
    }
  }, [])

  return keys
}
