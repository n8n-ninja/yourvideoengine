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
  textOutline: z
    .object({
      color: z.string().optional(),
      width: z.number().optional(),
      shadowColor: z.string().optional(),
      shadowSpread: z.number().optional(),
      shadowBlur: z.number().optional(),
    })
    .optional(),
  animationType: z.enum(["none", "bump", "grow", "lift"]).optional(),
  highlightColor: z.string().optional(),
  combineTokensWithinMilliseconds: z.number().optional(),
  verticalAlign: z.enum(["top", "center", "bottom"]).optional(),
  phraseInAnimation: z.string().optional(),
  phraseOutAnimation: z.string().optional(),
  phraseAnimationDuration: z.number().optional(),
  letterSpacing: z.string().optional(),
  lineSpacing: z.string().optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
  backgroundGradient: z.string().optional(),
  backgroundBlur: z.string().optional(),
  boxBorderColor: z.string().optional(),
  boxBorderWidth: z.string().optional(),
  boxShadow: z.string().optional(),
  transitionDuration: z.string().optional(),
  transitionEasing: z.string().optional(),
  margin: z.string().optional(),
  boxWidth: z.string().optional(),
  fullWidth: z.boolean().optional(),
  boxHeight: z.union([z.string(), z.number()]).optional(),
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
  textOutline,
  animationType = "bump",
  highlightColor,
  combineTokensWithinMilliseconds = 1400,
  verticalAlign = "center",
  phraseInAnimation,
  phraseOutAnimation,
  phraseAnimationDuration,
  letterSpacing,
  lineSpacing,
  textAlign,
  backgroundGradient,
  backgroundBlur,
  boxBorderColor,
  boxBorderWidth,
  boxShadow,
  transitionDuration,
  transitionEasing,
  margin,
  boxWidth,
  fullWidth,
  boxHeight,
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

  const defaultStyle = {
    fontFamily: fontFamily ? `${fontFamily}, sans-serif` : "Arial, sans-serif",
    color: color,
    fontSize: fontSize || 90,
    backgroundColor: backgroundColor,
    padding: padding || "0.2em 0.6em",
    borderRadius: borderRadius ?? 18,
    display: "inline-flex",
    flexWrap: "wrap" as const,
    gap: "0em 0.4em",
    width: fullWidth ? "100%" : boxWidth || undefined,
    maxWidth: fullWidth ? undefined : boxWidth ? undefined : "auto",
    lineHeight: lineSpacing || 1.4,
    textWrap: "balance" as const,
    wordBreak: "break-word" as const,
    whiteSpace: "pre-wrap" as const,
    justifyContent: textAlign || "center",
    textAlign: textAlign || "center",
    fontWeight: fontWeight
      ? { light: 300, regular: 500, bold: 700, black: 900 }[fontWeight] || 300
      : 300,
    ...(() => {
      if (!textOutline) return {}
      const outlineColor = textOutline.color || "#000"
      const outlineWidth = textOutline.width ?? 2
      // Contour net (stroke)
      const outlineShadows = [
        `${outlineWidth}px 0 ${outlineColor}`,
        `0 ${outlineWidth}px ${outlineColor}`,
        `-${outlineWidth}px 0 ${outlineColor}`,
        `0 -${outlineWidth}px ${outlineColor}`,
      ]
      // Ombre portée
      let shadow = ""
      if (textOutline.shadowColor) {
        const spread = textOutline.shadowSpread ?? 2
        const blur = textOutline.shadowBlur ?? 8
        shadow = `0 2px ${blur}px ${textOutline.shadowColor}, 0 1px ${spread}px ${textOutline.shadowColor}`
      }
      return {
        textShadow: [...outlineShadows, shadow].filter(Boolean).join(", "),
      }
    })(),

    ...(letterSpacing ? { letterSpacing } : {}),
    ...(backgroundGradient ? { background: backgroundGradient } : {}),
    ...(backgroundBlur ? { backdropFilter: `blur(${backgroundBlur})` } : {}),
    ...(boxBorderColor
      ? { borderColor: boxBorderColor, borderStyle: "solid" }
      : {}),
    ...(boxBorderWidth ? { borderWidth: boxBorderWidth } : {}),
    ...(boxShadow ? { boxShadow } : {}),
    ...(margin ? { margin } : {}),
    ...(boxHeight
      ? {
          height: boxHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column" as const,
        }
      : {}),
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
    const animDurationMs = (phraseAnimationDuration || 0.1) * 1000
    const phraseEnd = activePage.startMs + activePage.durationMs
    // Affiche la boîte tant que la phrase n'est pas terminée OU tant que l'animation de sortie n'est pas terminée
    shouldShowContainer =
      (currentMs >= activePage.startMs && currentMs < phraseEnd) ||
      (!!phraseOutAnimation &&
        currentMs >= phraseEnd &&
        currentMs < phraseEnd + animDurationMs)
  }

  // Ajout styles avancés sur le container
  const containerStyle = {
    position: "absolute" as const,
    top: `${top || 75}%`,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: textAlign || ("center" as const),
    transform:
      verticalAlign === "center"
        ? "translateY(-50%)"
        : verticalAlign === "bottom"
          ? "translateY(-100%)"
          : "translateY(0%)",
  }

  // Animation d'entrée/sortie de la phrase
  const phraseIn = phraseInAnimation || null
  const phraseOut = phraseOutAnimation || null
  const animDuration = phraseAnimationDuration || 0.1 // secondes

  const phraseStart = activePage?.startMs ?? 0
  const phraseEnd = (activePage?.startMs ?? 0) + (activePage?.durationMs ?? 0)
  const phraseInEnd = phraseStart + animDuration * 1000
  const phraseOutStart = phraseEnd - animDuration * 1000

  let animStyle = {}
  if (activePage) {
    if (phraseIn && currentMs < phraseInEnd) {
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
    } else if (phraseOut && currentMs > phraseOutStart) {
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

  // Définir la transition personnalisée pour les mots
  const transitionDurationValue = transitionDuration || "0.12s"
  const transitionEasingValue = transitionEasing || "cubic-bezier(0.4,0,0.2,1)"
  const wordTransition = `opacity ${transitionDurationValue}, transform ${transitionDurationValue} ${transitionEasingValue}, color ${transitionDurationValue} ${transitionEasingValue}`

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
          <div style={{ ...defaultStyle, ...animStyle }}>
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
                    ? token.text.trim().toUpperCase()
                    : token.text.trim()
                  : uppercase
                    ? token.text.trim().toUpperCase()
                    : token.text.trim()
              return (
                <span
                  key={`${activePageIndex}-${i}`}
                  style={{
                    opacity: 1,
                    transition: wordTransition,
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
