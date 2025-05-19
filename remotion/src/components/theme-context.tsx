import { createContext, useContext } from "react"
import type { Theme } from "@/styles/default-style"

const ThemeContext = createContext<Theme>({})

export const ThemeProvider = ThemeContext.Provider
export const useTheme = () => useContext(ThemeContext)
