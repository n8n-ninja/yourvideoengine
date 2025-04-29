import { useCurrentFrame, interpolate } from "remotion"
import { useTheme } from "@theme/ThemeContext"
import { AnimatedWrapper } from "@animations/AnimatedWrapper"
import type { TimingConfig } from "@utils/useTimedVisibility"

type BadgeNumberProps = {
  number: number
  timing?: TimingConfig
  size?: number
}

export const BadgeNumber: React.FC<BadgeNumberProps> = ({
  number,
  timing,
  size = 220,
}) => {
  const frame = useCurrentFrame()
  const theme = useTheme()
  const appearAt = timing?.from ?? 0

  const opacity = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const rotation = interpolate(frame, [0, 150], [0, 360], {
    extrapolateRight: "extend",
  })

  const hexSize = size
  const center = hexSize / 2
  const radius = hexSize / 2 - 8

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return `${x},${y}`
  }).join(" ")

  return (
    <AnimatedWrapper timing={timing}>
      <div
        style={{
          width: hexSize,
          height: hexSize,
          position: "relative",
          opacity,
        }}
      >
        <svg
          viewBox={`0 0 ${hexSize} ${hexSize}`}
          width={hexSize}
          height={hexSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "50% 50%",
          }}
        >
          <defs>
            <filter id="glow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="10"
                floodColor={theme.colors.primary}
                floodOpacity="10.8"
              />
            </filter>
          </defs>

          <polygon
            points={points}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={6}
            filter="url(#glow)"
          />
        </svg>

        {/* Numéro au centre */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.4,
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontFamily: theme.fonts.title,
            color: theme.colors.text,
            textShadow: theme.glows.intense(theme.colors.glow),
          }}
        >
          #{number}
        </div>
      </div>
    </AnimatedWrapper>
  )
}
