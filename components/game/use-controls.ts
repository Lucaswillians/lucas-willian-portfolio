"use client"

import { useEffect, type MutableRefObject } from "react"

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

export function resetControls(keys: MutableRefObject<Keys>) {
  keys.current.forward = false
  keys.current.back = false
  keys.current.left = false
  keys.current.right = false
}

export function useKeyboardControls(keys: MutableRefObject<Keys>, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      resetControls(keys)
      return
    }

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
      resetControls(keys)
    }
  }, [enabled, keys])
}
