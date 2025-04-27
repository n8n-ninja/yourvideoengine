import { ReactNode } from "react"

interface HighlightBoxProps {
  children: ReactNode
}

export function HighlightBox({ children }: HighlightBoxProps) {
  return (
    <div className="relative bg-gradient-to-br from-pink-900/40 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-pink-700/50 shadow-lg hover:shadow-pink-900/20 transition-all duration-300">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/5 to-purple-600/5 rounded-xl blur-sm"></div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
