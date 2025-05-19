import React from "react"
import { titleThemes, letterAnimationPresets } from "./title/themes"
import { LetterAnimation } from "./LetterAnimation"
import { Title as TitleType } from "@/schemas"
import { parseStyleString } from "@/utils/getStyle"
import { titleBaseStyle } from "@/styles/default-style"
import { useTheme } from "./theme-context"

/**
 * Title: renders a single title with theme and animation.
 *
 * @param title The title object to render (TitleType).
 * @returns A styled h1 element with optional letter animation.
 */
export const Title: React.FC<{ title: TitleType }> = ({ title }) => {
  const theme = useTheme()
  const themeStyle =
    title.theme && titleThemes[title.theme] ? titleThemes[title.theme] : {}
  const titleStyle = title.style ? parseStyleString(title.style) : {}
  const style = {
    ...titleBaseStyle,
    ...theme.title?.style,
    ...themeStyle,
    ...titleStyle,
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
  // return <h1 style={style}>title.title</h1>
  return (
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
  )
}
