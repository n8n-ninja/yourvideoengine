import React from "react"
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { createTikTokStyleCaptions } from "@remotion/captions"
import { getPosition } from "@/utils/getPosition"
import { parseStyleString } from "@/utils/getStyle"
import { Caption as CaptionType } from "@/schemas"

/**
 * Caption: displays TikTok-style synchronized captions with dynamic styles and active word highlighting.
 *
 * @param captions An object of type CaptionType containing:
 *   - words: Array of word objects with timing and optional confidence.
 *   - position: (optional) Positioning for the caption container.
 *   - boxStyle: (optional) Style for the caption box (object or CSS string).
 *   - textStyle: (optional) Style for the text (object or CSS string).
 *   - activeWordStyle: (optional) Style for the active word (object or CSS string).
 *   - multiColors: (optional) Array of colors for active word cycling.
 *   - combineTokensWithinMilliseconds: (optional) Merge window for tokens (default: 1400ms).
 *
 * @returns An AbsoluteFill with styled captions, or nothing if no active page.
 */
export const Caption: React.FC<{ captions: CaptionType }> = ({ captions }) => {
  // Current frame and video config
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Container positioning style
  const containerStyle = getPosition(captions.position ?? {})

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

  const boxStyle = captions.boxStyle ? parseStyleString(captions.boxStyle) : {}

  resolvedBoxStyle = { ...resolvedBoxStyle, ...boxStyle }

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

  const textStyle = captions.textStyle
    ? parseStyleString(captions.textStyle)
    : {}
  resolvedTextStyle = { ...resolvedTextStyle, ...textStyle }

  // Active word style
  let resolvedActiveWordStyle: React.CSSProperties = {
    color: "#F7C500",
    textShadow: "0 2px 30px #000, 0 1px 10px #000",
    fontWeight: 900,
  }

  const activeWordStyle = captions.activeWordStyle
    ? parseStyleString(captions.activeWordStyle)
    : {}

  resolvedActiveWordStyle = { ...resolvedActiveWordStyle, ...activeWordStyle }

  // Map words to TikTok caption objects
  const tiktokCaptions = captions.words.map((w) => ({
    text: " " + w.word,
    startMs: Math.round(w.start * 1000),
    endMs: Math.round(w.end * 1000),
    timestampMs: Math.round(((w.start + w.end) / 2) * 1000),
    confidence: 1,
  }))

  // Split into TikTok-style pages
  const { pages } = createTikTokStyleCaptions({
    captions: tiktokCaptions,
    combineTokensWithinMilliseconds:
      captions.combineTokensWithinMilliseconds ?? 1400,
  })

  // Find the active page
  const currentMs = currentTime * 1000
  const activePageIndex = pages.findIndex(
    (p) => currentMs >= p.startMs && currentMs < p.startMs + p.durationMs,
  )
  const activePage = pages[activePageIndex]

  // Override active word color if multiColors is provided
  if (
    captions.multiColors &&
    captions.multiColors.length > 0 &&
    activePageIndex >= 0
  ) {
    resolvedActiveWordStyle = {
      ...resolvedActiveWordStyle,
      color:
        captions.multiColors[activePageIndex % captions.multiColors.length],
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
