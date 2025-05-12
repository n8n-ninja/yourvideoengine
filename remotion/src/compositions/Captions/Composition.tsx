import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion"
import { z } from "zod"
import { useEffect, useState } from "react"
import { parseMedia } from "@remotion/media-parser"
import React from "react"
import "./fonts.css"
import { createTikTokStyleCaptions } from "@remotion/captions"

// Utilitaire pour parser une string CSS en objet JS
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

export const CaptionsSchema = z.object({
  videoUrl: z.string(),
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(), // seconds
      end: z.number(), // seconds
      confidence: z.number().optional(),
    }),
  ),
  combineTokensWithinMilliseconds: z.number().optional(),
  position: z.number().optional(),
  verticalAlign: z.enum(["center", "top", "bottom"]).optional(),
  fontSize: z.union([z.number(), z.string()]),
  fontFamily: z.string().optional(),
  color: z.string().optional(),
  highlightColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fontWeight: z
    .union([z.number(), z.enum(["light", "regular", "bold", "black"])])
    .optional(),
  animationType: z.enum(["bump", "grow", "lift", "none"]).optional(),
  uppercase: z.boolean().optional(),
  boxStyle: z.union([z.record(z.any()), z.string()]).optional(),
  textStyle: z.union([z.record(z.any()), z.string()]).optional(),
  phraseInAnimation: z
    .enum(["fade", "slide-up", "slide-down", "none"])
    .optional(),
  phraseOutAnimation: z
    .enum(["fade", "slide-up", "slide-down", "none"])
    .optional(),
  animationDuration: z.number().optional(),
})

export const CaptionsComposition: React.FC<z.infer<typeof CaptionsSchema>> = ({
  videoUrl,
  words,
  combineTokensWithinMilliseconds = 1400,
  position = 75,
  verticalAlign = "center",
  fontSize = 55,
  fontFamily = "Montserrat",
  color = "#fff",
  highlightColor = "#F8C734",
  backgroundColor = "rgba(0,0,0,0.4)",
  fontWeight = "black",
  animationType = "none",
  uppercase = false,
  boxStyle,
  textStyle,
  phraseInAnimation,
  phraseOutAnimation,
  animationDuration,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const [meta, setMeta] = useState<{ width: number; height: number } | null>(
    null,
  )
  useEffect(() => {
    let mounted = true
    parseMedia({
      src: videoUrl,
      fields: { dimensions: true },
    }).then((data) => {
      if (mounted && data.dimensions)
        setMeta({
          width: data.dimensions.width,
          height: data.dimensions.height,
        })
    })
    return () => {
      mounted = false
    }
  }, [videoUrl])

  const videoWidth = meta?.width ?? 1080
  const videoHeight = meta?.height ?? 1920

  // Style de la boîte (container)
  let resolvedBoxStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius: 18,
    padding: "1.5em 4em",
    display: "inline-flex",
    letterSpacing: "0.08em",
    flexWrap: "wrap",
    gap: "0em 1.4em",
    lineHeight: 1.4,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
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
    color,
    fontFamily: fontFamily ? `${fontFamily}, sans-serif` : "Arial, sans-serif",
    fontSize,
    fontWeight:
      typeof fontWeight === "number"
        ? fontWeight
        : { light: 300, regular: 500, bold: 700, black: 900 }[fontWeight] ||
          300,
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

  // Positionnement vertical
  const topValue = `${position}%`
  let transformValue = "translateY(-50%)"
  if (verticalAlign === "top") {
    transformValue = "translateY(0%)"
  } else if (verticalAlign === "bottom") {
    transformValue = "translateY(-100%)"
  }

  const containerStyle = {
    position: "absolute" as const,
    top: topValue,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as const,
    transform: transformValue,
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
    combineTokensWithinMilliseconds,
  })

  // Trouve la page active
  const currentMs = currentTime * 1000
  const activePageIndex = pages.findIndex(
    (p) => currentMs >= p.startMs && currentMs < p.startMs + p.durationMs,
  )
  const activePage = pages[activePageIndex]

  // Détermine si au moins un mot est affiché (pour masquer le container si aucun mot)
  let shouldShowContainer = false
  if (activePage) {
    const animDurationMs = (animationDuration || 0.1) * 1000
    const phraseEnd = activePage.startMs + activePage.durationMs
    shouldShowContainer =
      (currentMs >= activePage.startMs && currentMs < phraseEnd) ||
      (!!phraseOutAnimation &&
        currentMs >= phraseEnd &&
        currentMs < phraseEnd + animDurationMs)
  }

  // Animation d'entrée/sortie de la phrase
  const phraseIn = phraseInAnimation || null
  const phraseOut = phraseOutAnimation || null
  const animDuration = animationDuration || 0.1 // secondes

  const phraseStart = activePage?.startMs ?? 0
  const phraseEnd = (activePage?.startMs ?? 0) + (activePage?.durationMs ?? 0)
  const phraseInEnd = phraseStart + animDuration * 1000
  const phraseOutStart = phraseEnd - animDuration * 1000

  let animStyle = {}
  if (activePage) {
    if (phraseIn && phraseIn !== "none" && currentMs < phraseInEnd) {
      // Animation d'entrée
      const progress = Math.max(
        0,
        Math.min(1, (currentMs - phraseStart) / (phraseInEnd - phraseStart)),
      )
      if (phraseIn === "fade") animStyle = { opacity: progress }
      if (phraseIn === "slide-up")
        animStyle = {
          opacity: progress,
          transform: `translateY(${(1 - progress) * 40}px)`,
        }
    } else if (
      phraseOut &&
      phraseOut !== "none" &&
      currentMs > phraseOutStart
    ) {
      // Animation de sortie
      const progress = Math.max(
        0,
        Math.min(
          1,
          1 - (currentMs - phraseOutStart) / (phraseEnd - phraseOutStart),
        ),
      )
      if (phraseOut === "fade") animStyle = { opacity: progress }
      if (phraseOut === "slide-up")
        animStyle = {
          opacity: progress,
          transform: `translateY(-${(1 - progress) * 40}px)`,
        }
      if (phraseOut === "slide-down")
        animStyle = {
          opacity: progress,
          transform: `translateY(${(1 - progress) * 40}px)`,
        }
    }
  }

  // Animation des mots
  const wordTransition =
    resolvedTextStyle.transition ||
    "opacity 0.12s, transform 0.12s cubic-bezier(0.4,0,0.2,1), color 0.12s cubic-bezier(0.4,0,0.2,1)"

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        width: videoWidth,
        height: videoHeight,
      }}
    >
      <Video src={videoUrl} style={{ width: "100%", height: "100%" }} />
      <div style={containerStyle}>
        {activePage && shouldShowContainer && (
          <div style={{ ...resolvedBoxStyle, ...animStyle }}>
            {activePage.tokens.map((token, i) => {
              const isActive =
                currentMs >= token.fromMs && currentMs < token.toMs
              let wordColor = resolvedTextStyle.color || "#fff"
              if (isActive && highlightColor) {
                wordColor = highlightColor
              }
              // Animation "bump" : le mot grossit à l'apparition puis reste à 1 tant qu'il est actif
              let scale = 1
              let translateY = 0
              if (animationType === "bump" && isActive) {
                const highlightStartFrame = Math.floor(
                  (token.fromMs / 1000) * fps,
                )
                if (frame - highlightStartFrame < 6) {
                  scale =
                    0.8 +
                    0.2 *
                      spring({
                        frame: frame - highlightStartFrame,
                        fps,
                        config: { damping: 300, stiffness: 800, mass: 1 },
                        durationInFrames: 6,
                      })
                } else {
                  scale = 1
                }
              } else if (animationType === "grow" && isActive) {
                scale = 1.08
              } else if (animationType === "lift" && isActive) {
                translateY = -12
              }
              // Word by word : n'affiche que le mot actif
              if (combineTokensWithinMilliseconds === 0 && !isActive)
                return null
              // En word by word, on retire l'espace initial
              let word = token.text.trim()
              if (uppercase) word = word.toUpperCase()
              return (
                <span
                  key={`${activePageIndex}-${i}`}
                  style={{
                    ...resolvedTextStyle,
                    color: wordColor,
                    opacity: 1,
                    transition: wordTransition,
                    display: "inline-block",
                    transform: `scale(${scale}) translateY(${translateY}%)`,
                  }}
                >
                  {word}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}
