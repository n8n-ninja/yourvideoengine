import { FancyButton } from "~/components/ui/fancy-button"
import { useEffect, useRef } from "react"

interface FinalCTAProps {
  title?: string
  ctaText?: string
  ctaHref?: string
}

export function FinalCTA({
  title = "Let's create your next video",
  ctaText = "Book a call",
  ctaHref = "/contact",
}: FinalCTAProps) {
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const borderElement = borderRef.current
    if (!borderElement) return

    // Add a subtle animation to the glow effect
    const animateGlow = () => {
      const intensity = 0.7 + Math.sin(Date.now() / 1000) * 0.3
      borderElement.style.filter = `blur(4px) brightness(${intensity})`
      requestAnimationFrame(animateGlow)
    }

    animateGlow()
  }, [])

  return (
    <section className="relative w-full pt-40 pb-72 bg-transparent overflow-hidden">
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 text-center z-10">
        <div
          className="h-[1px] w-[50%] mx-auto mb-16 relative"
          style={{
            background:
              "linear-gradient(90deg, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 1) 20%, rgba(168, 85, 247, ) 50%, rgba(236, 72, 153, 0.8) 80%, rgba(236, 72, 153, 0) 100%)",
          }}
        />
        <h2 className="text-5xl font-bold  mb-20">
          <span className=" bg-gradient-to-r from-white via-pink-300 to-white bg-clip-text text-transparent blur-[0.5px]">
            {title}
          </span>
        </h2>
        <div className="flex gap-8 justify-center mt-8">
          <FancyButton href={ctaHref}>{ctaText}</FancyButton>
        </div>
      </div>
    </section>
  )
}
