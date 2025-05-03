import { cn } from "~/lib/utils"

interface GlowyTitleProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-4xl md:text-6xl",
}

export function GlowyTitle({
  children,
  className,
  size = "lg",
}: GlowyTitleProps) {
  return (
    <h1
      className={cn(
        "relative font-bold mb-8 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]",
        sizeClasses[size],
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white via-pink-300 to-white bg-clip-text text-transparent blur-[0.5px]">
        {children}
      </span>
      <span className="relative bg-gradient-to-br from-white via-purple-300 to-pink-200 bg-clip-text text-transparent">
        {children}
      </span>
    </h1>
  )
}
