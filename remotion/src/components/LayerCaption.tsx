import React from "react"
import { useCurrentFrame, useVideoConfig } from "remotion"
import { createTikTokStyleCaptions } from "@remotion/captions"
import { parseStyleString } from "@/utils/getStyle"
import { CaptionLayerType } from "@/schemas/project"
import {
  captionBoxStyle,
  captionTextStyle,
  captionActiveWordStyle,
} from "@/styles/default-style"

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
  captions: CaptionLayerType
  revealProgress?: number
}> = ({ captions, revealProgress = 1 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Récupération des nouvelles options depuis captions
  const highlightActiveWordBackground =
    !!captions.activeWord?.background?.style ||
    !!captions.activeWord?.background?.padding
  const activeWordBackgroundStyle = captions.activeWord?.background?.style
  const activeWordBackgroundPadding = captions.activeWord?.background?.padding

  // Box (container) style
  const boxStyle = captions.boxStyle ? parseStyleString(captions.boxStyle) : {}
  const resolvedBoxStyle = {
    ...captionBoxStyle,
    ...boxStyle,
    position: "relative" as const, // Pour le background absolu
    display: "inline-block",
  }

  // Text style
  const textStyle = captions.textStyle
    ? parseStyleString(captions.textStyle)
    : {}
  const resolvedTextStyle = {
    ...captionTextStyle,
    ...textStyle,
    position: "relative" as const,
    zIndex: 1,
  }

  // Active word style
  const activeWordStyle = captions.activeWord?.style
    ? parseStyleString(captions.activeWord?.style)
    : {}
  let resolvedActiveWordStyle = {
    ...captionActiveWordStyle,
    ...activeWordStyle,
    position: "relative" as const,
    zIndex: 2,
  }

  // Background style for active word
  const defaultActiveWordBackgroundStyle: React.CSSProperties = {
    background: "rgba(0,0,0,0.7)",
    borderRadius: "0.5em",
    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    position: "absolute" as const,
    zIndex: 0,
    pointerEvents: "none",
  }
  const parsedActiveWordBackgroundStyle: React.CSSProperties =
    typeof activeWordBackgroundStyle === "string"
      ? (parseStyleString(activeWordBackgroundStyle) as React.CSSProperties)
      : activeWordBackgroundStyle || {}
  const resolvedActiveWordBackgroundStyle: React.CSSProperties = {
    ...defaultActiveWordBackgroundStyle,
    ...parsedActiveWordBackgroundStyle,
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

  // --- Mesure du mot actif ---
  const [activeWordRect, setActiveWordRect] = React.useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const wordRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  React.useEffect(() => {
    if (!highlightActiveWordBackground || !activePage) {
      setActiveWordRect(null)
      return
    }
    const idx = activePage.tokens.findIndex(
      (token) => currentMs >= token.fromMs && currentMs < token.toMs,
    )
    if (idx === -1) {
      setActiveWordRect(null)
      return
    }
    const el = wordRefs.current[idx]
    if (el) {
      // Gestion du padding
      const { padX, padY } = getActiveWordPadding()
      setActiveWordRect({
        left: el.offsetLeft - padX,
        top: el.offsetTop - padY,
        width: el.offsetWidth + 2 * padX,
        height: el.offsetHeight + 2 * padY,
      })
    }
  }, [
    activePage,
    currentMs,
    highlightActiveWordBackground,
    activeWordBackgroundPadding,
  ])

  const getActiveWordPadding = () => {
    if (typeof activeWordBackgroundPadding === "number")
      return {
        padX: activeWordBackgroundPadding,
        padY: activeWordBackgroundPadding,
      }
    if (activeWordBackgroundPadding)
      return {
        padX: activeWordBackgroundPadding.x ?? 0,
        padY: activeWordBackgroundPadding.y ?? 0,
      }
    return { padX: 0, padY: 0 }
  }

  // --- Définition des tailles de texte dynamiques ---

  // Tailles en em, centrées sur 1em, amplitude contrôlée

  const fontSizes = [
    captions.dynamicFontSize?.min,
    captions.dynamicFontSize?.moy,
    captions.dynamicFontSize?.max,
  ]

  // Attribution intelligente des tailles de mots pour chaque page
  const getWordSizeMap = (tokens: { text: string }[], pageSeed: number) => {
    const n = tokens.length
    if (!captions.dynamicFontSize) return Array(n).fill(1) // fallback : tout moyen
    if (n === 1) return [2] // un seul mot, il est gros

    // Indices des mots courts et longs
    const shortIdx: number[] = []
    const longIdx: number[] = []
    for (let i = 0; i < n; i++) {
      if (tokens[i].text.trim().length <= 4) shortIdx.push(i)
      else longIdx.push(i)
    }
    // Toujours au moins un mot gros (max) : le plus long, ou un long au hasard
    let maxIdx = 0
    if (longIdx.length > 0) {
      // Prendre le plus long parmi les longs
      maxIdx = longIdx.reduce((a, b) =>
        tokens[a].text.length >= tokens[b].text.length ? a : b,
      )
    } else {
      // Si que des courts, prendre le plus long quand même
      maxIdx = tokens.reduce(
        (a, b, i) => (tokens[a].text.length >= b.text.length ? a : i),
        0,
      )
    }
    // Attribution initiale : tout le monde moyen
    const sizeMap = Array(n).fill(1)
    // Mots courts : min
    shortIdx.forEach((i) => (sizeMap[i] = 0))
    // Mot max : max
    sizeMap[maxIdx] = 2
    // Mélange léger pour dynamisme (sauf le max qui reste max)
    const indices = Array.from({ length: n }, (_, i) => i).filter(
      (i) => i !== maxIdx,
    )
    // Shuffle simple avec seed
    let s = pageSeed
    for (let i = indices.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280
      const j = Math.floor((s / 233280) * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    // Si il y a plusieurs courts, on peut en mettre un en moyen pour éviter que tout soit min
    if (shortIdx.length > 1) {
      sizeMap[shortIdx[indices[0] % shortIdx.length]] = 1
    }
    return sizeMap
  }

  return (
    <div>
      {activePage && (
        <div style={resolvedBoxStyle}>
          {/* Background animé du mot actif */}
          {highlightActiveWordBackground && activeWordRect && (
            <div
              style={{
                ...resolvedActiveWordBackgroundStyle,
                left: activeWordRect.left,
                top: activeWordRect.top,
                width: activeWordRect.width,
                height: activeWordRect.height,
              }}
              aria-hidden="true"
            />
          )}
          {activePage.tokens.map((token, i) => {
            const isActive = currentMs >= token.fromMs && currentMs < token.toMs

            const baseStyle = { ...resolvedTextStyle } as React.CSSProperties
            const activeStyle = isActive
              ? ({ ...resolvedActiveWordStyle } as React.CSSProperties)
              : ({} as React.CSSProperties)

            if (
              baseStyle.transform &&
              activeStyle.transform &&
              typeof baseStyle.transform === "string" &&
              typeof activeStyle.transform === "string"
            ) {
              activeStyle.transform = `${baseStyle.transform} ${activeStyle.transform}`
              delete baseStyle.transform
            }

            let styleWithFontSize = {
              ...baseStyle,
              ...activeStyle,
              position: "relative",
            } as React.CSSProperties
            if (captions.dynamicFontSize) {
              // Attribution intelligente des tailles sur la page
              const sizeMap = getWordSizeMap(
                activePage.tokens,
                activePageIndex + 1,
              )
              const sizeIdx = sizeMap[i]
              const fontSize = fontSizes[sizeIdx]
              styleWithFontSize.fontSize = `${fontSize}em`
            }

            return (
              <span
                key={`${activePageIndex}-${i}`}
                ref={(el) => (wordRefs.current[i] = el)}
                style={styleWithFontSize}
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
