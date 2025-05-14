import { letterAnimationPresets } from "./themes"
import { TitleItem } from "../Title"

export function useLetterAnimationConfig(
  letterAnimation: TitleItem["letterAnimation"],
): {
  staggerDelay: number
  duration: number
  easing: string
  from: Record<string, number | string>
  to: Record<string, number | string>
  direction: string
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
    direction: letterAnimation.direction ?? "ltr",
    animateSpaces: letterAnimation.animateSpaces ?? false,
  }
}
