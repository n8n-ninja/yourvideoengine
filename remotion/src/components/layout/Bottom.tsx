// src/layouts/Bottom.tsx
import { ReactNode } from "react"

export const Bottom: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {children}
  </div>
)
