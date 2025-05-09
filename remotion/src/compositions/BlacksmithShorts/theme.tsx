// projects/blacksmithshort/theme.ts

import { loadFont as loadBodyFont } from "@remotion/google-fonts/Anton"
import { loadFont as loadTitleFont } from "@remotion/google-fonts/CormorantGaramond"
import { Theme } from "@theme/types"

const title = loadTitleFont()
const body = loadBodyFont()

export const theme: Theme = {
  colors: {
    primary: "#FFD700",
    secondary: "#FF4500",
    background: "#000000",
    text: "#ffffff",
    muted: "#888888",
    glow: "#E36524",
  },
  spacing: {
    none: 0,
    sm: 24,
    md: 64,
    lg: 128,
    xl: 256,
  },
  fontSizes: {
    sm: 32,
    md: 64,
    lg: 80,
    xl: 188,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.8,
  },
  fonts: {
    title: title.fontFamily,
    body: body.fontFamily,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  shadows: {
    glow: "0 0 30px #FFD700",
    soft: "0 4px 10px rgba(0,0,0,0.4)",
  },
  glows: {
    soft: (color: string) => `
        0 0 4px ${color},
        0 0 8px ${color}
      `,
    medium: (color: string) => `
        0 0 8px ${color},
        0 0 16px ${color},
        0 0 24px ${color}
      `,
    intense: (color: string) => `
        0 0 15px ${color},
        0 0 30px ${color},
        0 0 45px ${color},
        0 0 60px ${color}
      `,
  },
}
