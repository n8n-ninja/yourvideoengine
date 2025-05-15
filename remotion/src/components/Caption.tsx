import React from "react"
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import { createTikTokStyleCaptions } from "@remotion/captions"
import { usePosition } from "@/Utils/usePosition"
import { parseStyleString } from "@/Utils/useStyle"
import { PositionSchema } from "@/Utils/usePosition"

// Default style for the active word
const defaultActiveWordStyle: React.CSSProperties = {
  zIndex: 100,
  position: "relative",
}

/**
 * CaptionSchema: zod schema for caption props validation.
 */
export const CaptionSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      start: z.number(),
      end: z.number(),
      confidence: z.number().optional(),
    }),
  ),
  position: PositionSchema.optional(),
  boxStyle: z.union([z.record(z.any()), z.string()]).optional(),
  textStyle: z.union([z.record(z.any()), z.string()]).optional(),
  activeWordStyle: z.union([z.record(z.any()), z.string()]).optional(),
  multiColors: z.array(z.string()).optional(),
  combineTokensWithinMilliseconds: z.number().optional(),
})

/**
 * Caption component: displays TikTok-style synchronized captions with dynamic styles.
 */
export const Caption: React.FC<z.infer<typeof CaptionSchema>> = ({
  words,
  position,
  boxStyle,
  textStyle,
  activeWordStyle,
  multiColors,
  combineTokensWithinMilliseconds = 1400,
}) => {
  // Current frame and video config
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Container positioning style
  const containerStyle = usePosition(position ?? {})

  // Box (container) style
  let resolvedBoxStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 18,
    padding: "1.5em 4em",
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

  // Text style
  let resolvedTextStyle: React.CSSProperties = {
    color: "#fff",
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

  // Active word style
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

  // Map words to TikTok caption objects
  const captions = words.map((w) => ({
    text: " " + w.word,
    startMs: Math.round(w.start * 1000),
    endMs: Math.round(w.end * 1000),
    timestampMs: Math.round(((w.start + w.end) / 2) * 1000),
    confidence: w.confidence ?? null,
  }))

  // Split into TikTok-style pages
  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds,
  })

  // Find the active page
  const currentMs = currentTime * 1000
  const activePageIndex = pages.findIndex(
    (p) => currentMs >= p.startMs && currentMs < p.startMs + p.durationMs,
  )
  const activePage = pages[activePageIndex]

  // Override active word color if multiColors is provided
  if (multiColors && multiColors.length > 0 && activePageIndex >= 0) {
    resolvedActiveWordStyle = {
      ...resolvedActiveWordStyle,
      color: multiColors[activePageIndex % multiColors.length],
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={containerStyle}>
        {activePage && (
          <div style={resolvedBoxStyle}>
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
