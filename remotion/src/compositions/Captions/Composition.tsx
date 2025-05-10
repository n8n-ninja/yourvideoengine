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
  style: z
    .object({
      fontFamily: z.string().optional(),
      color: z.string().optional(),
      fontSize: z.number().optional(),
      backgroundColor: z.string().optional(),
    })
    .optional(),
})

export const CaptionsComposition: React.FC<z.infer<typeof CaptionsSchema>> = ({
  videoUrl,
  words,
  width,
  height,
  style,
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
    top: "75%",
    left: 0,
    width: "100%",
    textAlign: "center" as const,
  }

  const defaultStyle = {
    fontFamily: style?.fontFamily || "Arial Black, Arial, sans-serif",
    color: style?.color || "#fff",
    fontSize: style?.fontSize || 70,
    backgroundColor: style?.backgroundColor || "rgba(0,0,0,0.7)",
    padding: "0.2em 0.6em",
    borderRadius: 18,
    textAlign: "center" as const,
    margin: "auto",
    display: "inline-block" as const,
    maxWidth: "80%",
    lineHeight: 1.4,
    textWrap: "balance" as const,
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
        {words.some((w) => currentTime >= w.start && currentTime < w.end) && (
          <div style={defaultStyle}>
            {words.map((w, i) => {
              const isActive = currentTime >= w.start && currentTime < w.end
              if (!isActive) return null
              const localFrame = frame - Math.floor(w.start * fps)
              const scale = spring({
                frame: localFrame,
                fps,
                config: {
                  damping: 200,
                  stiffness: 300,
                  mass: 1,
                },
                durationInFrames: Math.floor((w.end - w.start) * fps),
              })
              return (
                <span
                  key={i}
                  style={{
                    opacity: 1,
                    fontWeight: "bold",
                    transition: "opacity 0.2s",
                    display: "inline-block",
                    transform: `scale(${scale})`,
                  }}
                >
                  {w.word}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}
