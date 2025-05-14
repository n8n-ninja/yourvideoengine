import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import React from "react"
import { createTikTokStyleCaptions } from "@remotion/captions"
import { usePositionStyle } from "@/Utils/usePositionStyle"
import { useTransition } from "@/Utils/useTransition"
import { parseStyleString } from "@/Utils/style"
import { TransitionSchema } from "@/Utils/useTransition"
import { PositionStyleSchema } from "@/Utils/usePositionStyle"

const defaultActiveWordStyle: React.CSSProperties = {
  zIndex: 100,
  position: "relative",
}

export const CaptionSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
      confidence: z.number().optional(),
    }),
  ),
  position: PositionStyleSchema.optional(),
  transition: TransitionSchema.optional(),
  boxStyle: z.union([z.record(z.any()), z.string()]).optional(),
  textStyle: z.union([z.record(z.any()), z.string()]).optional(),
  activeWordStyle: z.union([z.record(z.any()), z.string()]).optional(),
})

export const Caption: React.FC<z.infer<typeof CaptionSchema>> = ({
  words,
  position,
  transition,
  boxStyle,
  textStyle,
  activeWordStyle,
}) => {
  console.log("words", words)
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Positionnement
  const containerStyle = usePositionStyle(position ?? {})

  // Style de la boîte (container)
  let resolvedBoxStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 18,
    padding: "1.5em 4em",
    display: "inline-block",
    letterSpacing: "0.08em",
    wordSpacing: "1.08em",
    lineHeight: 1.4,
    textWrap: "balance",
    textAlign: "center",
    margin: "30px",
  }

  if (boxStyle) {
    if (typeof boxStyle === "string") {
      resolvedBoxStyle = { ...resolvedBoxStyle, ...parseStyleString(boxStyle) }
    } else {
      resolvedBoxStyle = { ...resolvedBoxStyle, ...boxStyle }
    }
  }

  // Style du texte
  let resolvedTextStyle: React.CSSProperties = {
    color: "#fff",
    verticalAlign: "middle",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 75,
    textShadow: "0 2px 30px #000, 0 1px 10px #000",
    fontWeight: 900,
    transition:
      "color 0.12s cubic-bezier(0.4,0,0.2,1), transform 0.12s cubic-bezier(0.4,0,0.2,1)",
  }
  if (textStyle) {
    if (typeof textStyle === "string") {
      resolvedTextStyle = {
        ...resolvedTextStyle,
        ...parseStyleString(textStyle),
      }
    } else {
      resolvedTextStyle = { ...resolvedTextStyle, ...textStyle }
    }
  }

  // Style du mot actif
  let resolvedActiveWordStyle: React.CSSProperties = {
    ...defaultActiveWordStyle,
    color: "#F8C734",
    textShadow: "0 2px 30px #000, 0 1px 10px #000",
    fontWeight: 900,
  }
  if (activeWordStyle) {
    if (typeof activeWordStyle === "string") {
      resolvedActiveWordStyle = {
        ...resolvedActiveWordStyle,
        ...parseStyleString(activeWordStyle),
      }
    } else {
      resolvedActiveWordStyle = {
        ...resolvedActiveWordStyle,
        ...activeWordStyle,
      }
    }
  }

  // Convert words to TikTok-style captions input
  const captions = words.map((w) => ({
    text: " " + w.word,
    startMs: Math.round(w.start * 1000),
    endMs: Math.round(w.end * 1000),
    timestampMs: Math.round(((w.start + w.end) / 2) * 1000),
    confidence: w.confidence ?? null,
  }))

  // Regroupe les mots en pages façon TikTok
  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 1400,
  })

  // Trouve la page active
  const currentMs = currentTime * 1000
  const activePageIndex = pages.findIndex(
    (p) => currentMs >= p.startMs && currentMs < p.startMs + p.durationMs,
  )
  const activePage = pages[activePageIndex]

  // Animation d'entrée/sortie de la phrase (transition)
  const phraseStart = activePage?.startMs ? activePage.startMs / 1000 : 0
  const phraseDuration = activePage?.durationMs
    ? activePage.durationMs / 1000
    : 0
  const phraseTransition = useTransition({
    ...(transition ?? {}),
    start: phraseStart,
    duration: phraseDuration,
    currentTime,
  })

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={containerStyle}>
        {activePage && phraseTransition.visible && (
          <div
            style={{
              ...resolvedBoxStyle,
              ...phraseTransition.style,
            }}
          >
            {activePage.tokens.map((token, i) => {
              const isActive =
                currentMs >= token.fromMs && currentMs < token.toMs
              return (
                <span
                  key={`${activePageIndex}-${i}`}
                  style={{
                    ...resolvedTextStyle,
                    ...(isActive ? resolvedActiveWordStyle : {}),
                    opacity: 1,
                    display: "inline-block",
                    marginRight:
                      i !== activePage.tokens.length - 1 ? "0.32em" : undefined,
                  }}
                >
                  {token.text.trim()}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}
