// theme/types.ts
export type Theme = {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    muted: string
    glow: string
  }
  spacing: {
    none: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  fontSizes: {
    sm: number
    md: number
    lg: number
    xl: number
  }
  lineHeights: {
    tight: number
    normal: number
    relaxed: number
  }
  fonts: {
    title: string
    body: string
  }
  radii: {
    sm: number
    md: number
    lg: number
    full: number
  }
  shadows: {
    glow: string
    soft: string
  }
  glows: {
    soft: (color: string) => string
    medium: (color: string) => string
    intense: (color: string) => string
  }
}
