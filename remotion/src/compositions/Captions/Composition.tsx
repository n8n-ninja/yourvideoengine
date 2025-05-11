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

export const FONT_FAMILIES = [
  "Arial",
  "Arial Black",
  "Montserrat",
  "Poppins",
  "Roboto",
  "Lato",
  "Inter",
  "Open Sans",
  "Bebas Neue",
  "Impact",
  "Anton",
] as const

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
  width: z.number().optional(),
  height: z.number().optional(),
  fontFamily: z.enum(FONT_FAMILIES).optional(),
  color: z.string().optional(),
  colors: z.array(z.string()).optional(),
  fontSize: z.number().optional(),
  backgroundColor: z.string().optional(),
  top: z.number().optional(),
  padding: z.string().optional(),
  borderRadius: z.number().optional(),
  uppercase: z.boolean().optional(),
  fontWeight: z.enum(["light", "regular", "bold", "black"]).optional(),
  textShadow: z.boolean().optional(),
  textShadowColor: z.string().optional(),
  animationType: z.enum(["none", "bump", "grow", "lift"]).optional(),
  highlightColor: z.string().optional(),
  combineTokensWithinMilliseconds: z.number().optional(),
  verticalAlign: z.enum(["top", "center", "bottom"]).optional(),
})

export const CaptionsComposition: React.FC<z.infer<typeof CaptionsSchema>> = ({
  videoUrl,
  words,
  width,
  height,
  fontFamily,
  color,
  colors,
  fontSize,
  backgroundColor,
  top,
  padding,
  borderRadius,
  uppercase,
  fontWeight,
  textShadow,
  textShadowColor,
  animationType = "bump",
  highlightColor,
  combineTokensWithinMilliseconds = 1400,
  verticalAlign = "center",
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

  const videoWidth = width ?? meta?.width ?? 1080
  const videoHeight = height ?? meta?.height ?? 1920

  const containerStyle = {
    position: "absolute" as const,
    top: `${top || 75}%`,
    left: 0,
    width: "100%",
    textAlign: "center" as const,
    transform:
      verticalAlign === "center"
        ? "translateY(-50%)"
        : verticalAlign === "bottom"
          ? "translateY(-100%)"
          : "translateY(0%)",
  }

  const fontFamilyCss = fontFamily
    ? `${fontFamily}, sans-serif`
    : "Arial, sans-serif"

  const defaultStyle = {
    fontFamily: fontFamilyCss,
    color: color,
    fontSize: fontSize || 90,
    backgroundColor: backgroundColor,
    padding: padding || "0.2em 0.6em",
    borderRadius: borderRadius ?? 18,
    textAlign: "center" as const,
    margin: "auto",
    display: "inline-block" as const,
    maxWidth: "80%",
    lineHeight: 1.4,
    textWrap: "balance" as const,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    fontWeight: fontWeight
      ? { light: 300, regular: 500, bold: 700, black: 900 }[fontWeight] || 300
      : 300,
    ...(textShadow
      ? {
          textShadow: `0 2px 13px ${textShadowColor || "rgba(0,0,0,1)"}, 0 1px 8px ${textShadowColor || "rgba(0,0,0,1)"}`,
        }
      : {}),
  }

  // Convert words to TikTok-style captions input
  const captions = words.map((w, i) => ({
    text: (i === 0 ? "" : " ") + w.word, // espace avant chaque mot sauf le premier
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
    shouldShowContainer = activePage.tokens.some(
      (token) => currentMs >= token.fromMs && currentMs < token.toMs,
    )
  }

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
          <div style={defaultStyle}>
            {activePage.tokens.map((token, i) => {
              const isActive =
                currentMs >= token.fromMs && currentMs < token.toMs
              // Couleur du mot :
              // - Mot actif : colors[activePageIndex % colors.length] si défini, sinon highlightColor, sinon #fff
              // - Mot inactif : #fff
              let wordColor = "#fff"
              if (isActive) {
                if (colors && colors.length > 0) {
                  wordColor = colors[activePageIndex % colors.length]
                } else if (highlightColor) {
                  wordColor = highlightColor
                }
              }
              // Animation "bump" : le mot grossit à l'apparition puis reste à 1 tant qu'il est actif
              // On considère le bump uniquement sur les 6 premiers frames du highlight
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
              const word =
                combineTokensWithinMilliseconds === 0
                  ? uppercase
                    ? token.text.trimStart().toUpperCase()
                    : token.text.trimStart()
                  : uppercase
                    ? token.text.toUpperCase()
                    : token.text
              return (
                <span
                  key={`${activePageIndex}-${i}`}
                  style={{
                    opacity: 1,
                    transition:
                      "opacity 0.2s, transform 0.12s cubic-bezier(0.4,0,0.2,1), color 0.12s cubic-bezier(0.4,0,0.2,1)",
                    display: "inline-block",
                    transform: `scale(${scale}) translateY(${translateY}%)`,
                    color: wordColor,
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
