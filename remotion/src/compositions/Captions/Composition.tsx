import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import { parseSrt, createTikTokStyleCaptions } from "@remotion/captions"
import { useMemo, useEffect, useState } from "react"
import { parseMedia } from "@remotion/media-parser"
import React from "react"
import { spring } from "remotion"

export const CaptionsSchema = z.object({
  videoUrl: z.string(),
  srt: z.string(),
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
  srt,
  width,
  height,
  style,
}) => {
  const { captions } = useMemo(() => parseSrt({ input: srt.trim() }), [srt])
  // Convert each caption to word-level tokens with duration proportional to word length and track captionIndex
  const wordLevelCaptions = useMemo(() => {
    let isFirstCaption = true
    return captions.flatMap((cap, captionIndex) => {
      const words = cap.text.trim().split(/\s+/)
      const totalChars = words.reduce((sum, w) => sum + w.length, 0)
      let acc = cap.startMs
      return words.map((word, i) => {
        const wordDuration =
          ((cap.endMs - cap.startMs) * word.length) / totalChars
        const wordStart = acc
        const wordEnd = acc + wordDuration
        acc = wordEnd
        // Prepend '\n' to the first word of each caption except the very first caption overall
        const text = (i === 0 ? (isFirstCaption ? "" : "\n") : " ") + word
        if (i === 0) isFirstCaption = false
        return {
          text,
          startMs: wordStart,
          endMs: wordEnd,
          timestampMs: null,
          confidence: null,
          captionIndex,
        }
      })
    })
  }, [captions])

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: wordLevelCaptions,
        combineTokensWithinMilliseconds: 0, // strict word-by-word
      }),
    [wordLevelCaptions],
  )
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTimeMs = (frame / fps) * 1000

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
    top: "50%",
    left: 0,
    width: "100%",
    textAlign: "center",
  }

  const defaultStyle = {
    fontFamily: style?.fontFamily || "Arial Black, Arial, sans-serif",
    color: style?.color || "#fff",
    fontSize: style?.fontSize || 70,
    backgroundColor: style?.backgroundColor || "rgba(0,0,0,0.7)",
    padding: "0.2em 0.6em",
    borderRadius: 18,
    textAlign: "center",
    margin: "auto",
    display: "inline-block",
    maxWidth: "80%",
    lineHeight: 1.4,

    textWrap: "balance",
  }

  const currentPage = pages.find(
    (page) =>
      currentTimeMs >= page.startMs &&
      currentTimeMs < page.startMs + page.durationMs,
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        width: videoWidth,
        height: videoHeight,
      }}
    >
      <Video src={videoUrl} style={{ width: "100%", height: "100%" }} />
      {currentPage && (
        <div style={containerStyle}>
          <div style={defaultStyle}>
            {wordLevelCaptions.map((token, i) => {
              const isActive =
                currentTimeMs >= token.startMs && currentTimeMs < token.endMs
              const localFrame =
                frame - Math.floor((token.startMs / 1000) * fps)
              const scale = spring({
                frame: localFrame,
                fps,
                config: {
                  damping: 200,
                  stiffness: 300,
                  mass: 1,
                },
                durationInFrames: Math.floor(
                  ((token.endMs - token.startMs) / 1000) * fps,
                ),
              })
              return isActive ? (
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
                  {token.text}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}
