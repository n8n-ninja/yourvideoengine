import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import React from "react"

function parseStyleString(style: string): React.CSSProperties {
  const obj = style
    .split(";")
    .filter(Boolean)
    .reduce((acc: Record<string, string>, rule: string) => {
      const [key, value] = rule.split(":")
      if (!key || !value) return acc
      const jsKey: string = key
        .trim()
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      acc[jsKey] = value.trim()
      return acc
    }, {})
  return obj as React.CSSProperties
}

export const TitlesSchema = z.array(
  z.object({
    title: z.string(),
    time: z.number().optional(),
    duration: z.number().optional(),
    titleInDuration: z.number().optional(),
    titleOutDuration: z.number().optional(),
    titleEasing: z.string().optional(),
    titleStartOffset: z.number().optional(),
    titleEndOffset: z.number().optional(),
    theme: z
      .enum([
        "minimal",
        "impact",
        "elegant",
        "neon",
        "shadow",
        "outline",
        "gradient",
        "retro",
        "cinematic",
      ])
      .optional(),
    letterAnimation: z
      .object({
        preset: z
          .enum(["typewriter", "fade", "slide", "bounce", "random"])
          .optional(),
        staggerDelay: z.number().optional(),
        duration: z.number().optional(),
        easing: z.string().optional(),
        from: z.record(z.any()).optional(),
        to: z.record(z.any()).optional(),
        direction: z.enum(["ltr", "rtl", "center", "edges"]).optional(),
        animateSpaces: z.boolean().optional(),
      })
      .optional(),
    animation: z
      .object({
        from: z.record(z.any()),
        to: z.record(z.any()),
        exit: z.record(z.any()).optional(),
        easing: z.string().optional(),
      })
      .optional(),
    backgroundBox: z
      .object({
        enabled: z.boolean().optional(),
        style: z.union([z.record(z.any()), z.string()]).optional(),
        padding: z.number().optional(),
        startOffset: z.number().optional(),
        endOffset: z.number().optional(),
        animation: z
          .object({
            from: z.record(z.any()),
            to: z.record(z.any()),
            exit: z.record(z.any()).optional(),
            easing: z.string().optional(),
            inDuration: z.number().optional(),
            outDuration: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
    top: z.number().optional(),
    left: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    horizontalAlign: z.enum(["start", "center", "end"]).optional(),
    verticalAlign: z.enum(["start", "center", "end"]).optional(),
    titleStyle: z.union([z.record(z.any()), z.string()]).optional(),
  }),
)

type TitleItem = z.infer<typeof TitlesSchema>[number]

type TitleProps = {
  titles: TitleItem[]
}

const letterAnimationPresets = {
  typewriter: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    staggerDelay: 0.05,
    duration: 0.1,
    easing: "linear",
    direction: "ltr",
    animateSpaces: false,
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    staggerDelay: 0.03,
    duration: 0.3,
    easing: "easeInOut",
    direction: "ltr",
    animateSpaces: true,
  },
  slide: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    staggerDelay: 0.04,
    duration: 0.4,
    easing: "easeOut",
    direction: "ltr",
    animateSpaces: true,
  },
  bounce: {
    from: { opacity: 0, translateY: -20, scale: 1.2 },
    to: { opacity: 1, translateY: 0, scale: 1 },
    staggerDelay: 0.05,
    duration: 0.5,
    easing: "easeOutElastic",
    direction: "ltr",
    animateSpaces: true,
  },
  random: {
    from: { opacity: 0, translateY: 30, rotate: -10 },
    to: { opacity: 1, translateY: 0, rotate: 0 },
    staggerDelay: 0.03,
    duration: 0.4,
    easing: "easeOut",
    direction: "ltr",
    animateSpaces: true,
  },
}

function getEasingFn(easingName?: string): (x: number) => number {
  if (!easingName || easingName === "linear") return (x: number) => x
  if (easingName === "easeIn") return (x: number) => x * x
  if (easingName === "easeOut") return (x: number) => 1 - (1 - x) * (1 - x)
  if (easingName === "easeInOut")
    return (x: number) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  if (easingName === "easeOutElastic")
    return (x: number) => {
      const c4 = (2 * Math.PI) / 3
      return x === 0
        ? 0
        : x === 1
          ? 1
          : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
    }
  return (x: number) => x
}

function interpolate(
  from: Record<string, number | string>,
  to: Record<string, number | string>,
  progress: number,
): Record<string, number | string> {
  const out: Record<string, number | string> = {}
  for (const key in from) {
    if (typeof from[key] === "number" && typeof to[key] === "number") {
      out[key] = from[key] + (to[key] - from[key]) * progress
    } else if (typeof from[key] === "string" && typeof to[key] === "string") {
      out[key] = progress < 0.5 ? from[key] : to[key]
    }
  }
  return out
}

function applyAnimationToStyle(
  baseStyle: React.CSSProperties,
  interp: Record<string, number | string>,
): React.CSSProperties {
  const style = { ...baseStyle }

  if (interp.opacity !== undefined) style.opacity = interp.opacity
  if (interp.backgroundColor !== undefined)
    style.backgroundColor = interp.backgroundColor as string
  if (interp.borderRadius !== undefined)
    style.borderRadius = interp.borderRadius

  if (interp.width !== undefined) {
    if (typeof interp.width === "number") {
      style.width = `${interp.width}px`
    } else {
      style.width = interp.width
    }
  }

  if (interp.height !== undefined) {
    if (typeof interp.height === "number") {
      style.height = `${interp.height}px`
    } else {
      style.height = interp.height
    }
  }

  return style
}

const titleThemes: Record<string, React.CSSProperties> = {
  minimal: {
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
    fontSize: 90,
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
  impact: {
    color: "#ffffff",
    fontFamily: "Impact, sans-serif",
    fontSize: 100,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    textShadow: "2px 2px 0 #000",
  },
  elegant: {
    color: "#ffffff",
    fontFamily: "Playfair Display, serif",
    fontSize: 85,
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "0.05em",
    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
  },
  neon: {
    color: "#00fff7",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 80,
    fontWeight: 700,
    textShadow:
      "0 0 5px #00fff7, 0 0 10px #00fff7, 0 0 20px #00fff7, 0 0 30px #00fff7",
    letterSpacing: "0.08em",
  },
  shadow: {
    color: "#ffffff",
    fontFamily: "Roboto, sans-serif",
    fontSize: 90,
    fontWeight: 900,
    textShadow:
      "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",
  },
  outline: {
    color: "transparent",
    fontFamily: "Oswald, sans-serif",
    fontSize: 95,
    fontWeight: 800,
    WebkitTextStroke: "2px white",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  gradient: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 90,
    fontWeight: 800,
    background: "linear-gradient(to right, #ff8a00, #da1b60, #8a16ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 15px rgba(0,0,0,0.2)",
  },
  retro: {
    color: "#ffde59",
    fontFamily: "Press Start 2P, cursive",
    fontSize: 60,
    textShadow: "5px 5px 0px #ff00a2",
    letterSpacing: "0.05em",
    lineHeight: 1.5,
  },
  cinematic: {
    color: "#ffffff",
    fontFamily: "Cinzel, serif",
    fontSize: 85,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    textShadow: "0 2px 30px rgba(0,0,0,0.8)",
  },
}

export const Title: React.FC<TitleProps> = ({ titles }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const currentTime = frame / fps

  const videoWidth = width ?? 1080
  const videoHeight = height ?? 1920

  // Filter all titles that should be visible at the current time
  const visibleTitles = titles.filter((t) => {
    const titleStart = t.time ?? 0
    const titleDuration = t.duration ?? Infinity
    return currentTime >= titleStart && currentTime < titleStart + titleDuration
  })

  if (visibleTitles.length === 0) return null

  return (
    <AbsoluteFill
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        width: videoWidth,
        height: videoHeight,
      }}
    >
      {visibleTitles.map((title, idx) => {
        const top = title.top ?? 10
        const left = title.left ?? 0
        const right = title.right ?? 0
        const bottom = title.bottom ?? 0
        const horizontalAlign = title.horizontalAlign ?? "center"
        const verticalAlign = title.verticalAlign ?? "center"

        const containerStyle: React.CSSProperties = {
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          right: `${right}%`,
          bottom: `${bottom}%`,
          display: "flex",
          justifyContent: horizontalAlign,
          alignItems: verticalAlign,
          width: "100%",
          height: "100%",
          pointerEvents: "none" as const,
        }

        let resolvedTitleStyle: React.CSSProperties = {
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontSize: 90,
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
        if ("transition" in resolvedTitleStyle)
          delete resolvedTitleStyle.transition

        const titleStart = (title.time ?? 0) + (title.titleStartOffset ?? 0)
        const titleDuration = title.duration ?? Infinity
        const titleEndOffset = title.titleEndOffset ?? 0
        const titleInDuration = title.titleInDuration ?? 0
        const titleOutDuration = title.titleOutDuration ?? 0
        const titleInEnd = titleStart + titleInDuration
        const titleOutStart =
          titleStart + titleDuration + titleEndOffset - titleOutDuration
        const titleAppear =
          currentTime >= titleStart &&
          currentTime < titleStart + titleDuration + titleEndOffset

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

        const showBackgroundBox = title.backgroundBox?.enabled ?? false
        let backgroundBoxStyle: React.CSSProperties = {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 8,
          padding: title.backgroundBox?.padding ?? 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }
        if (title.backgroundBox?.style) {
          if (typeof title.backgroundBox.style === "string") {
            backgroundBoxStyle = {
              ...backgroundBoxStyle,
              ...parseStyleString(title.backgroundBox.style),
            }
          } else {
            backgroundBoxStyle = {
              ...backgroundBoxStyle,
              ...title.backgroundBox.style,
            }
          }
        }

        let animatedBoxStyle: React.CSSProperties | undefined = undefined
        let showBox = false
        if (
          showBackgroundBox &&
          title.backgroundBox?.animation &&
          title.backgroundBox.animation.from &&
          title.backgroundBox.animation.to
        ) {
          const boxAnim = title.backgroundBox.animation
          const boxStartOffset = title.backgroundBox.startOffset ?? 0
          const boxEndOffset = title.backgroundBox.endOffset ?? 0
          const boxInDuration = boxAnim.inDuration ?? titleInDuration
          const boxOutDuration = boxAnim.outDuration ?? titleOutDuration

          const baseTime = title.time ?? 0
          const boxStart = baseTime + boxStartOffset
          const boxInEnd = boxStart + boxInDuration
          const boxEnd = baseTime + titleDuration + boxEndOffset
          const boxOutStart = boxEnd - boxOutDuration

          showBox = currentTime >= boxStart && currentTime < boxEnd

          let boxAnimProgress = 1
          if (
            boxInDuration > 0 &&
            currentTime < boxInEnd &&
            currentTime >= boxStart
          ) {
            boxAnimProgress = Math.min(
              1,
              Math.max(0, (currentTime - boxStart) / boxInDuration),
            )
          } else if (boxOutDuration > 0 && currentTime > boxOutStart) {
            boxAnimProgress = Math.max(
              0,
              1 - (currentTime - boxOutStart) / boxOutDuration,
            )
          } else if (currentTime < boxStart) {
            boxAnimProgress = 0
          }

          const easingFn = getEasingFn(boxAnim.easing)
          let interp: Record<string, number | string>

          if (
            boxInDuration > 0 &&
            currentTime < boxInEnd &&
            currentTime >= boxStart
          ) {
            const easedProgress = easingFn(boxAnimProgress)
            interp = interpolate(boxAnim.from, boxAnim.to, easedProgress)
          } else if (boxOutDuration > 0 && currentTime > boxOutStart) {
            const outProgress = 1 - boxAnimProgress
            const easedProgress = easingFn(outProgress)
            interp = interpolate(
              boxAnim.to,
              boxAnim.exit || boxAnim.from,
              easedProgress,
            )
          } else if (currentTime < boxStart) {
            interp = { ...boxAnim.from }
          } else {
            interp = { ...boxAnim.to }
          }

          animatedBoxStyle = applyAnimationToStyle(backgroundBoxStyle, interp)
        }

        const hasLetterAnimation = !!title.letterAnimation
        let letterAnimationConfig = null
        if (hasLetterAnimation) {
          const preset = title.letterAnimation?.preset
          const presetConfig = preset ? letterAnimationPresets[preset] : null
          letterAnimationConfig = {
            staggerDelay:
              title.letterAnimation?.staggerDelay ??
              presetConfig?.staggerDelay ??
              0.05,
            duration:
              title.letterAnimation?.duration ?? presetConfig?.duration ?? 0.3,
            easing:
              title.letterAnimation?.easing ??
              presetConfig?.easing ??
              "easeOut",
            from: title.letterAnimation?.from ??
              presetConfig?.from ?? { opacity: 0 },
            to: title.letterAnimation?.to ?? presetConfig?.to ?? { opacity: 1 },
            direction: title.letterAnimation?.direction ?? "ltr",
            animateSpaces: title.letterAnimation?.animateSpaces ?? false,
          }
        }

        const renderLetterAnimation = (text: string) => {
          if (!hasLetterAnimation || !letterAnimationConfig) {
            return text
          }
          const words = text.split(/\s+/)
          const allCharacters = Array.from(text.replace(/\s+/g, " "))
          const direction = letterAnimationConfig.direction || "ltr"
          const animateSpaces = letterAnimationConfig.animateSpaces || false
          const totalChars = allCharacters.length
          const middle = Math.floor(totalChars / 2)
          const halfLength = totalChars / 2
          const getDelayIndex = (globalIndex: number) => {
            if (direction === "rtl") {
              return totalChars - 1 - globalIndex
            } else if (direction === "center") {
              return Math.abs(middle - globalIndex)
            } else if (direction === "edges") {
              return halfLength - Math.abs(globalIndex - halfLength)
            } else {
              return globalIndex
            }
          }
          return (
            <div style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
              {words.map((word, wordIndex) => {
                const characters = Array.from(word)
                const wordStartIndex =
                  words.slice(0, wordIndex).join(" ").length +
                  (wordIndex > 0 ? wordIndex : 0)
                const wordElement = (
                  <span
                    key={`word-${wordIndex}`}
                    style={{ display: "inline-block", marginRight: 0 }}
                  >
                    {characters.map((char, charIndex) => {
                      const globalIndex = wordStartIndex + charIndex
                      const delayIndex = getDelayIndex(globalIndex)
                      const delay =
                        letterAnimationConfig.staggerDelay * delayIndex
                      const letterDuration = letterAnimationConfig.duration
                      let letterProgress = 0
                      const letterStart = titleStart + delay
                      const letterEnd = letterStart + letterDuration
                      if (
                        currentTime >= letterStart &&
                        currentTime < letterEnd
                      ) {
                        letterProgress =
                          (currentTime - letterStart) / letterDuration
                      } else if (currentTime >= letterEnd) {
                        letterProgress = 1
                      }
                      const easingFn = getEasingFn(letterAnimationConfig.easing)
                      const easedProgress = easingFn(letterProgress)
                      const interpValues = interpolate(
                        letterAnimationConfig.from,
                        letterAnimationConfig.to,
                        easedProgress,
                      )
                      const letterStyle = applyAnimationToStyle(
                        { display: "inline-block" },
                        interpValues,
                      )
                      return (
                        <span
                          key={`char-${wordIndex}-${charIndex}`}
                          style={letterStyle}
                        >
                          {char}
                        </span>
                      )
                    })}
                  </span>
                )
                if (wordIndex < words.length - 1) {
                  if (animateSpaces) {
                    const spaceIndex = wordStartIndex + characters.length
                    const delayIndex = getDelayIndex(spaceIndex)
                    const delay =
                      letterAnimationConfig.staggerDelay * delayIndex
                    const letterDuration = letterAnimationConfig.duration
                    let spaceProgress = 0
                    const spaceStart = titleStart + delay
                    const spaceEnd = spaceStart + letterDuration
                    if (currentTime >= spaceStart && currentTime < spaceEnd) {
                      spaceProgress =
                        (currentTime - spaceStart) / letterDuration
                    } else if (currentTime >= spaceEnd) {
                      spaceProgress = 1
                    }
                    const easingFn = getEasingFn(letterAnimationConfig.easing)
                    const easedProgress = easingFn(spaceProgress)
                    const interpValues = interpolate(
                      letterAnimationConfig.from,
                      letterAnimationConfig.to,
                      easedProgress,
                    )
                    const spaceStyle = applyAnimationToStyle(
                      { display: "inline-block" },
                      interpValues,
                    )
                    return (
                      <React.Fragment key={`word-space-${wordIndex}`}>
                        {wordElement}
                        <span style={spaceStyle}>&nbsp;</span>
                      </React.Fragment>
                    )
                  } else {
                    return (
                      <React.Fragment key={`word-space-${wordIndex}`}>
                        {wordElement}
                        <span style={{ display: "inline-block" }}>&nbsp;</span>
                      </React.Fragment>
                    )
                  }
                }
                return wordElement
              })}
            </div>
          )
        }

        return titleAppear ? (
          <div key={idx} style={containerStyle}>
            {showBackgroundBox && showBox ? (
              <div
                style={{
                  ...backgroundBoxStyle,
                  ...(animatedBoxStyle ? animatedBoxStyle : {}),
                }}
              >
                <div
                  style={{
                    ...resolvedTitleStyle,
                    ...(animatedTitleStyle ? animatedTitleStyle : {}),
                    opacity: animatedTitleStyle?.opacity ?? titleAnimProgress,
                    margin: 0,
                    whiteSpace: hasLetterAnimation ? "normal" : "nowrap",
                  }}
                >
                  {hasLetterAnimation
                    ? renderLetterAnimation(title.title)
                    : title.title}
                </div>
              </div>
            ) : (
              <div
                style={{
                  ...resolvedTitleStyle,
                  ...(animatedTitleStyle ? animatedTitleStyle : {}),
                  opacity: animatedTitleStyle?.opacity ?? titleAnimProgress,
                  whiteSpace: hasLetterAnimation ? "normal" : "nowrap",
                }}
              >
                {hasLetterAnimation
                  ? renderLetterAnimation(title.title)
                  : title.title}
              </div>
            )}
          </div>
        ) : null
      })}
    </AbsoluteFill>
  )
}
