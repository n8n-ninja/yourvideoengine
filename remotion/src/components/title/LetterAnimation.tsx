import React from "react"
import { z } from "zod"
import { useTiming } from "@/Utils/useTiming"
import { useProgressEasing } from "@/Utils/useProgressEasing"
import { applyAnimationToStyle } from "@/Utils/style"

export type LetterAnimationConfig = {
  preset?: string
  staggerDelay?: number
  duration?: number
  easing?: string
  from?: Record<string, number | string>
  to?: Record<string, number | string>
  direction?: "ltr" | "rtl" | "center" | "edges"
  animateSpaces?: boolean
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
  titleStart: number
}

type AnimatedLetterProps = {
  char: string
  delay: number
  config: LetterAnimationConfig
  titleStart: number
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  char,
  delay,
  config,
  titleStart,
}) => {
  const letterStart = titleStart + delay
  const duration = config.duration ?? 0.3
  const easing = config.easing ?? "easeOut"
  const from = config.from ?? { opacity: 0 }
  const to = config.to ?? { opacity: 1 }
  const timing = useTiming({
    start: letterStart,
    duration,
  })
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition: { easing, duration },
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  let progress = 0
  if (phase === "in") progress = progressIn
  else if (phase === "out") progress = 1 - progressOut
  else progress = 1
  const interpValues = Object.fromEntries(
    Object.keys(from).map((key) => {
      const fromVal = from[key]
      const toVal = to[key]
      if (typeof fromVal === "number" && typeof toVal === "number") {
        return [key, fromVal + (toVal - fromVal) * progress]
      }
      return [key, progress < 1 ? fromVal : toVal]
    }),
  )
  const letterStyle = applyAnimationToStyle(
    { display: "inline-block" },
    interpValues,
  )
  return <span style={letterStyle}>{char}</span>
}

type AnimatedSpaceProps = {
  delay: number
  config: LetterAnimationConfig
  titleStart: number
}

const AnimatedSpace: React.FC<AnimatedSpaceProps> = ({
  delay,
  config,
  titleStart,
}) => {
  const spaceStart = titleStart + delay
  const duration = config.duration ?? 0.3
  const easing = config.easing ?? "easeOut"
  const from = config.from ?? { opacity: 0 }
  const to = config.to ?? { opacity: 1 }
  const timing = useTiming({
    start: spaceStart,
    duration,
  })
  const { phase, progressIn, progressOut } = useProgressEasing({
    transition: { easing, duration },
    startFrame: timing.startFrame,
    endFrame: timing.endFrame,
  })
  let progress = 0
  if (phase === "in") progress = progressIn
  else if (phase === "out") progress = 1 - progressOut
  else progress = 1
  const interpValues = Object.fromEntries(
    Object.keys(from).map((key) => {
      const fromVal = from[key]
      const toVal = to[key]
      if (typeof fromVal === "number" && typeof toVal === "number") {
        return [key, fromVal + (toVal - fromVal) * progress]
      }
      return [key, progress < 1 ? fromVal : toVal]
    }),
  )
  const spaceStyle = applyAnimationToStyle(
    { display: "inline-block" },
    interpValues,
  )
  return <span style={spaceStyle}>&nbsp;</span>
}

export const LetterAnimation: React.FC<LetterAnimationProps> = ({
  text,
  config,
  titleStart,
}) => {
  const words = text.split(/\s+/)
  const allCharacters = Array.from(text.replace(/\s+/g, " "))
  const direction = config.direction ?? "ltr"
  const animateSpaces = config.animateSpaces ?? false
  const staggerDelay = config.staggerDelay ?? 0.05
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

  const elements: React.ReactNode[] = []
  words.forEach((word, wordIndex) => {
    const characters = Array.from(word)
    const wordStartIndex =
      words.slice(0, wordIndex).join(" ").length +
      (wordIndex > 0 ? wordIndex : 0)
    // Lettres du mot, groupées dans un span
    const wordLetters = characters.map((char, charIndex) => {
      const globalIndex = wordStartIndex + charIndex
      const delayIndex = getDelayIndex(globalIndex)
      const delay = staggerDelay * delayIndex
      return (
        <AnimatedLetter
          key={`char-${wordIndex}-${charIndex}`}
          char={char}
          delay={delay}
          config={config}
          titleStart={titleStart}
        />
      )
    })
    elements.push(
      <span key={`word-${wordIndex}`} style={{ display: "inline-block" }}>
        {wordLetters}
      </span>,
    )
    // Espace animé ou normal entre les mots
    if (wordIndex < words.length - 1) {
      if (animateSpaces) {
        const spaceIndex = wordStartIndex + characters.length
        const delayIndex = getDelayIndex(spaceIndex)
        const delay = staggerDelay * delayIndex
        elements.push(
          <AnimatedSpace
            key={`word-space-${wordIndex}`}
            delay={delay}
            config={config}
            titleStart={titleStart}
          />,
        )
      } else {
        elements.push(
          <span
            key={`word-space-${wordIndex}`}
            style={{ display: "inline-block" }}
          >
            &nbsp;
          </span>,
        )
      }
    }
  })

  return (
    <div style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
      {elements}
    </div>
  )
}
