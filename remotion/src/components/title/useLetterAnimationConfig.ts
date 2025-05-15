import { letterAnimationPresets } from "./themes"

export function useLetterAnimationConfig(
  letterAnimation:
    | {
        preset?: string
        staggerDelay?: number
        duration?: number
        easing?: string
        from?: Record<string, number | string>
        to?: Record<string, number | string>
        direction?: "ltr" | "rtl" | "center" | "edges"
        animateSpaces?: boolean
      }
    | undefined,
): {
  staggerDelay: number
  duration: number
  easing: string
  from: Record<string, number | string>
  to: Record<string, number | string>
  direction: "ltr" | "rtl" | "center" | "edges"
  animateSpaces: boolean
} | null {
  if (!letterAnimation) return null
  const preset = letterAnimation.preset
  const presetConfig = preset
    ? letterAnimationPresets[preset as keyof typeof letterAnimationPresets]
    : null
  return {
    staggerDelay:
      letterAnimation.staggerDelay ?? presetConfig?.staggerDelay ?? 0.05,
    duration: letterAnimation.duration ?? presetConfig?.duration ?? 0.3,
    easing: letterAnimation.easing ?? presetConfig?.easing ?? "easeOut",
    from: letterAnimation.from ?? presetConfig?.from ?? { opacity: 0 },
    to: letterAnimation.to ?? presetConfig?.to ?? { opacity: 1 },
    direction: (letterAnimation.direction ??
      presetConfig?.direction ??
      "ltr") as "ltr" | "rtl" | "center" | "edges",
    animateSpaces:
      letterAnimation.animateSpaces ?? presetConfig?.animateSpaces ?? false,
  }
}
