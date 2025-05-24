import { createContext, useContext } from "react"
import type { GlobalTheme } from "@/schemas/theme"

const ThemeContext = createContext<GlobalTheme>({})

export const ThemeProvider = ThemeContext.Provider
export const useTheme = () => useContext(ThemeContext)
