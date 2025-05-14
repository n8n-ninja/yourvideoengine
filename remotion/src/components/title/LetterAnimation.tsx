import React from "react"
import { getEasingFn, interpolate } from "@/Utils/time"
import { applyAnimationToStyle } from "@/Utils/style"
import { z } from "zod"

export type LetterAnimationConfig = {
  staggerDelay: number
  duration: number
  easing: string
  from: Record<string, number | string>
  to: Record<string, number | string>
  direction: "ltr" | "rtl" | "center" | "edges"
  animateSpaces: boolean
}

export const LetterAnimationConfigSchema = z.object({
  preset: z.string().optional(),
  staggerDelay: z.number().optional(),
  duration: z.number().optional(),
  easing: z.string().optional(),
  from: z.record(z.any()).optional(),
  to: z.record(z.any()).optional(),
  direction: z.enum(["ltr", "rtl", "center", "edges"]).optional(),
  animateSpaces: z.boolean().optional(),
})

type LetterAnimationProps = {
  text: string
  config: LetterAnimationConfig
  currentTime: number
  titleStart: number
}

export const LetterAnimation: React.FC<LetterAnimationProps> = ({
  text,
  config,
  currentTime,
  titleStart,
}) => {
  const words = text.split(/\s+/)
  const allCharacters = Array.from(text.replace(/\s+/g, " "))
  const direction = config.direction || "ltr"
  const animateSpaces = config.animateSpaces || false
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
              const delay = config.staggerDelay * delayIndex
              const letterDuration = config.duration
              let letterProgress = 0
              const letterStart = titleStart + delay
              const letterEnd = letterStart + letterDuration
              if (currentTime >= letterStart && currentTime < letterEnd) {
                letterProgress = (currentTime - letterStart) / letterDuration
              } else if (currentTime >= letterEnd) {
                letterProgress = 1
              }
              const easingFn = getEasingFn(config.easing)
              const easedProgress = easingFn(letterProgress)
              const interpValues = interpolate(
                config.from,
                config.to,
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
            const delay = config.staggerDelay * delayIndex
            const letterDuration = config.duration
            let spaceProgress = 0
            const spaceStart = titleStart + delay
            const spaceEnd = spaceStart + letterDuration
            if (currentTime >= spaceStart && currentTime < spaceEnd) {
              spaceProgress = (currentTime - spaceStart) / letterDuration
            } else if (currentTime >= spaceEnd) {
              spaceProgress = 1
            }
            const easingFn = getEasingFn(config.easing)
            const easedProgress = easingFn(spaceProgress)
            const interpValues = interpolate(
              config.from,
              config.to,
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
