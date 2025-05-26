import React from "react"
import { titleThemes } from "../../styles/title-themes"
import { LetterAnimation } from "../LetterAnimation"
import { TitleBlockType } from "@/schemas/project"
import { getStyle } from "@/utils/getStyle"
import { titleBaseStyle } from "@/styles/default-style"

/**
 * Title: renders a single title with theme and animation.
 *
 * @param title The title object to render (TitleType).
 * @param revealProgress The reveal progress of the title (number, optional, default 1).
 * @returns A styled h1 element with optional letter animation.
 */
export const Title: React.FC<{
  title: TitleBlockType
  revealProgress?: number
}> = ({ title, revealProgress = 1 }) => {
  const themeStyle =
    title.theme && titleThemes[title.theme] ? titleThemes[title.theme] : {}
  const style = getStyle(title.style, { ...titleBaseStyle, ...themeStyle })
  let letterAnimationConfig = null
  if (title.letterAnimation) {
    const config = title.letterAnimation
    letterAnimationConfig = {
      duration: config.duration ?? 0.3,
      easing: config.easing ?? "easeOut",
      stagger: config.stagger ?? 0.05,
      translateY: config.translateY ?? 20,
    }
  }

  return (
    <h1 style={style}>
      {letterAnimationConfig ? (
        <LetterAnimation
          text={title.title || ""}
          config={letterAnimationConfig}
        />
      ) : (
        title.title
      )}
    </h1>
  )
}
