// src/layouts/Padding.tsx
import { ReactNode } from "react"
import { useTheme } from "@theme/ThemeContext"

type PaddingSize = "none" | "sm" | "md" | "lg" | "xl"

type PaddingProps = {
  children: ReactNode
  horizontal?: PaddingSize
  vertical?: PaddingSize
}

export const Padding: React.FC<PaddingProps> = ({
  children,
  horizontal = "md",
  vertical = "md",
}) => {
  const theme = useTheme()
  const px = theme.spacing[horizontal]
  const py = theme.spacing[vertical]

  return (
    <div
      style={{
        padding: `${py}px ${px}px`,
        width: "100%",
      }}
    >
      {children}
    </div>
  )
}
