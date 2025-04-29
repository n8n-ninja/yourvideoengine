import React from "react"
import { TimingConfig, useTimedVisibility } from "@utils/useTimedVisibility"

type AnimatedWrapperProps = {
  timing?: TimingConfig
  style?: React.CSSProperties
  className?: string
  children: React.ReactNode
}

/**
 * Wrapper générique pour gérer l'apparition/disparition avec fade
 */
export const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  timing,
  style = {},
  className,
  children,
}) => {
  const { opacity } = useTimedVisibility(timing)

  return (
    <div
      className={className}
      style={{
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
