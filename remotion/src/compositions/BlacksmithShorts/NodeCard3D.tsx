import { Img } from "remotion"
import { useTheme } from "@/theme/ThemeContext"

type NodeCard3DProps = {
  logo: string // staticFile path
  node: string
}

export const NodeCard3D: React.FC<NodeCard3DProps> = ({ logo, node }) => {
  const theme = useTheme()

  return (
    <div
      style={{
        width: 290,
        height: 290,
        borderRadius: 24,
        border: "3px solid #611001",
        borderTop: "20px solid #611001",
        background: "linear-gradient(145deg, #3a3a3a, #2a2a2a)",
        boxShadow: `
            inset 0 4px 8px rgba(0,0,0,0.6),
            0 0 30px rgba(255,100,0,0.4),
            0 0 60px rgba(255,150,60,0.2)
          `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Img
        src={logo}
        alt="node"
        style={{
          width: 200,
          height: 200,
          objectFit: "contain",
          filter: "drop-shadow(0 0 6px rgba(255,160,60,0.4))",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -110,
          left: 0,
          right: 0,
          textShadow: theme.glows.medium(theme.colors.glow),
          padding: 4,
          fontSize: theme.fontSizes.md,
          color: "white",
        }}
      >
        {node}
      </div>
    </div>
  )
}
