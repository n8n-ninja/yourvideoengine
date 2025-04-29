import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion"

export type TimingConfig = {
  from?: number
  duration?: number
  fadeIn?: number
  fadeOut?: number
  easing?: (input: number) => number
}

export const useTimedVisibility = (
  config: TimingConfig = {},
  defaultDuration?: number,
) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  const {
    from = 0,
    duration = defaultDuration ?? durationInFrames - from,
    fadeIn = 15,
    fadeOut = 15,
    easing = Easing.inOut(Easing.cubic),
  } = config

  const start = from
  const end = from + duration

  const getInterpolatedOpacity = () => {
    const inputRange = [start, start + fadeIn, end - fadeOut, end]
    const outputRange = [0, 1, 1, 0]

    // Vérifie que les points sont strictement croissants
    const isValidRange = inputRange.every(
      (val, i, arr) => i === 0 || val > arr[i - 1],
    )

    if (!isValidRange) {
      return frame >= start && frame <= end ? 1 : 0 // fallback : pas d'animation
    }

    return interpolate(frame, inputRange, outputRange, {
      easing,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  }

  const opacity = getInterpolatedOpacity()

  return {
    opacity,
    frame,
    localFrame: frame - from,
  }
}
