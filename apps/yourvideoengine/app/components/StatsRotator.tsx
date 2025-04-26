import { useState, useEffect } from "react"

export interface StatsRotatorProps {
  stats: string[]
  intervalMs?: number
}

// Fonction utilitaire pour formater les statistiques
const formatStat = (stat: string) => {
  // Extraire la source entre parenthèses à la fin
  const sourceMatch = stat.match(/\(([^)]+)\)$/)
  const source = sourceMatch ? sourceMatch[0] : ""

  // Retirer la source du texte principal
  const textWithoutSource = stat.replace(source, "").trim()

  // Trouver les nombres et pourcentages à mettre en évidence
  const formattedText = textWithoutSource.replace(
    /(\d+%|\d+\s*times)/g,
    (match) => `<span class="text-pink-400 font-bold">${match}</span>`
  )

  return { formattedText, source }
}

export function StatsRotator({ stats, intervalMs = 5000 }: StatsRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationState, setAnimationState] = useState<
    "enter" | "stay" | "exit"
  >("stay")

  useEffect(() => {
    if (stats.length <= 1) return

    // Cycle:
    // 1. Start with "stay" for 2/3 of the interval
    // 2. Transit to "exit" for a brief moment
    // 3. Change the index
    // 4. Transit to "enter"
    // 5. Go back to "stay"

    const stayTime = intervalMs * 0.7
    const transitionTime = intervalMs * 0.15

    const stayTimeout = setTimeout(() => {
      setAnimationState("exit")

      const exitTimeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stats.length)
        setAnimationState("enter")

        const enterTimeout = setTimeout(() => {
          setAnimationState("stay")
        }, transitionTime)

        return () => clearTimeout(enterTimeout)
      }, transitionTime)

      return () => clearTimeout(exitTimeout)
    }, stayTime)

    return () => clearTimeout(stayTimeout)
  }, [currentIndex, intervalMs, stats.length])

  if (stats.length === 0) return null

  const animationClasses = {
    enter: "transform translate-y-4 opacity-0",
    stay: "transform translate-y-0 opacity-100",
    exit: "transform -translate-y-4 opacity-0",
  }

  const { formattedText, source } = formatStat(stats[currentIndex])

  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="h-32 md:h-28 flex items-center justify-center">
          <div
            className={`transition-all duration-500 ease-in-out ${animationClasses[animationState]}`}
          >
            <p className="text-xl md:text-2xl font-medium text-gray-100">
              <span dangerouslySetInnerHTML={{ __html: formattedText }} />
              <span className="block text-base text-gray-400/80 mt-2 font-normal">
                {source}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-2 gap-2">
          {stats.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === currentIndex ? "bg-pink-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
