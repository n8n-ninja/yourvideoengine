import React from "react"
import { titleThemes } from "@/styles/title-themes"
import { LetterAnimation } from "@/components/LetterAnimation"
import { getStyle } from "@/utils/getStyle"
import { titleBaseStyle } from "@/styles/default-style"
import { Layout } from "@/components/Layout"
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
  boxStyle?: React.CSSProperties
  textStyle?: React.CSSProperties
  perWord?: boolean
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
  boxStyle,
  textStyle,
  perWord = false,
  letterAnimation,
  timing,
  reveal,
  position,
  effects,
  layoutStyle,
}) => {
  const themeStyle = theme && titleThemes[theme] ? titleThemes[theme] : {}
  const computedStyle = getStyle(undefined, {
    ...titleBaseStyle,
    ...themeStyle,
    ...boxStyle,
  })

  return (
    <Layout
      timing={timing}
      reveal={reveal}
      position={position}
      effects={effects}
      style={layoutStyle}
    >
      <h1 style={computedStyle}>
        {letterAnimation ? (
          <LetterAnimation text={title || ""} config={letterAnimation} />
        ) : perWord ? (
          title.split(" ").map((word, idx) => (
            <span
              key={idx}
              style={{
                ...textStyle,
                marginRight: "0.25em",
              }}
            >
              {word}
            </span>
          ))
        ) : (
          <span
            style={{
              ...textStyle,
            }}
          >
            {title}
          </span>
        )}
      </h1>
    </Layout>
  )
}
