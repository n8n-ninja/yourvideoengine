import { AbsoluteFill } from "remotion"
import React from "react"
import { titleThemes, letterAnimationPresets } from "./title/themes"
import { LetterAnimation } from "./title/LetterAnimation"
import { useTiming } from "@/hooks/useTiming"
import { useRevealTransition } from "@/hooks/useRevealTransition"
import { getPosition } from "@/utils/getPosition"
import { Title as TitleType, TransitionReveal } from "@/schemas"
import { parseStyleString } from "@/utils/getStyle"

// Base style for all titles
const baseStyle: React.CSSProperties = {
  color: "#fff",
  fontFamily: "Montserrat, sans-serif",
  fontSize: 90,
  textAlign: "center",
  fontWeight: 900,
  margin: 50,
  textWrap: "balance",
  textShadow: "0 2px 30px #000, 0 1px 10px #000",
  lineHeight: 1.1,
}

/**
 * TitleItemDisplay: renders a single title with theme, animation, and transition.
 *
 * @param title The title object to render (TitleType).
 * @returns A styled h1 element with optional letter animation, or null if not visible.
 */
const TitleItemDisplay: React.FC<{ title: TitleType }> = ({ title }) => {
  const timing = useTiming({ ...title.timing, start: title.timing?.start ?? 0 })
  const containerStyle = getPosition(title.position ?? {})
  const transition = (title.transition ?? {}) as TransitionReveal
  const { style: transitionStyle } = useRevealTransition({
    transition,
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  const themeStyle = titleThemes[title.theme ?? "minimal"]
  const titleStyle = title.style ? parseStyleString(title.style) : {}
  const style = {
    ...baseStyle,
    ...themeStyle,
    ...titleStyle,
    ...transitionStyle,
  }
  let letterAnimationConfig = null
  if (title.letterAnimation) {
    const config = title.letterAnimation
    const presetConfig = config.preset
      ? letterAnimationPresets[
          config.preset as keyof typeof letterAnimationPresets
        ]
      : undefined
    letterAnimationConfig = {
      duration: config.duration ?? presetConfig?.duration ?? 0.3,
      easing: config.easing ?? presetConfig?.easing ?? "easeOut",
      stagger: config.stagger ?? presetConfig?.staggerDelay ?? 0.05,
      translateY: config.translateY ?? 20,
    }
  }
  if (!timing.visible) return null
  return (
    <div style={containerStyle}>
      <h1 style={style}>
        {letterAnimationConfig ? (
          <LetterAnimation
            text={title.title || ""}
            config={letterAnimationConfig}
            titleStart={title.timing?.start ?? 0}
          />
        ) : (
          title.title
        )}
      </h1>
    </div>
  )
}

/**
 * Title: renders a list of titles as styled h1 elements with theme, animation, and transition.
 *
 * @param titles Array of title objects to render.
 * @returns An AbsoluteFill containing all rendered titles.
 */
export const Title: React.FC<{ titles: TitleType[] }> = ({ titles }) => {
  return (
    <AbsoluteFill>
      {titles.map((title, idx) => (
        <TitleItemDisplay key={idx} title={title} />
      ))}
    </AbsoluteFill>
  )
}
