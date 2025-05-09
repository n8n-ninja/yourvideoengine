import { useCurrentFrame, interpolate, Easing } from "remotion"
import { AnimatedText } from "@animations/AnimatedText"
import * as Layout from "@components/layout"
import { useTheme } from "@theme/ThemeContext"

export const NodeStepLabels: React.FC<{
  stepIndex: number
  appearFrame: number
  pauseDuration: number
  label: string
}> = ({ stepIndex, appearFrame, pauseDuration, label }) => {
  const frame = useCurrentFrame()
  const localFrame = frame - appearFrame
  const theme = useTheme()
  const duration = pauseDuration

  // Bump animation
  const bump = interpolate(localFrame, [0, 10, 20], [0.9, 1.1, 1], {
    easing: Easing.out(Easing.back(1.7)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <>
      <Layout.Top>
        <Layout.Padding>
          <AnimatedText
            timing={{ from: appearFrame, duration }}
            size={164}
            style={{
              textShadow: theme.glows.soft(theme.colors.primary),
              transform: `scale(${bump})`,
            }}
          >
            STEP {stepIndex + 1}
          </AnimatedText>
        </Layout.Padding>
      </Layout.Top>

      <Layout.Bottom>
        <Layout.Padding horizontal={"md"}>
          <AnimatedText
            timing={{ from: appearFrame + 22, duration: duration - 22 }}
            style={{
              textWrap: "balance",

              fontSize: theme.fontSizes.lg,
              textShadow: theme.glows.medium(theme.colors.glow),
            }}
          >
            {label}
          </AnimatedText>
        </Layout.Padding>
      </Layout.Bottom>
    </>
  )
}
