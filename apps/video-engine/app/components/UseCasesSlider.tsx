import { useState, useRef, useEffect } from "react"
import { UseCaseCard, type UseCaseBullet } from "~/components/UseCaseCard"

export interface UseCase {
  number: number
  name: string
  title: string
  intro: string
  bullets: UseCaseBullet[]
}

export interface UseCasesSliderProps {
  title: string
  description: string[]
  useCases: UseCase[]
}

export function UseCasesSlider({
  title,
  description,
  useCases,
}: UseCasesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderWrapperRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [maxIndex, setMaxIndex] = useState(0)
  const [finalOffset, setFinalOffset] = useState(0)
  const [initialOffset, setInitialOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)
  const [slideWidth, setSlideWidth] = useState(0)
  const [currentTranslateX, setCurrentTranslateX] = useState(0)
  const [dragVelocity, setDragVelocity] = useState(0)
  const [lastDragX, setLastDragX] = useState(0)
  const [lastDragTime, setLastDragTime] = useState(0)

  // Calculer les dimensions et les indices max
  useEffect(() => {
    const calculateDimensions = () => {
      if (sliderWrapperRef.current && sliderRef.current) {
        const wrapperWidth = sliderWrapperRef.current.clientWidth
        const calculatedCardWidth = wrapperWidth * 0.4 // Chaque carte fait 40% de la largeur
        const gap = 24 // gap-6 = 1.5rem = 24px

        // Largeur totale de tous les éléments avec leurs gaps
        const totalContentWidth =
          useCases.length * calculatedCardWidth + (useCases.length - 1) * gap

        // Le nombre d'éléments visibles (complets) dans la fenêtre
        const visibleCards = wrapperWidth / calculatedCardWidth

        // Calculer l'index maximum pour que le dernier élément soit aligné avec la fin
        // Tenir compte que nous voulons exactement 2.5 éléments visibles
        const calculatedMaxIndex = Math.max(
          0,
          useCases.length - Math.ceil(visibleCards)
        )

        // Calculer l'offset final pour aligner le dernier élément avec la fin du conteneur
        const calculatedFinalOffset = -(totalContentWidth - wrapperWidth)

        setMaxIndex(calculatedMaxIndex)
        setInitialOffset(0) // Premier élément aligné au début
        setFinalOffset(calculatedFinalOffset) // Dernier élément aligné à la fin
        setSliderWidth(wrapperWidth)
        setSlideWidth(calculatedCardWidth + gap)

        // Appliquer la position initiale si on est au début
        if (currentIndex === 0 && !isDragging) {
          setCurrentTranslateX(0)
          sliderRef.current.style.transform = `translateX(0px)`
        }
      }
    }

    calculateDimensions()
    window.addEventListener("resize", calculateDimensions)

    return () => {
      window.removeEventListener("resize", calculateDimensions)
    }
  }, [useCases.length, currentIndex, isDragging])

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(maxIndex, prevIndex + 1))
  }

  // Update slider position when index changes
  useEffect(() => {
    if (sliderRef.current && !isDragging) {
      let position

      if (currentIndex === 0) {
        // Premier élément - aligné au début
        position = initialOffset
      } else if (currentIndex === maxIndex) {
        // Dernier élément - aligné à la fin
        position = finalOffset
      } else {
        // Éléments intermédiaires - calcul proportionnel
        position = -currentIndex * slideWidth
      }

      setCurrentTranslateX(position)
      sliderRef.current.style.transform = `translateX(${position}px)`
    }
  }, [
    currentIndex,
    initialOffset,
    finalOffset,
    maxIndex,
    slideWidth,
    isDragging,
  ])

  // Handlers for dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior to avoid text selection during drag
    e.preventDefault()

    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setLastDragX(clientX)
    setLastDragTime(Date.now())
    setDragVelocity(0)
    setSliderPosition(currentTranslateX)

    // Désactiver la transition pendant le drag
    if (sliderRef.current) {
      sliderRef.current.style.transition = "none"
    }
  }

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStartX

    // Calculate velocity
    const now = Date.now()
    const elapsed = now - lastDragTime
    if (elapsed > 0) {
      const movement = clientX - lastDragX
      const newVelocity = movement / elapsed // pixels per ms
      // Use a weighted average to smooth out the velocity
      setDragVelocity(dragVelocity * 0.7 + newVelocity * 0.3)
      setLastDragX(clientX)
      setLastDragTime(now)
    }

    // Calculate new position based on initial position plus drag distance
    let newPosition = sliderPosition + diff

    // Apply constraints to prevent dragging beyond boundaries
    // Add some elasticity to make it feel more natural
    if (newPosition > initialOffset + sliderWidth * 0.2) {
      // Slow down the movement when pulling beyond the start
      newPosition = initialOffset + (newPosition - initialOffset) * 0.2
    } else if (newPosition < finalOffset - sliderWidth * 0.2) {
      // Slow down the movement when pulling beyond the end
      newPosition = finalOffset - (finalOffset - newPosition) * 0.2
    }

    // Update the slider position directly
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${newPosition}px)`
      setCurrentTranslateX(newPosition)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    // Réactiver la transition
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 300ms ease-out"
    }

    // Calculate distance moved
    const distance = currentTranslateX - sliderPosition
    const moveThreshold = slideWidth * 0.15 // Lower threshold (15%) for fast movements

    // Consider both distance moved and velocity
    const velocityThreshold = 0.5 // Pixels per millisecond
    const isSignificantVelocity = Math.abs(dragVelocity) > velocityThreshold

    // For fast movements, consider the velocity direction
    if (isSignificantVelocity) {
      if (dragVelocity > 0 && currentIndex > 0) {
        // Fast movement to the right
        goToPrevious()
      } else if (dragVelocity < 0 && currentIndex < maxIndex) {
        // Fast movement to the left
        goToNext()
      } else {
        snapToNearestSlide()
      }
    }
    // For slower movements, consider the distance
    else if (distance > moveThreshold && currentIndex > 0) {
      // Moved right enough to go to previous slide
      goToPrevious()
    } else if (distance < -moveThreshold && currentIndex < maxIndex) {
      // Moved left enough to go to next slide
      goToNext()
    } else {
      snapToNearestSlide()
    }

    setIsDragging(false)
    setDragVelocity(0)
  }

  // Helper function to snap to the nearest slide
  const snapToNearestSlide = () => {
    // Calculate the nearest slide index based on current position
    const nearestIndex = Math.round(-currentTranslateX / slideWidth)
    const boundedIndex = Math.max(0, Math.min(maxIndex, nearestIndex))

    // Update index if different
    if (boundedIndex !== currentIndex) {
      setCurrentIndex(boundedIndex)
    } else {
      // If same index, still need to snap back to proper position
      let snapPosition

      if (boundedIndex === 0) {
        snapPosition = initialOffset
      } else if (boundedIndex === maxIndex) {
        snapPosition = finalOffset
      } else {
        snapPosition = -boundedIndex * slideWidth
      }

      // Apply the snap position
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${snapPosition}px)`
        setCurrentTranslateX(snapPosition)
      }
    }
  }

  // Ajouter et supprimer les event listeners pour le drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove, { passive: false })
      window.addEventListener("touchmove", handleDragMove, { passive: false })
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchend", handleDragEnd)
      window.addEventListener("mouseleave", handleDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMove)
      window.removeEventListener("touchmove", handleDragMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchend", handleDragEnd)
      window.removeEventListener("mouseleave", handleDragEnd)
    }
  }, [isDragging, sliderPosition, currentTranslateX, dragVelocity])

  return (
    <section className="w-full py-16 md:py-24 relative">
      {/* Titre et description en largeur limitée */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {title}
        </h2>

        <div className="mb-12 max-w-4xl mx-auto">
          {description.map((paragraph, index) => (
            <p key={index} className="text-lg text-center mb-4 text-gray-100">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Slider en pleine largeur */}
      <div className="relative w-full overflow-hidden">
        {/* Main drag handle that covers the entire width */}
        <button
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing bg-transparent z-[5]"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          aria-label="Drag to navigate carousel"
          type="button"
        />

        {/* Effets de fondu sur les côtés */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#191923] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#191923] to-transparent z-10 pointer-events-none"></div>

        {/* Conteneur du slider avec padding horizontal et largeur max limitée pour l'alignement */}
        <div
          ref={sliderWrapperRef}
          className="max-w-6xl mx-auto px-6 md:px-12 relative"
        >
          {/* Slider container */}
          <div className="relative">
            {/* Slider track */}
            <div
              ref={sliderRef}
              className="flex gap-6 transition-transform duration-300 ease-out select-none"
              aria-roledescription="carousel"
              aria-label="Use cases carousel"
            >
              {useCases.map((useCase) => (
                <div key={useCase.number} className="w-[40%] flex-shrink-0">
                  <UseCaseCard
                    number={useCase.number}
                    name={useCase.name}
                    title={useCase.title}
                    intro={useCase.intro}
                    bullets={useCase.bullets}
                  />
                </div>
              ))}
            </div>

            {/* We don't need the inner drag handle anymore as we're using the full-width one */}
          </div>

          {/* Navigation buttons - avec hidden quand inactifs */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 -left-4 md:left-0 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/90 h-12 w-12 rounded-full flex items-center justify-center text-white z-20 shadow-lg backdrop-blur-sm transition-opacity duration-300"
              aria-label="Previous slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {currentIndex < maxIndex && (
            <button
              onClick={goToNext}
              className="absolute top-1/2 -right-4 md:right-0 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/90 h-12 w-12 rounded-full flex items-center justify-center text-white z-20 shadow-lg backdrop-blur-sm transition-opacity duration-300"
              aria-label="Next slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Barre de progression au lieu des points */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="mt-8 relative h-1 bg-gray-700/50 rounded-full overflow-hidden max-w-md mx-auto">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / maxIndex) * 100}%`,
              opacity: maxIndex > 0 ? 1 : 0,
            }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={(currentIndex / maxIndex) * 100}
          ></div>
        </div>
      </div>
    </section>
  )
}
