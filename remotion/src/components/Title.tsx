import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion"
import { z } from "zod"
import React from "react"

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

export const TitlesSchema = z.array(
  z.object({
    title: z.string(),
    time: z.number().optional(),
    duration: z.number().optional(),
    // Animation controls
    titleInDuration: z.number().optional(),
    titleOutDuration: z.number().optional(),
    titleEasing: z.string().optional(),
    // Offsets pour le titre
    titleStartOffset: z.number().optional(), // Décalage relatif pour le début de l'animation du titre
    titleEndOffset: z.number().optional(), // Décalage relatif pour la fin de l'animation du titre
    // Animation lettre par lettre
    letterAnimation: z
      .object({
        preset: z
          .enum(["typewriter", "fade", "slide", "bounce", "random"])
          .optional(),
        staggerDelay: z.number().optional(), // Délai entre chaque lettre en secondes
        duration: z.number().optional(), // Durée d'animation pour chaque lettre
        easing: z.string().optional(), // Easing pour chaque lettre
        // Pour les animations personnalisées
        from: z.record(z.any()).optional(),
        to: z.record(z.any()).optional(),
        direction: z.enum(["ltr", "rtl", "center", "edges"]).optional(), // Direction de l'animation
        animateSpaces: z.boolean().optional(), // Animer aussi les espaces entre les mots
      })
      .optional(),
    animation: z
      .object({
        from: z.record(z.any()),
        to: z.record(z.any()),
        exit: z.record(z.any()).optional(),
        easing: z.string().optional(),
      })
      .optional(),
    // Background box
    backgroundBox: z
      .object({
        enabled: z.boolean().optional(),
        style: z.union([z.record(z.any()), z.string()]).optional(),
        padding: z.number().optional(),
        // Offsets pour la boîte
        startOffset: z.number().optional(), // Décalage relatif pour le début de l'animation de la boîte
        endOffset: z.number().optional(), // Décalage relatif pour la fin de l'animation de la boîte
        animation: z
          .object({
            from: z.record(z.any()),
            to: z.record(z.any()),
            exit: z.record(z.any()).optional(),
            easing: z.string().optional(),
            inDuration: z.number().optional(),
            outDuration: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
    // Positionnement
    top: z.number().optional(),
    left: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    horizontalAlign: z.enum(["start", "center", "end"]).optional(),
    verticalAlign: z.enum(["start", "center", "end"]).optional(),
    // Styles
    titleStyle: z.union([z.record(z.any()), z.string()]).optional(),
  }),
)

type TitleItem = z.infer<typeof TitlesSchema>[number]

type TitleProps = {
  titles: TitleItem[]
}

// Presets for letter animations
const letterAnimationPresets = {
  typewriter: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    staggerDelay: 0.05,
    duration: 0.1,
    easing: "linear",
    direction: "ltr",
    animateSpaces: false,
  },
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    staggerDelay: 0.03,
    duration: 0.3,
    easing: "easeInOut",
    direction: "ltr",
    animateSpaces: true,
  },
  slide: {
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    staggerDelay: 0.04,
    duration: 0.4,
    easing: "easeOut",
    direction: "ltr",
    animateSpaces: true,
  },
  bounce: {
    from: { opacity: 0, translateY: -20, scale: 1.2 },
    to: { opacity: 1, translateY: 0, scale: 1 },
    staggerDelay: 0.05,
    duration: 0.5,
    easing: "easeOutElastic",
    direction: "ltr",
    animateSpaces: true,
  },
  random: {
    from: { opacity: 0, translateY: 30, rotate: -10 },
    to: { opacity: 1, translateY: 0, rotate: 0 },
    staggerDelay: 0.03,
    duration: 0.4,
    easing: "easeOut",
    direction: "ltr",
    animateSpaces: true,
  },
}

function getEasingFn(easingName?: string): (x: number) => number {
  if (!easingName || easingName === "linear") return (x: number) => x
  if (easingName === "easeIn") return (x: number) => x * x
  if (easingName === "easeOut") return (x: number) => 1 - (1 - x) * (1 - x)
  if (easingName === "easeInOut")
    return (x: number) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  if (easingName === "easeOutElastic")
    return (x: number) => {
      const c4 = (2 * Math.PI) / 3
      return x === 0
        ? 0
        : x === 1
          ? 1
          : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
    }
  return (x: number) => x
}

function interpolate(
  from: Record<string, number | string>,
  to: Record<string, number | string>,
  progress: number,
): Record<string, number | string> {
  const out: Record<string, number | string> = {}
  for (const key in from) {
    if (typeof from[key] === "number" && typeof to[key] === "number") {
      out[key] = from[key] + (to[key] - from[key]) * progress
    } else if (typeof from[key] === "string" && typeof to[key] === "string") {
      out[key] = progress < 0.5 ? from[key] : to[key]
    }
  }
  return out
}

function applyAnimationToStyle(
  baseStyle: React.CSSProperties,
  interp: Record<string, number | string>,
): React.CSSProperties {
  const style = { ...baseStyle }

  // Appliquer transformOrigin AVANT de générer la transform pour s'assurer qu'il est pris en compte
  if (interp.transformOrigin !== undefined) {
    style.transformOrigin = interp.transformOrigin as string
  } else if (interp.scaleX !== undefined || interp.scaleY !== undefined) {
    // Par défaut à left center pour le scaleX et center top pour le scaleY
    if (interp.scaleX !== undefined && interp.scaleY === undefined) {
      style.transformOrigin = "left center"
    } else if (interp.scaleY !== undefined && interp.scaleX === undefined) {
      style.transformOrigin = "center top"
    } else {
      style.transformOrigin = "left top"
    }
  }

  if (interp.opacity !== undefined) style.opacity = interp.opacity
  if (interp.backgroundColor !== undefined)
    style.backgroundColor = interp.backgroundColor as string
  if (interp.borderRadius !== undefined)
    style.borderRadius = interp.borderRadius

  // Gestion spéciale pour width et height
  if (interp.width !== undefined) {
    if (typeof interp.width === "number") {
      style.width = `${interp.width}px`
    } else {
      style.width = interp.width
    }
  }

  if (interp.height !== undefined) {
    if (typeof interp.height === "number") {
      style.height = `${interp.height}px`
    } else {
      style.height = interp.height
    }
  }

  // Compose la transform dynamiquement
  const transforms = []

  // Scale (avec support de scaleX/scaleY séparés)
  if (interp.scaleX !== undefined) {
    transforms.push(`scaleX(${interp.scaleX})`)
  }
  if (interp.scaleY !== undefined) {
    transforms.push(`scaleY(${interp.scaleY})`)
  }
  if (
    interp.scale !== undefined &&
    interp.scaleX === undefined &&
    interp.scaleY === undefined
  ) {
    transforms.push(`scale(${interp.scale})`)
  }

  if (interp.translateX !== undefined || interp.translateY !== undefined) {
    const x = interp.translateX ?? 0
    const y = interp.translateY ?? 0
    transforms.push(`translate(${x}px, ${y}px)`)
  }

  if (interp.rotate !== undefined) {
    transforms.push(`rotate(${interp.rotate}deg)`)
  }

  if (interp.skew !== undefined) {
    transforms.push(`skew(${interp.skew}deg)`)
  }

  if (transforms.length > 0) {
    style.transform = transforms.join(" ")
  }

  return style
}

/*
 * Exemple d'utilisation des offsets et transformOrigin:
 *
 * Animation depuis la gauche (par défaut):
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: { scaleX: 0 },
 *       to: { scaleX: 1 }
 *     }
 *   }
 * }
 *
 * Animation depuis la droite:
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: {
 *         scaleX: 0,
 *         transformOrigin: "right center"
 *       },
 *       to: { scaleX: 1 }
 *     }
 *   }
 * }
 *
 * Animation depuis le centre:
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: {
 *         scaleX: 0,
 *         transformOrigin: "center center"
 *       },
 *       to: { scaleX: 1 }
 *     }
 *   }
 * }
 *
 * Animation verticale depuis le haut (par défaut):
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: { scaleY: 0 },
 *       to: { scaleY: 1 }
 *     }
 *   }
 * }
 *
 * Animation verticale depuis le bas:
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: {
 *         scaleY: 0,
 *         transformOrigin: "center bottom"
 *       },
 *       to: { scaleY: 1 }
 *     }
 *   }
 * }
 *
 * Animation avec skew (effet de distorsion):
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: {
 *         scaleX: 0,
 *         skew: 20 // Inclinaison de 20 degrés
 *       },
 *       to: {
 *         scaleX: 1,
 *         skew: 0  // Retour à la normale
 *       }
 *     }
 *   }
 * }
 *
 * Animation avec skewX et skewY séparés:
 * {
 *   backgroundBox: {
 *     animation: {
 *       from: {
 *         skewX: 30, // Inclinaison horizontale
 *         skewY: 15  // Inclinaison verticale
 *       },
 *       to: {
 *         skewX: 0,
 *         skewY: 0
 *       }
 *     }
 *   }
 * }
 *
 * Animation lettre par lettre (presets):
 * {
 *   title: "Apparaît lettre par lettre",
 *   letterAnimation: {
 *     preset: "typewriter" // Choisir parmi: "typewriter", "fade", "slide", "bounce", "random"
 *   }
 * }
 *
 * Animation lettre par lettre avec direction:
 * {
 *   title: "Animation de droite à gauche",
 *   letterAnimation: {
 *     preset: "fade",
 *     direction: "rtl" // right-to-left - Commence par la dernière lettre
 *   }
 * }
 *
 * Animation depuis le centre:
 * {
 *   title: "Animation depuis le centre",
 *   letterAnimation: {
 *     preset: "slide",
 *     direction: "center" // Commence par le milieu du texte et se propage vers les bords
 *   }
 * }
 *
 * Animation depuis les bords:
 * {
 *   title: "Animation depuis les bords",
 *   letterAnimation: {
 *     preset: "bounce",
 *     direction: "edges" // Commence par les première et dernière lettres et se propage vers le milieu
 *   }
 * }
 *
 * Animation avec espaces animés:
 * {
 *   title: "Animation avec espaces",
 *   letterAnimation: {
 *     preset: "slide",
 *     animateSpaces: true // Les espaces entre les mots sont également animés
 *   }
 * }
 *
 * Animation lettre par lettre personnalisée:
 * {
 *   title: "Animation personnalisée",
 *   letterAnimation: {
 *     staggerDelay: 0.06, // 60ms entre chaque lettre
 *     duration: 0.4,      // Chaque lettre s'anime en 400ms
 *     easing: "easeOut",
 *     direction: "rtl",   // De droite à gauche
 *     animateSpaces: true, // Inclure les espaces dans l'animation
 *     from: {
 *       opacity: 0,
 *       scale: 2,
 *       rotate: 45
 *     },
 *     to: {
 *       opacity: 1,
 *       scale: 1,
 *       rotate: 0
 *     }
 *   }
 * }
 *
 * Combinaison d'animations:
 * {
 *   title: "Animations combinées",
 *   // Animation globale du titre
 *   animation: {
 *     from: { translateY: -50 },
 *     to: { translateY: 0 }
 *   },
 *   // Animation lettre par lettre
 *   letterAnimation: {
 *     preset: "fade"
 *   },
 *   // Animation de la boîte
 *   backgroundBox: {
 *     enabled: true,
 *     startOffset: -0.3, // La boîte commence avant le titre
 *     animation: {
 *       from: { scaleX: 0 },
 *       to: { scaleX: 1 }
 *     }
 *   }
 * }
 */

export const Title: React.FC<TitleProps> = ({ titles }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const currentTime = frame / fps

  const videoWidth = width ?? 1080
  const videoHeight = height ?? 1920

  // Trouver le titre actif
  const activeTitle = titles.find((t) => {
    const titleStart = t.time ?? 0
    const titleDuration = t.duration ?? Infinity
    return currentTime >= titleStart && currentTime < titleStart + titleDuration
  })

  if (!activeTitle) return null

  // Positionnement
  const top = activeTitle.top ?? 10
  const left = activeTitle.left ?? 0
  const right = activeTitle.right ?? 0
  const bottom = activeTitle.bottom ?? 0
  const horizontalAlign = activeTitle.horizontalAlign ?? "center"
  const verticalAlign = activeTitle.verticalAlign ?? "center"

  // Style container
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: `${top}%`,
    left: `${left}%`,
    right: `${right}%`,
    bottom: `${bottom}%`,
    display: "flex",
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
    width: "100%",
    height: "100%",
    pointerEvents: "none" as const,
  }

  // Style title
  let resolvedTitleStyle: React.CSSProperties = {
    color: "#fff",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 90,
    fontWeight: 900,
    marginBottom: 12,
    textShadow: "0 2px 30px #000, 0 1px 10px #000",
    lineHeight: 1.1,
  }
  if (activeTitle.titleStyle) {
    if (typeof activeTitle.titleStyle === "string") {
      resolvedTitleStyle = {
        ...resolvedTitleStyle,
        ...parseStyleString(activeTitle.titleStyle),
      }
    } else {
      resolvedTitleStyle = { ...resolvedTitleStyle, ...activeTitle.titleStyle }
    }
  }
  if ("transition" in resolvedTitleStyle) delete resolvedTitleStyle.transition

  // Timing title avec offsets
  const titleStart =
    (activeTitle.time ?? 0) + (activeTitle.titleStartOffset ?? 0)
  const titleDuration = activeTitle.duration ?? Infinity
  const titleEndOffset = activeTitle.titleEndOffset ?? 0
  const titleInDuration = activeTitle.titleInDuration ?? 0
  const titleOutDuration = activeTitle.titleOutDuration ?? 0
  const titleInEnd = titleStart + titleInDuration
  const titleOutStart =
    titleStart + titleDuration + titleEndOffset - titleOutDuration
  const titleAppear =
    currentTime >= titleStart &&
    currentTime < titleStart + titleDuration + titleEndOffset

  let titleAnimProgress = 1
  if (titleInDuration > 0 && currentTime < titleInEnd) {
    titleAnimProgress = Math.min(
      1,
      Math.max(0, (currentTime - titleStart) / titleInDuration),
    )
  } else if (titleOutDuration > 0 && currentTime > titleOutStart) {
    titleAnimProgress = Math.max(
      0,
      1 - (currentTime - titleOutStart) / titleOutDuration,
    )
  }

  // Title animation
  let animatedTitleStyle: React.CSSProperties | undefined = undefined
  if (
    activeTitle.animation &&
    activeTitle.animation.from &&
    activeTitle.animation.to
  ) {
    const easingFn = getEasingFn(activeTitle.animation.easing)
    let interp: Record<string, number | string>
    if (titleInDuration > 0 && currentTime < titleInEnd) {
      // Entrée : from -> to
      const easedProgress = easingFn(titleAnimProgress)
      interp = interpolate(
        activeTitle.animation.from,
        activeTitle.animation.to,
        easedProgress,
      )
    } else if (titleOutDuration > 0 && currentTime > titleOutStart) {
      // Sortie : to -> exit (ou from si pas exit)
      const outProgress = 1 - titleAnimProgress
      const easedProgress = easingFn(outProgress)
      interp = interpolate(
        activeTitle.animation.to,
        activeTitle.animation.exit || activeTitle.animation.from,
        easedProgress,
      )
    } else {
      // Stable : to
      interp = { ...activeTitle.animation.to }
    }
    animatedTitleStyle = applyAnimationToStyle(resolvedTitleStyle, interp)
  }

  // Background box
  const showBackgroundBox = activeTitle.backgroundBox?.enabled ?? false
  let backgroundBoxStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 8,
    padding: activeTitle.backgroundBox?.padding ?? 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Important pour les animations de taille
  }

  if (activeTitle.backgroundBox?.style) {
    if (typeof activeTitle.backgroundBox.style === "string") {
      backgroundBoxStyle = {
        ...backgroundBoxStyle,
        ...parseStyleString(activeTitle.backgroundBox.style),
      }
    } else {
      backgroundBoxStyle = {
        ...backgroundBoxStyle,
        ...activeTitle.backgroundBox.style,
      }
    }
  }

  // Animation de la box avec offsets
  let animatedBoxStyle: React.CSSProperties | undefined = undefined
  let showBox = false

  if (
    showBackgroundBox &&
    activeTitle.backgroundBox?.animation &&
    activeTitle.backgroundBox.animation.from &&
    activeTitle.backgroundBox.animation.to
  ) {
    const boxAnim = activeTitle.backgroundBox.animation
    const boxStartOffset = activeTitle.backgroundBox.startOffset ?? 0
    const boxEndOffset = activeTitle.backgroundBox.endOffset ?? 0
    const boxInDuration = boxAnim.inDuration ?? titleInDuration
    const boxOutDuration = boxAnim.outDuration ?? titleOutDuration

    const baseTime = activeTitle.time ?? 0
    const boxStart = baseTime + boxStartOffset
    const boxInEnd = boxStart + boxInDuration
    const boxEnd = baseTime + titleDuration + boxEndOffset
    const boxOutStart = boxEnd - boxOutDuration

    // Déterminer si la boîte doit être affichée
    showBox = currentTime >= boxStart && currentTime < boxEnd

    let boxAnimProgress = 1
    if (
      boxInDuration > 0 &&
      currentTime < boxInEnd &&
      currentTime >= boxStart
    ) {
      boxAnimProgress = Math.min(
        1,
        Math.max(0, (currentTime - boxStart) / boxInDuration),
      )
    } else if (boxOutDuration > 0 && currentTime > boxOutStart) {
      boxAnimProgress = Math.max(
        0,
        1 - (currentTime - boxOutStart) / boxOutDuration,
      )
    } else if (currentTime < boxStart) {
      boxAnimProgress = 0
    }

    const easingFn = getEasingFn(boxAnim.easing)
    let interp: Record<string, number | string>

    if (
      boxInDuration > 0 &&
      currentTime < boxInEnd &&
      currentTime >= boxStart
    ) {
      // Entrée : from -> to
      const easedProgress = easingFn(boxAnimProgress)
      interp = interpolate(boxAnim.from, boxAnim.to, easedProgress)
    } else if (boxOutDuration > 0 && currentTime > boxOutStart) {
      // Sortie : to -> exit (ou from si pas exit)
      const outProgress = 1 - boxAnimProgress
      const easedProgress = easingFn(outProgress)
      interp = interpolate(
        boxAnim.to,
        boxAnim.exit || boxAnim.from,
        easedProgress,
      )
    } else if (currentTime < boxStart) {
      interp = { ...boxAnim.from }
    } else {
      // Stable : to
      interp = { ...boxAnim.to }
    }

    animatedBoxStyle = applyAnimationToStyle(backgroundBoxStyle, interp)
  }

  // Handle letter animation
  const hasLetterAnimation = !!activeTitle.letterAnimation

  let letterAnimationConfig = null

  if (hasLetterAnimation) {
    const preset = activeTitle.letterAnimation?.preset
    const presetConfig = preset ? letterAnimationPresets[preset] : null

    letterAnimationConfig = {
      staggerDelay:
        activeTitle.letterAnimation?.staggerDelay ??
        presetConfig?.staggerDelay ??
        0.05,
      duration:
        activeTitle.letterAnimation?.duration ?? presetConfig?.duration ?? 0.3,
      easing:
        activeTitle.letterAnimation?.easing ??
        presetConfig?.easing ??
        "easeOut",
      from: activeTitle.letterAnimation?.from ??
        presetConfig?.from ?? { opacity: 0 },
      to: activeTitle.letterAnimation?.to ?? presetConfig?.to ?? { opacity: 1 },
      direction: activeTitle.letterAnimation?.direction ?? "ltr",
      animateSpaces: activeTitle.letterAnimation?.animateSpaces ?? false,
    }
  }

  const renderLetterAnimation = (text: string) => {
    if (!hasLetterAnimation || !letterAnimationConfig) {
      return text
    }

    // Split text into words and then characters
    const words = text.split(/\s+/)

    // Get all characters as flat array for direction calculation
    const allCharacters = Array.from(text.replace(/\s+/g, " "))
    const direction = letterAnimationConfig.direction || "ltr"
    const animateSpaces = letterAnimationConfig.animateSpaces || false
    const totalChars = allCharacters.length
    const middle = Math.floor(totalChars / 2)
    const halfLength = totalChars / 2

    // Function to calculate character index based on animation direction
    const getDelayIndex = (globalIndex: number) => {
      if (direction === "rtl") {
        // Right to left
        return totalChars - 1 - globalIndex
      } else if (direction === "center") {
        // From center outwards
        return Math.abs(middle - globalIndex)
      } else if (direction === "edges") {
        // From edges inwards
        return halfLength - Math.abs(globalIndex - halfLength)
      } else {
        // Left to right (default)
        return globalIndex
      }
    }

    return (
      <div
        style={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
        }}
      >
        {words.map((word, wordIndex) => {
          // Split word into characters
          const characters = Array.from(word)

          // Calculate the word start index for global position
          const wordStartIndex =
            words.slice(0, wordIndex).join(" ").length +
            (wordIndex > 0 ? wordIndex : 0)

          // Create the word element
          const wordElement = (
            <span
              key={`word-${wordIndex}`}
              style={{
                display: "inline-block",
                marginRight: 0,
              }}
            >
              {characters.map((char, charIndex) => {
                // Calculate the global index of this character within the entire text
                const globalIndex = wordStartIndex + charIndex

                // Calculate the delay based on the direction
                const delayIndex = getDelayIndex(globalIndex)
                const delay = letterAnimationConfig.staggerDelay * delayIndex
                const letterDuration = letterAnimationConfig.duration

                // Calculate animation progress for this letter
                let letterProgress = 0
                const letterStart = titleStart + delay
                const letterEnd = letterStart + letterDuration

                if (currentTime >= letterStart && currentTime < letterEnd) {
                  letterProgress = (currentTime - letterStart) / letterDuration
                } else if (currentTime >= letterEnd) {
                  letterProgress = 1
                }

                // Apply easing
                const easingFn = getEasingFn(letterAnimationConfig.easing)
                const easedProgress = easingFn(letterProgress)

                // Interpolate between from and to states
                const interpValues = interpolate(
                  letterAnimationConfig.from,
                  letterAnimationConfig.to,
                  easedProgress,
                )

                // Create style for this letter
                const letterStyle = applyAnimationToStyle(
                  { display: "inline-block" },
                  interpValues,
                )

                return (
                  <span
                    key={`char-${wordIndex}-${charIndex}`}
                    style={letterStyle}
                  >
                    {char}
                  </span>
                )
              })}
            </span>
          )

          // Add space after word if not last word
          if (wordIndex < words.length - 1) {
            // If animating spaces, apply the same animation to the space
            if (animateSpaces) {
              const spaceIndex = wordStartIndex + characters.length
              const delayIndex = getDelayIndex(spaceIndex)
              const delay = letterAnimationConfig.staggerDelay * delayIndex
              const letterDuration = letterAnimationConfig.duration

              let spaceProgress = 0
              const spaceStart = titleStart + delay
              const spaceEnd = spaceStart + letterDuration

              if (currentTime >= spaceStart && currentTime < spaceEnd) {
                spaceProgress = (currentTime - spaceStart) / letterDuration
              } else if (currentTime >= spaceEnd) {
                spaceProgress = 1
              }

              const easingFn = getEasingFn(letterAnimationConfig.easing)
              const easedProgress = easingFn(spaceProgress)

              const interpValues = interpolate(
                letterAnimationConfig.from,
                letterAnimationConfig.to,
                easedProgress,
              )

              const spaceStyle = applyAnimationToStyle(
                { display: "inline-block", marginRight: "0.3em" },
                interpValues,
              )

              return (
                <React.Fragment key={`word-space-${wordIndex}`}>
                  {wordElement}
                  <span style={spaceStyle}>&nbsp;</span>
                </React.Fragment>
              )
            } else {
              // Just add a regular space
              return (
                <React.Fragment key={`word-space-${wordIndex}`}>
                  {wordElement}
                  <span
                    style={{ display: "inline-block", marginRight: "0.3em" }}
                  >
                    &nbsp;
                  </span>
                </React.Fragment>
              )
            }
          }

          return wordElement
        })}
      </div>
    )
  }

  return (
    <AbsoluteFill
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        width: videoWidth,
        height: videoHeight,
      }}
    >
      <div style={containerStyle}>
        {showBackgroundBox && showBox ? (
          <div
            style={{
              ...backgroundBoxStyle,
              ...(animatedBoxStyle ? animatedBoxStyle : {}),
            }}
          >
            {titleAppear && (
              <div
                style={{
                  ...resolvedTitleStyle,
                  ...(animatedTitleStyle ? animatedTitleStyle : {}),
                  opacity: animatedTitleStyle?.opacity ?? titleAnimProgress,
                  margin: 0,
                  whiteSpace: hasLetterAnimation ? "normal" : "nowrap", // Désactive nowrap pour les animations lettre par lettre
                }}
              >
                {hasLetterAnimation
                  ? renderLetterAnimation(activeTitle.title)
                  : activeTitle.title}
              </div>
            )}
          </div>
        ) : titleAppear ? (
          <div
            style={{
              ...resolvedTitleStyle,
              ...(animatedTitleStyle ? animatedTitleStyle : {}),
              opacity: animatedTitleStyle?.opacity ?? titleAnimProgress,
              whiteSpace: hasLetterAnimation ? "normal" : "nowrap",
            }}
          >
            {hasLetterAnimation
              ? renderLetterAnimation(activeTitle.title)
              : activeTitle.title}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  )
}
