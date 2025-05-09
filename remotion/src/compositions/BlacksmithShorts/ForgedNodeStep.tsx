import { useCurrentFrame, interpolate, Easing } from "remotion"
import { NodeCard3D } from "./NodeCard3D"

export const ForgedNodeStep: React.FC<{
  x: number
  y: number
  logo: string
  node: string
  appearFrame: number
}> = ({ x, y, logo, node, appearFrame }) => {
  const frame = useCurrentFrame()
  const localFrame = frame - appearFrame

  if (localFrame < 0) return null

  // --- Node bump ---
  const bump = interpolate(localFrame, [0, 10, 26], [0, 1.12, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const opacity = interpolate(localFrame, [0, 4, 10], [0, 0.6, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // --- Shadow dynamics ---
  const shadowScale = interpolate(localFrame, [0, 8, 20], [0.3, 1.1, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const shadowBlur = interpolate(localFrame, [0, 8, 20], [8, 3, 6], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const shadowOpacity = interpolate(localFrame, [0, 8, 20], [0, 0.35, 0.2], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 290,
        height: 290,
        transform: `
          translate(-50%, -50%)
          scale(${bump})
        `,
        transformOrigin: "center",
        opacity,
        pointerEvents: "none",
        boxShadow: "0 12px 16px rgba(0, 0, 0, 0.4)",
        filter: "drop-shadow(0 0 12px rgba(255, 80, 0, 0.4))",
      }}
    >
      {/* Ombre "animée" */}
      <div
        style={{
          position: "absolute",
          left: 145,
          top: 300,
          width: 290,
          height: 40,
          backgroundColor: "rgba(0, 0, 0, 1)",
          borderRadius: "50%",
          transform: `translate(-50%, 0) scale(${shadowScale})`,
          filter: `blur(${shadowBlur}px)`,
          opacity: shadowOpacity,
          pointerEvents: "none",
        }}
      />
      <NodeCard3D logo={logo} node={node} />
    </div>
  )
}
