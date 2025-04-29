// src/layouts/Center.tsx
import { ReactNode } from "react"

export const Center: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {children}
  </div>
)
