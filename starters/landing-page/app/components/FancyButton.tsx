import * as React from "react"
import { cn } from "~/lib/utils"

export interface FancyButtonProps {
  href?: string
  className?: string
  children: React.ReactNode
}

export function FancyButton({
  className,
  href,
  children,
  ...props
}: FancyButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonClass = cn(
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-medium transition-all duration-300 text-white bg-purple-950 border-2 border-pink-500 px-12 py-4 uppercase tracking-wider hover:bg-purple-900 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    "text-sm md:text-base", // Smaller text on mobile, gradually increasing
    "px-6 md:px-8 lg:px-12", // Smaller padding on mobile
    className
  )

  const content = (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )

  return (
    <div className="relative group">
      {/* Outer glow effect */}
      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:blur-xl"></div>

      {/* Inner glow effect */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 opacity-90 blur-sm transition-all duration-300 group-hover:opacity-100"></div>

      {/* Main button content */}
      {href ? (
        <a href={href} className="relative block">
          {content}
        </a>
      ) : (
        <div className="relative">{content}</div>
      )}
    </div>
  )
}
