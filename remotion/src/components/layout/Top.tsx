// src/layouts/Top.tsx
import { ReactNode } from "react"

export const Top: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
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
