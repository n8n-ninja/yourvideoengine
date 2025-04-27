import { ServiceCategory, type Service } from "~/components/ServiceCategory"
import { useEffect, useRef } from "react"

export interface ServiceCategoryData {
  title: string
  services: Service[]
  colorClass: string
}

export interface WhatWeCanBuildProps {
  title: string
  description: string[]
  categories: ServiceCategoryData[]
}

export function WhatWeCanBuild({
  title,
  description,
  categories,
}: WhatWeCanBuildProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current

    if (!section || !glow) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const height = window.innerHeight

      // Calculate how far we've scrolled through the section
      // Adjusted to start earlier (-0.3 instead of -0.2)
      const scrollProgress = 1 - rect.bottom / (rect.height + height)

      // Only activate when section is visible (between -0.3 and 1.2)
      if (scrollProgress >= -0.3 && scrollProgress <= 1.2) {
        // Calculate opacity - fade in then fade out
        // 0 to 0.5: fade in, 0.5 to 1: fade out
        // Modified to fade in faster (0.3 instead of 0.5)
        const normalizedProgress = Math.min(Math.max(scrollProgress, 0), 1)
        const opacityFactor =
          normalizedProgress <= 0.3
            ? normalizedProgress / 0.3
            : normalizedProgress >= 0.8
            ? (1 - normalizedProgress) / 0.2
            : 1

        // Calculate horizontal position (left to right to left)
        // Start from the left (0 + offset) instead of right
        // Use cosine instead of sine to start from left
        const leftPos = Math.cos(normalizedProgress * Math.PI * 1.5) * 40 + 40

        // Calculate vertical position (top to bottom)
        const topPos = normalizedProgress * 100

        // Apply styles
        glow.style.opacity = (0.7 * Math.min(opacityFactor, 1)).toString()
        glow.style.left = `${leftPos}%`
        glow.style.top = `${topPos}%`
        glow.style.transform = `scale(${0.8 + opacityFactor * 0.4})`
      } else {
        // Hide when not in view
        glow.style.opacity = "0"
      }
    }

    // Initial call to set position when component mounts
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 px-6 md:px-12 relative"
    >
      {/* Animated glow effect */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none w-[40vw] h-[40vw] rounded-full blur-[100px] bg-gradient-to-r from-pink-500/20 via-purple-500/30 to-blue-500/20 transition-opacity duration-300"
        style={{ opacity: 0, top: "0%", left: "0%", transform: "scale(1)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {title}
        </h2>

        <div className="mb-14 max-w-4xl mx-auto">
          {description.map((paragraph, index) => (
            <p key={index} className="text-lg text-center mb-4 text-gray-100">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-gray-700/50 relative z-10">
          {categories.map((category, index) => (
            <ServiceCategory
              key={index}
              title={category.title}
              services={category.services}
              colorClass={category.colorClass}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
