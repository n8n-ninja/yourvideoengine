import React from "react"
import { useTheme } from "@theme/ThemeContext"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import { TimingConfig } from "@utils/useTimedVisibility"

type GlowLevel = "soft" | "medium" | "intense"

export type AnimatedTextProps = {
  children: React.ReactNode
  timing?: TimingConfig
  size?: number
  style?: React.CSSProperties
  className?: string
  fontFamily?: string
  color?: string
  withGlow?: boolean | GlowLevel
  glowColor?: string
  opacity?: number
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  timing,
  size,
  fontFamily,
  style,
  className,
  color,
  opacity,
  withGlow,
  glowColor,
}) => {
  const theme = useTheme()

  const resolvedGlowLevel: GlowLevel =
    typeof withGlow === "string" ? withGlow : "medium"

  const textShadow = withGlow
    ? theme.glows[resolvedGlowLevel](glowColor ?? theme.colors.glow)
    : undefined

  return (
    <AnimatedWrapper timing={timing}>
      <div
        className={className}
        style={{
          fontFamily: fontFamily ?? theme.fonts.body,
          fontSize: size ?? theme.fontSizes.lg,
          color: color ?? theme.colors.text,
          textAlign: "center",
          textShadow,
          textWrap: "balance",

          lineHeight: theme.lineHeights.normal,
          whiteSpace: "pre-line",
          opacity: opacity ?? 1,
          ...style,
        }}
      >
        {children}
      </div>
    </AnimatedWrapper>
  )
}
