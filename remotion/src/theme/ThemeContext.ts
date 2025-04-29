// theme/ThemeContext.ts

import { createContext, useContext } from "react"
import type { Theme } from "./types"

export const ThemeContext = createContext<Theme | null>(null)

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  if (!theme)
    throw new Error("useTheme must be used inside a <ThemeContext.Provider>")
  return theme
}
