import React from "react"
import { useCurrentFrame, useVideoConfig } from "remotion"
import { createTikTokStyleCaptions } from "@remotion/captions"
import { parseStyleString } from "@/utils/getStyle"
import { Caption as CaptionType } from "@/schemas"
import {
  captionBoxStyle,
  captionTextStyle,
  captionActiveWordStyle,
} from "@/styles/default-style"
import { useTheme } from "../contexts/ThemeContext"

/**
 * Caption: displays TikTok-style synchronized captions with dynamic styles and active word highlighting.
 *
 * @param captions An object of type CaptionType containing:
 *   - words: Array of word objects with timing and optional confidence.
 *   - boxStyle: (optional) Style for the caption box (object or CSS string).
 *   - textStyle: (optional) Style for the text (object or CSS string).
 *   - activeWordStyle: (optional) Style for the active word (object or CSS string).
 *   - multiColors: (optional) Array of colors for active word cycling.
 *   - combineTokensWithinMilliseconds: (optional) Merge window for tokens (default: 1400ms).
 *
 * @returns An AbsoluteFill with styled captions, or nothing if no active page.
 */
export const Caption: React.FC<{
  captions: CaptionType
  revealProgress?: number
}> = ({ captions, revealProgress = 1 }) => {
  const theme = useTheme()
  // Current frame and video config
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Box (container) style
  const boxStyle = captions.boxStyle ? parseStyleString(captions.boxStyle) : {}
  const resolvedBoxStyle = {
    ...captionBoxStyle,
    ...theme.caption?.boxStyle,
    ...boxStyle,
  }

  // Text style
  const textStyle = captions.textStyle
    ? parseStyleString(captions.textStyle)
    : {}
  const resolvedTextStyle = {
    ...captionTextStyle,
    ...theme.caption?.textStyle,
    ...textStyle,
  }

  // Active word style
  const activeWordStyle = captions.activeWordStyle
    ? parseStyleString(captions.activeWordStyle)
    : {}
  let resolvedActiveWordStyle = {
    ...captionActiveWordStyle,
    ...theme.caption?.activeWordStyle,
    ...activeWordStyle,
  }

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
    <div>
      {activePage && (
        <div style={resolvedBoxStyle}>
          {activePage.tokens.map((token, i) => {
            const isActive = currentMs >= token.fromMs && currentMs < token.toMs

            const baseStyle = { ...resolvedTextStyle }
            const activeStyle = isActive ? { ...resolvedActiveWordStyle } : {}

            if (baseStyle.transform && activeStyle.transform) {
              activeStyle.transform = `${baseStyle.transform} ${activeStyle.transform}`
              delete baseStyle.transform
            }

            return (
              <span
                key={`${activePageIndex}-${i}`}
                style={{
                  ...baseStyle,
                  ...activeStyle,
                }}
              >
                {token.text}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
