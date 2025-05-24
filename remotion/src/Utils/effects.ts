import { CSSProperties } from "react"
import { Effect } from "@/schemas/index_2"

const FLOAT_AMPLITUDE = 120 // px
const FLOAT_SPEED = 10
const SHAKE_AMPLITUDE = 30 // px
const SHAKE_SPEED = 30
const BLUR_MAX = 20 // px
const ROTATE_MAX = 90 // deg
const TILT_MAX = 30 // deg
const POINTER_AMPLITUDE = 50 // px
const POINTER_SPEED = 2
const POP_AMPLITUDE = 0.3 // scale
const POP_SPEED = 2
const WOBBLE_AMPLITUDE = 30 // px
const WOBBLE_ROTATE = 12 // deg
const WOBBLE_SPEED = 2
const SWING3D_AMPLITUDE = 30 // deg
const SWING3D_SPEED = 2

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
      const amplitude =
        Number(effect.options?.amplitude ?? 0.5) * FLOAT_AMPLITUDE
      const speed = Number(effect.options?.speed ?? 0.5) * FLOAT_SPEED
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
      const amplitude =
        Number(effect.options?.amplitude ?? 0.5) * POINTER_AMPLITUDE
      const speed = Number(effect.options?.speed ?? 0.5) * POINTER_SPEED
      const easeIn = Number(effect.options?.easeIn ?? 0.7)
      const reverseEase = Number(effect.options?.reverseEase ?? 1 - easeIn)
      const { x: dx, y: dy } = getDirectionVector(direction)
      const t = (frame / 30) * speed
      const cycle = t % 1
      let progress
      if (cycle < easeIn) {
        progress = cycle / easeIn
        progress = 1 - Math.pow(1 - progress, 2)
      } else {
        const back = (cycle - easeIn) / reverseEase
        progress = 1 - Math.pow(back, 2)
        progress = Math.max(0, progress)
      }
      const tx = dx * amplitude * progress
      const ty = dy * amplitude * progress
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${tx}px, ${ty}px)`
    }
    if (effect.type === "shake") {
      const amplitude =
        Number(effect.options?.amplitude ?? 0.5) * SHAKE_AMPLITUDE
      const speed = Number(effect.options?.speed ?? 0.5) * SHAKE_SPEED
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
      const amplitudeRaw = Number(effect.options?.amplitude ?? 0.5)
      const speedRaw = Number(effect.options?.speed ?? 0.5)
      const amplitude = amplitudeRaw * POP_AMPLITUDE
      const speed = speedRaw * POP_SPEED
      const mode =
        effect.options?.mode ?? (effect.type === "pop" ? "pop" : "pulse")
      const t = frame / 30
      let scale = 1
      if (mode === "pulse") {
        scale = 1 + amplitude * Math.sin(2 * Math.PI * speed * t)
      } else {
        const cycle = (t * speed) % 1
        if (cycle < 0.22) {
          const p = cycle / 0.22
          scale = 1 + amplitude * easeOut(p)
        } else {
          const p = (cycle - 0.22) / 0.78
          scale = 1 + amplitude * (1 - easeIn(p)) * 0.3
        }
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} scale(${scale})`
    }
    if (effect.type === "wobble") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 0.5)
      const speedRaw = Number(effect.options?.speed ?? 0.5)
      const amplitude = amplitudeRaw * WOBBLE_AMPLITUDE
      const speed = speedRaw * WOBBLE_SPEED
      const axis = effect.options?.axis ?? "x"
      const t = frame / 30
      let wobbleX = 0,
        wobbleY = 0,
        wobbleR = 0
      if (axis === "x" || axis === "all") {
        wobbleX = Math.sin(2 * Math.PI * speed * t) * amplitude
      }
      if (axis === "y" || axis === "all") {
        wobbleY = Math.cos(2 * Math.PI * speed * t) * amplitude
      }
      if (axis === "rotate" || axis === "all") {
        wobbleR =
          Math.sin(2 * Math.PI * speed * t) * WOBBLE_ROTATE * amplitudeRaw
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} translate(${wobbleX}px, ${wobbleY}px) rotate(${wobbleR}deg)`
    }
    if (effect.type === "rotate") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 20)
      const speedRaw = Number(effect.options?.speed ?? 10)
      const amplitude = amplitudeRaw // en degrés, 20 par défaut
      const speed = speedRaw / 10
      const mode = effect.options?.mode ?? "continuous"
      const stepCount = Number(effect.options?.stepCount ?? 12)
      const origin = effect.options?.origin ?? undefined
      const t = frame / 30
      let angle = 0
      if (mode === "continuous") {
        angle = (t * speed * amplitude) % 360
      } else if (mode === "oscillate") {
        angle = Math.sin(2 * Math.PI * speed * t) * amplitude
      } else if (mode === "step") {
        // Step : angle change par paliers réguliers
        const totalSteps = stepCount
        const step = Math.floor((t * speed) % totalSteps)
        angle = (amplitude / totalSteps) * step
      }
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} rotate(${angle}deg)`
      if (origin) {
        style.transformOrigin = origin
      }
    }
    if (effect.type === "fade") {
      const speedRaw = Number(effect.options?.speed ?? 10)
      const speed = speedRaw / 10
      const minOpacity = Number(effect.options?.minOpacity ?? 0)
      const maxOpacity = Number(effect.options?.maxOpacity ?? 1)
      const ease = effect.options?.ease !== false // true par défaut
      const t = frame / 30
      let v = (Math.sin(2 * Math.PI * speed * t - Math.PI / 2) + 1) / 2 // 0 → 1 cyclique
      if (ease) {
        // Ease in/out pour un fondu plus doux
        v = v * v * (3 - 2 * v)
      }
      style.opacity = minOpacity + (maxOpacity - minOpacity) * v
    }
    if (effect.type === "zoom") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 0.5)
      const amplitude = amplitudeRaw * 0.5 // 0.5 = zoom max (facteur à ajuster)
      const speed = 0.5 // ou utiliser effect.options?.speed si besoin
      const t = frame / 30
      const scale = 1 + amplitude * Math.sin(2 * Math.PI * speed * t)
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} scale(${scale})`
    }
    if (effect.type === "swing3D") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 0.5)
      const speedRaw = Number(effect.options?.speed ?? 0.5)
      const amplitude = amplitudeRaw * SWING3D_AMPLITUDE
      const speed = speedRaw * SWING3D_SPEED
      const axis = effect.options?.axis ?? "y"
      const perspective = effect.options?.perspective ?? "600px"
      const t = frame / 30
      const angle = Math.sin(2 * Math.PI * speed * t) * amplitude
      const prevTransform = style.transform ?? ""
      if (axis === "x") {
        style.transform = `perspective(${perspective}) ${prevTransform} rotateX(${angle}deg)`
      } else {
        style.transform = `perspective(${perspective}) ${prevTransform} rotateY(${angle}deg)`
      }
    }
    if (effect.type === "flip3D") {
      const amplitudeRaw = Number(effect.options?.amplitude ?? 180)
      const speedRaw = Number(effect.options?.speed ?? 10)
      const amplitude = amplitudeRaw // en degrés, 180 = flip complet
      const speed = speedRaw / 10
      const axis = effect.options?.axis ?? "y"
      const perspective = effect.options?.perspective ?? "600px"
      const t = frame / 30
      // Flip cyclique : va de 0 à amplitude puis revient
      const angle =
        ((Math.sin(Math.PI * speed * t - Math.PI / 2) + 1) / 2) * amplitude
      const prevTransform = style.transform ?? ""
      if (axis === "x") {
        style.transform = `perspective(${perspective}) ${prevTransform} rotateX(${angle}deg)`
      } else {
        style.transform = `perspective(${perspective}) ${prevTransform} rotateY(${angle}deg)`
      }
    }
    if (effect.type === "tilt3D") {
      const amplitude = Number(effect.options?.amplitude ?? 0.5) * TILT_MAX
      const speed = Number(effect.options?.speed ?? 0.5) * 3
      const axis = effect.options?.axis ?? "xy"
      const perspective = effect.options?.perspective ?? "600px"
      const t = frame / 30
      let angleX = 0,
        angleY = 0
      if (axis === "x" || axis === "xy") {
        angleX = Math.sin(2 * Math.PI * speed * t) * amplitude
      }
      if (axis === "y" || axis === "xy") {
        angleY = Math.cos(2 * Math.PI * speed * t) * amplitude
      }
      const prevTransform = style.transform ?? ""
      style.transform = `perspective(${perspective}) ${prevTransform} rotateX(${angleX}deg) rotateY(${angleY}deg)`
    }
    if (effect.type === "blur") {
      const amount = Number(effect.options?.amount ?? 0.8) * BLUR_MAX
      style.filter = `${style.filter ?? ""} blur(${amount}px)`
    }
    if (effect.type === "grayscale") {
      const amount = Number(effect.options?.amount ?? 0.8)
      style.filter = `${style.filter ?? ""} grayscale(${amount})`
    }
    if (effect.type === "sepia") {
      const amount = Number(effect.options?.amount ?? 0.8)
      style.filter = `${style.filter ?? ""} sepia(${amount})`
    }
    if (effect.type === "rotate") {
      const angle = Number(effect.options?.angle ?? 0.5) * ROTATE_MAX
      const prevTransform = style.transform ?? ""
      style.transform = `${prevTransform} rotate(${angle}deg)`
    }
  })
  return style
}
