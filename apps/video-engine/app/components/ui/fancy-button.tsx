import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const fancyButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium transition-all duration-300 text-white bg-purple-950 border-2 border-pink-500 px-12 py-4 uppercase tracking-wider focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-purple-900",
        secondary: "bg-secondary hover:bg-secondary/80",
        outline: "border-2 border-pink-500 bg-transparent hover:bg-purple-950",
        ghost: "bg-transparent hover:bg-purple-950",
        link: "text-purple-400 underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-14 px-12",
        sm: "h-10 rounded-full px-6 text-xs",
        lg: "h-16 rounded-full px-14 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface FancyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fancyButtonVariants> {
  asChild?: boolean
  href?: string
  children: React.ReactNode
}

export function FancyButton({
  className,
  variant,
  size,
  asChild = false,
  href,
  children,
  ...props
}: FancyButtonProps) {
  const Comp = asChild ? Slot : "button"

  const content = (
    <Comp
      className={cn(fancyButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
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

export function PulsingFancyButton(props: FancyButtonProps) {
  return (
    <FancyButton {...props} className={cn("animate-pulse", props.className)} />
  )
}
