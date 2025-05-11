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
  }

  const fontFamilyCss = fontFamily
    ? `${fontFamily}, sans-serif`
    : "Arial, sans-serif"

  const offset = 0.06

  const defaultStyle = {
    fontFamily: fontFamilyCss,
    color: color || "#fff",
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
    fontWeight: fontWeight
      ? { light: 300, regular: 500, bold: 700, black: 900 }[fontWeight] || 300
      : 300,
    ...(textShadow
      ? { textShadow: "0 2px 13px rgba(0,0,0,1), 0 1px 8px rgba(0,0,0,1)" }
      : {}),
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
        {words.some(
          (w) =>
            currentTime >= w.start - offset && currentTime < w.end - offset,
        ) && (
          <div style={defaultStyle}>
            {words.map((w, i) => {
              const isActive =
                currentTime >= w.start - offset && currentTime < w.end - offset
              if (!isActive) return null
              const localFrame = frame - Math.floor((w.start - offset) * fps)
              const scale =
                0.8 +
                0.2 *
                  spring({
                    frame: localFrame,
                    fps,
                    config: {
                      damping: 300,
                      stiffness: 800,
                      mass: 1,
                    },
                    durationInFrames: 6,
                  })
              const wordColor =
                colors && colors.length > 0
                  ? colors[i % colors.length]
                  : color || "#fff"
              return (
                <span
                  key={i}
                  style={{
                    opacity: 1,

                    transition: "opacity 0.2s",
                    display: "inline-block",
                    transform: `scale(${scale})`,
                    color: wordColor,
                  }}
                >
                  {uppercase ? w.word.toUpperCase() : w.word}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}
