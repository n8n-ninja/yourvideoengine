import React from "react"
import { titleThemes } from "../../styles/title-themes"
import { LetterAnimation } from "../LetterAnimation"
import { getStyle } from "@/utils/getStyle"
import { titleBaseStyle } from "@/styles/default-style"
import { Layout } from "../Layout"
import { Effects } from "@/schemas/effect"
import { Reveal } from "@/schemas/reveal"
import { Timing } from "@/schemas/timing"
import { Position } from "@/schemas/position"
import { Style } from "@/schemas/style"

/**
 * Title: renders a single title with theme and animation.
 *
 * @param title The title object to render (TitleType).
 * @param revealProgress The reveal progress of the title (number, optional, default 1).
 * @returns A styled h1 element with optional letter animation.
 */
export const Title: React.FC<{
  title: string
  theme?: string
  style?: string
  letterAnimation?: {
    duration: number
    easing: string
    stagger: number
    translateY: number
  }
  timing?: Timing
  reveal?: Reveal
  position?: Position
  effects?: Effects
  layoutStyle?: Style
}> = ({
  title,
  theme,
  style,
  letterAnimation,
  timing,
  reveal,
  position,
  effects,
  layoutStyle,
}) => {
  const themeStyle = theme && titleThemes[theme] ? titleThemes[theme] : {}
  const computedStyle = getStyle(style, { ...titleBaseStyle, ...themeStyle })
  let letterAnimationConfig = null
  if (letterAnimation) {
    const config = letterAnimation
    letterAnimationConfig = {
      duration: config.duration ?? 0.3,
      easing: config.easing ?? "easeOut",
      stagger: config.stagger ?? 0.05,
      translateY: config.translateY ?? 20,
    }
  }

  return (
    <Layout
      timing={timing}
      reveal={reveal}
      position={position}
      effects={effects}
      style={layoutStyle}
    >
      <h1 style={computedStyle}>
        {letterAnimationConfig ? (
          <LetterAnimation text={title || ""} config={letterAnimationConfig} />
        ) : (
          title
        )}
      </h1>
    </Layout>
  )
}
