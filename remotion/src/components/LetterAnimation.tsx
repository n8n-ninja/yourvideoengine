import React from "react"
import { z } from "zod"
import { useCurrentFrame, useVideoConfig, random } from "remotion"

/**
 * LetterAnimationConfig: config for animating letters.
 * - direction: 'ltr' | 'rtl' | 'random' (default: 'ltr')
 */
export type LetterAnimationConfig = {
  duration?: number // duration of each letter animation (seconds)
  stagger?: number // delay between each letter (seconds)
  easing?: string // (non utilisé ici)
  translateY?: number // px to move from (default 20)
  direction?: "ltr" | "rtl" | "random"
}

export const LetterAnimationConfigSchema = z.object({
  duration: z.number().optional(),
  stagger: z.number().optional(),
  easing: z.string().optional(),
  translateY: z.number().optional(),
  direction: z.enum(["ltr", "rtl", "random"]).optional(),
})

/**
 * LetterAnimation: animates a string letter by letter (fade in + translateY),
 * regroups each word in a span to avoid ugly line breaks.
 * Supports direction: ltr, rtl, random.
 */
export const LetterAnimation: React.FC<{
  text: string
  config?: LetterAnimationConfig
  titleStart?: number
}> = ({ text, config = {}, titleStart = 0 }) => {
  const {
    duration = 0.5,
    stagger = 0.15,
    translateY = 20,
    direction = "random",
  } = config

  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const words = text.split(/(\s+)/) // keep spaces as tokens
  let globalIndex = 0

  // Helper to get a stable random permutation for a word (using remotion's random)
  function getRandomOrder(length: number, seed: string) {
    const arr = Array.from({ length }, (_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random(seed + i) * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Easing simple (linear)
  function ease(t: number) {
    return t
  }

  // Internal component for each letter to use hooks correctly
  const LetterSpan: React.FC<{ char: string; delayIndex: number }> = ({
    char,
    delayIndex,
  }) => {
    const inStart = titleStart + delayIndex * stagger
    let opacity = 0
    let y = translateY
    if (currentTime < inStart) {
      opacity = 0
      y = translateY
    } else {
      const t = Math.min((currentTime - inStart) / duration, 1)
      opacity = ease(t)
      y = (1 - ease(t)) * translateY
    }
    return (
      <span
        style={{
          display: "inline-block",
          opacity,
          transform: `translateY(${y}px)`,
          transition: "none",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    )
  }

  return (
    <div style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
      {words.map((word, wIdx) => {
        if (/^\s+$/.test(word)) {
          // espace : span insécable
          return (
            <span key={`space-${wIdx}`} style={{ display: "inline-block" }}>
              {"\u00A0"}
            </span>
          )
        }
        // mot : span qui regroupe toutes les lettres
        const letters = Array.from(word)
        // Calcule l'ordre d'animation (delayIndex) pour chaque lettre
        let order: number[] = []
        if (direction === "ltr") {
          order = Array.from({ length: letters.length }, (_, i) => i)
        } else if (direction === "rtl") {
          order = Array.from(
            { length: letters.length },
            (_, i) => letters.length - 1 - i,
          )
        } else if (direction === "random") {
          order = getRandomOrder(letters.length, word + wIdx)
        }
        // Associe à chaque lettre son delayIndex selon la direction
        const letterSpans = letters.map((char, i) => {
          const delayIndex = order[i]
          const el = (
            <LetterSpan
              key={i}
              char={char}
              delayIndex={globalIndex + delayIndex - i}
            />
          )
          return el
        })
        globalIndex += letters.length
        return (
          <span key={`word-${wIdx}`} style={{ display: "inline-block" }}>
            {letterSpans}
          </span>
        )
      })}
    </div>
  )
}
