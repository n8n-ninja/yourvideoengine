// src/theme/ThemeProvider.tsx

import React from "react"
import { ThemeContext } from "./ThemeContext"
import type { Theme } from "./types"

export const ThemeProvider: React.FC<{
  theme: Theme
  children: React.ReactNode
}> = ({ theme, children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
