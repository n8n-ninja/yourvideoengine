import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import React from "react"
import { getEasingFn, useTimeRange, interpolate } from "@/Utils/time"
import type { UseTransitionProps } from "@/Utils/useTransition"
import { titleThemes, letterAnimationPresets } from "./title/themes"
import { applyAnimationToStyle } from "@/Utils/style"
import { LetterAnimation, LetterAnimationConfig } from "./title/LetterAnimation"
import { useTransition } from "@/Utils/useTransition"
import { usePositionStyle } from "@/Utils/usePositionStyle"
import { useLetterAnimationConfig } from "./title/useLetterAnimationConfig"
import { LetterAnimationConfigSchema } from "./title/LetterAnimation"
import { parseStyleString } from "@/Utils/style"
import { TransitionSchema } from "@/Utils/useTransition"
import { PositionStyleSchema } from "@/Utils/usePositionStyle"

// Liste des noms de thèmes disponibles
const themeNames = Object.keys(titleThemes) // string[]

// Liste des noms de presets d'animation disponibles
const animationPresetNames = Object.keys(letterAnimationPresets) // string[]

const LetterAnimationSchema = LetterAnimationConfigSchema.extend({
  preset: z.enum(animationPresetNames as [string, ...string[]]).optional(),
})

export const TitlesSchema = z.array(
  z.object({
    title: z.string(),
    transition: TransitionSchema.optional(),
    position: PositionStyleSchema.optional(),
    theme: z.enum(themeNames as [string, ...string[]]).optional(),
    letterAnimation: LetterAnimationSchema.optional(),
    animation: z
      .object({
        from: z.record(z.any()),
        to: z.record(z.any()),
        exit: z.record(z.any()).optional(),
        easing: z.string().optional(),
      })
      .optional(),
    titleStyle: z.union([z.record(z.any()), z.string()]).optional(),
  }),
)

export type TitleTransition = Omit<UseTransitionProps, "currentTime">
export type TitleItem = Omit<
  z.infer<typeof TitlesSchema>[number],
  "transition" | "position"
> & {
  transition?: TitleTransition
  position?: import("@/Utils/usePositionStyle").UsePositionStyleProps
}

type TitleProps = {
  titles: TitleItem[]
}

// Subcomponent for displaying a single title with timing logic
const TitleItemDisplay: React.FC<{ title: TitleItem }> = ({ title }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const { from, frames } = useTimeRange({
    start: title.transition?.start ?? 0,
    duration: title.transition?.duration,
  })

  const containerStyle = usePositionStyle(title.position ?? {})

  let resolvedTitleStyle: React.CSSProperties = {
    color: "#fff",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 90,
    textAlign: "center",
    fontWeight: 900,
    marginBottom: 12,
    textShadow: "0 2px 30px #000, 0 1px 10px #000",
    lineHeight: 1.1,
  }
  if (title.theme && titleThemes[title.theme]) {
    resolvedTitleStyle = {
      ...resolvedTitleStyle,
      ...titleThemes[title.theme],
    }
  }
  if (title.titleStyle) {
    if (typeof title.titleStyle === "string") {
      resolvedTitleStyle = {
        ...resolvedTitleStyle,
        ...parseStyleString(title.titleStyle),
      }
    } else {
      resolvedTitleStyle = { ...resolvedTitleStyle, ...title.titleStyle }
    }
  }
  if ("transition" in resolvedTitleStyle) delete resolvedTitleStyle.transition

  const transition = useTransition({
    ...title.transition,
    start: title.transition?.start ?? 0,
    currentTime,
  })

  const letterAnimationConfig = useLetterAnimationConfig(title.letterAnimation)
  const hasLetterAnimation = !!letterAnimationConfig

  if (frame < from || frame >= from + frames) return null
  if (!transition.visible) return null

  const titleStart = title.transition?.start ?? 0
  const titleDuration = title.transition?.duration ?? Infinity
  const titleEndOffset = 0
  const titleInDuration = title.transition?.inDuration ?? 0
  const titleOutDuration = title.transition?.outDuration ?? 0
  const titleInEnd = titleStart + titleInDuration
  const titleOutStart =
    titleStart + titleDuration + titleEndOffset - titleOutDuration

  let titleAnimProgress = 1
  if (titleInDuration > 0 && currentTime < titleInEnd) {
    titleAnimProgress = Math.min(
      1,
      Math.max(0, (currentTime - titleStart) / titleInDuration),
    )
  } else if (titleOutDuration > 0 && currentTime > titleOutStart) {
    titleAnimProgress = Math.max(
      0,
      1 - (currentTime - titleOutStart) / titleOutDuration,
    )
  }

  let animatedTitleStyle: React.CSSProperties | undefined = undefined
  if (title.animation && title.animation.from && title.animation.to) {
    const easingFn = getEasingFn(title.animation.easing)
    let interp: Record<string, number | string>
    if (titleInDuration > 0 && currentTime < titleInEnd) {
      const easedProgress = easingFn(titleAnimProgress)
      interp = interpolate(
        title.animation.from,
        title.animation.to,
        easedProgress,
      )
    } else if (titleOutDuration > 0 && currentTime > titleOutStart) {
      const outProgress = 1 - titleAnimProgress
      const easedProgress = easingFn(outProgress)
      interp = interpolate(
        title.animation.to,
        title.animation.exit || title.animation.from,
        easedProgress,
      )
    } else {
      interp = { ...title.animation.to }
    }
    animatedTitleStyle = applyAnimationToStyle(resolvedTitleStyle, interp)
  }

  return (
    <div style={{ ...containerStyle }}>
      <div
        style={{
          ...resolvedTitleStyle,
          ...(animatedTitleStyle ? animatedTitleStyle : {}),
          ...transition.style,
          opacity:
            Number(animatedTitleStyle?.opacity ?? titleAnimProgress) *
            Number(transition.style.opacity ?? 1),
        }}
      >
        {hasLetterAnimation && letterAnimationConfig ? (
          <LetterAnimation
            text={title.title}
            config={letterAnimationConfig as LetterAnimationConfig}
            currentTime={currentTime}
            titleStart={titleStart}
          />
        ) : (
          title.title
        )}
      </div>
    </div>
  )
}

export const Title: React.FC<TitleProps> = ({ titles }) => {
  const videoConfig = useVideoConfig()
  return (
    <AbsoluteFill
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        width: videoConfig.width ?? 1080,
        height: videoConfig.height ?? 1920,
      }}
    >
      {titles.map((title, idx) => (
        <TitleItemDisplay key={idx} title={title} />
      ))}
    </AbsoluteFill>
  )
}
