import { useEffect, useRef } from "react"

interface BackgroundGlowProps {
  sectionRef: React.RefObject<HTMLElement>
  useCaseMarkerRef: React.RefObject<HTMLDivElement>
  technologyMarkerRef: React.RefObject<HTMLDivElement>
}

export function BackgroundGlow({
  sectionRef,
  useCaseMarkerRef,
  technologyMarkerRef,
}: BackgroundGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current
    const useCaseMarker = useCaseMarkerRef.current
    const technologyMarker = technologyMarkerRef.current

    if (!section || !glow) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Normalized scroll position (0 to 1)
      const scrollProgress = window.scrollY / (documentHeight - windowHeight)

      // Sinusoidal horizontal movement with 3 complete cycles (6π for 3 cycles)
      const horizontalPosition =
        50 + Math.sin(scrollProgress * Math.PI * 6) * 45

      // Update the glow position
      glow.style.top = `${scrollProgress * windowHeight * 0.8}px`
      glow.style.left = `${horizontalPosition}%`

      // Gestion de l'opacité du glow avec transitions en douceur
      let opacity = 0.8

      // Vérifier la position par rapport au marqueur useCaseMarker
      const useCaseMarkerRect = useCaseMarker!.getBoundingClientRect()
      const distanceToUseCaseMarker = useCaseMarkerRect.top - windowHeight

      // Vérifier la position par rapport au marqueur technologyMarker
      const technologyMarkerRect = technologyMarker!.getBoundingClientRect()
      const distanceToTechnologyMarker = technologyMarkerRect.top - windowHeight

      // Transition en douceur - distances de transition (en pixels)
      const fadeDistance = 300

      // Fade out avant useCaseMarker
      if (
        distanceToUseCaseMarker < fadeDistance &&
        distanceToUseCaseMarker > 0
      ) {
        // Transition graduelle de 0.8 à 0
        opacity = 0.8 * (distanceToUseCaseMarker / fadeDistance)
      }
      // Zone où le glow est invisible
      else if (distanceToUseCaseMarker <= 0 && distanceToTechnologyMarker > 0) {
        opacity = 0
      }
      // Fade in après technologyMarker
      else if (
        distanceToTechnologyMarker <= 0 &&
        distanceToTechnologyMarker > -fadeDistance
      ) {
        // Transition graduelle de 0 à 0.8
        const progress = Math.abs(distanceToTechnologyMarker) / fadeDistance
        opacity = 0.8 * Math.min(1, progress)
      }

      glow.style.opacity = opacity.toString()
    }

    // Initial call to set position when component mounts
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sectionRef, useCaseMarkerRef, technologyMarkerRef])

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none max-w-[600px] max-h-[500px] w-[50vw] h-[40vw] rounded-full blur-[120px] bg-gradient-to-r from-pink-500/30 via-purple-500/35 to-blue-500/25 z-0"
      style={{
        opacity: 0.8,
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    />
  )
}
