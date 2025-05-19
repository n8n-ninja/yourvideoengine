import { CSSProperties } from "react"
import { Effect } from "@/schemas"

// Génère un déplacement pseudo-aléatoire basé sur le frame, amplitude et speed
const getFloatOffset = (
  frame: number,
  amplitude: number,
  speed: number,
  seed: number,
) => {
  // Simple bruit périodique pour X et Y
  const x = Math.sin(frame * 0.03 * speed + seed) * amplitude
  const y = Math.cos(frame * 0.025 * speed + seed) * amplitude
  return { x, y }
}

// Génère un bruit pseudo-aléatoire déterministe
const pseudoRandom = (x: number) => {
  return Math.abs(Math.sin(x * 12.9898) * 43758.5453) % 1
}

// Retourne le vecteur directionnel pour pointer
const getDirectionVector = (direction: string): { x: number; y: number } => {
  switch (direction) {
    case "bottom":
      return { x: 0, y: -1 }
    case "top":
      return { x: 0, y: 1 }
    case "right":
      return { x: -1, y: 0 }
    case "left":
      return { x: 1, y: 0 }
    case "bottom-right":
      return { x: -Math.SQRT1_2, y: -Math.SQRT1_2 }
    case "bottom-left":
      return { x: Math.SQRT1_2, y: -Math.SQRT1_2 }
    case "top-right":
      return { x: -Math.SQRT1_2, y: Math.SQRT1_2 }
    case "top-left":
      return { x: Math.SQRT1_2, y: Math.SQRT1_2 }
    default:
      return { x: 0, y: -1 }
  }
}

// Courbes d'easing
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2)
const easeIn = (t: number) => t * t

/**
 * Applique tous les effets et retourne le style résultant
 * Effet float : options = { amplitude?: number, speed?: number, seed?: number }
 * Effet blink : options = { speed?: number, minOpacity?: number, maxOpacity?: number }
 * Effet pointer : options = { direction: string, amplitude?: number, speed?: number, easeIn?: number, reverseEase?: number }
 * Effet shake : options = { amplitude?: number, speed?: number, direction?: 'x'|'y'|'both', seed?: number }
 * Effet pop/pulse : options = { amplitude?: number, speed?: number, mode?: 'pop'|'pulse' }
 */
export const applyEffects = (
  effects: Effect[] | undefined,
  frame: number,
): CSSProperties => {
  if (!effects || effects.length === 0) return {}
  let style: CSSProperties = {}
  effects.forEach((effect, idx) => {
    if (effect.type === "float") {
      const amplitude = Number(effect.options?.amplitude ?? 10)
      const speed = Number(effect.options?.speed ?? 1)
      const seed = Number(effect.options?.seed ?? idx * 100)
      const { x, y } = getFloatOffset(frame, amplitude, speed, seed)
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${x}px, ${y}px)`
    }
    if (effect.type === "blink") {
      const speed = Number(effect.options?.speed ?? 2)
      const minOpacity = Number(effect.options?.minOpacity ?? 0.2)
      const maxOpacity = Number(effect.options?.maxOpacity ?? 1)
      // Blink organique : combinaison de sinusoïdes + bruit pseudo-aléatoire
      const t = frame / 30
      const s1 = Math.sin(2 * Math.PI * speed * t)
      const s2 = Math.sin(2 * Math.PI * (speed * 0.37) * t + 1.7)
      const s3 = Math.sin(2 * Math.PI * (speed * 0.73) * t + 3.1)
      const noise = pseudoRandom(frame * 0.5 + idx * 42) * 2 - 1
      // Valeur entre 0 et 1
      let v = 0.5 + 0.25 * s1 + 0.15 * s2 + 0.1 * s3 + 0.1 * noise
      v = Math.max(0, Math.min(1, v))
      style.opacity = minOpacity + (maxOpacity - minOpacity) * v
    }
    if (effect.type === "pointer") {
      const direction = effect.options?.direction ?? "top"
      const amplitude = Number(effect.options?.amplitude ?? 30)
      const speed = Number(effect.options?.speed ?? 1)
      const easeIn = Number(effect.options?.easeIn ?? 0.7)
      const reverseEase = Number(effect.options?.reverseEase ?? 1 - easeIn)
      const { x: dx, y: dy } = getDirectionVector(direction)
      // Mouvement cyclique avec accélération différente aller/retour
      const t = (frame / 30) * speed
      const cycle = t % 1
      let progress
      if (cycle < easeIn) {
        // Aller (plus lent)
        progress = cycle / easeIn
        // Ease out pour l'aller
        progress = 1 - Math.pow(1 - progress, 2)
      } else {
        // Retour (plus rapide)
        const back = (cycle - easeIn) / reverseEase
        // Ease in pour le retour
        progress = 1 - Math.pow(back, 2)
        progress = Math.max(0, progress)
      }
      const tx = dx * amplitude * progress
      const ty = dy * amplitude * progress
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${tx}px, ${ty}px)`
    }
    if (effect.type === "shake") {
      const amplitude = Number(effect.options?.amplitude ?? 10)
      const speed = Number(effect.options?.speed ?? 8)
      const direction = effect.options?.direction ?? "both"
      const seed = Number(effect.options?.seed ?? idx * 100)
      const t = frame / 30
      let x = 0,
        y = 0
      if (direction === "x" || direction === "both") {
        x =
          Math.sin(2 * Math.PI * speed * t + seed) *
          amplitude *
          (0.7 + 0.3 * pseudoRandom(frame + seed))
      }
      if (direction === "y" || direction === "both") {
        y =
          Math.cos(2 * Math.PI * speed * t + seed) *
          amplitude *
          (0.7 + 0.3 * pseudoRandom(frame * 2 + seed))
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${x}px, ${y}px)`
    }
    if (effect.type === "pop" || effect.type === "pulse") {
      // Adapter amplitude et speed pour des valeurs plus naturelles
      const amplitudeRaw = Number(effect.options?.amplitude ?? 10)
      const speedRaw = Number(effect.options?.speed ?? 10)
      const amplitude = amplitudeRaw / 100
      const speed = speedRaw / 10
      const mode =
        effect.options?.mode ?? (effect.type === "pop" ? "pop" : "pulse")
      const t = frame / 30
      let scale = 1
      if (mode === "pulse") {
        // Sinusoïdal
        scale = 1 + amplitude * Math.sin(2 * Math.PI * speed * t)
      } else {
        // Pop : ease out rapide pour le pic, ease in pour le retour
        const cycle = (t * speed) % 1
        if (cycle < 0.22) {
          // Pic rapide (ease out)
          const p = cycle / 0.22
          scale = 1 + amplitude * easeOut(p)
        } else {
          // Retour lent (ease in)
          const p = (cycle - 0.22) / 0.78
          scale = 1 + amplitude * (1 - easeIn(p)) * 0.3
        }
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} scale(${scale})`
    }
    if (effect.type === "wobble") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 10)
      const speedRaw = Number(effect.options?.speed ?? 8)
      const amplitude = amplitudeRaw / 100
      const speed = speedRaw / 10
      const axis = effect.options?.axis ?? "x"
      const t = frame / 30
      let wobbleX = 0,
        wobbleY = 0,
        wobbleR = 0
      if (axis === "x" || axis === "all") {
        wobbleX = Math.sin(2 * Math.PI * speed * t) * amplitude * 30
      }
      if (axis === "y" || axis === "all") {
        wobbleY = Math.cos(2 * Math.PI * speed * t) * amplitude * 30
      }
      if (axis === "rotate" || axis === "all") {
        wobbleR = Math.sin(2 * Math.PI * speed * t) * amplitude * 12
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${wobbleX}px, ${wobbleY}px) rotate(${wobbleR}deg)`
    }
    // Ajouter d'autres effets ici
  })
  return style
}
