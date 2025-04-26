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
  const [dragOffset, setDragOffset] = useState(0)
  const [sliderWidth, setSliderWidth] = useState(0)

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
        const calculatedMaxIndex = useCases.length - Math.ceil(visibleCards)

        // Calculer l'offset final pour aligner le dernier élément avec la fin du conteneur
        const calculatedFinalOffset = -(totalContentWidth - wrapperWidth)

        setMaxIndex(calculatedMaxIndex)
        setInitialOffset(0) // Premier élément aligné au début
        setFinalOffset(calculatedFinalOffset) // Dernier élément aligné à la fin
        setSliderWidth(wrapperWidth)

        // Appliquer la position initiale
        if (currentIndex === 0 && !isDragging) {
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

  // Update slider position when index changes or during drag
  useEffect(() => {
    if (sliderRef.current) {
      // Calcul de la position
      let position

      if (isDragging) {
        // Pendant le drag, appliquer le décalage de la souris
        const basePosition =
          currentIndex === 0
            ? initialOffset
            : currentIndex === maxIndex
            ? finalOffset
            : initialOffset -
              (currentIndex / maxIndex) * (initialOffset - finalOffset)

        position = basePosition + dragOffset

        // Limiter le drag aux bornes du slider
        if (position > initialOffset + sliderWidth * 0.1) {
          position = initialOffset + sliderWidth * 0.1
        } else if (position < finalOffset - sliderWidth * 0.1) {
          position = finalOffset - sliderWidth * 0.1
        }
      } else if (currentIndex === 0) {
        // Premier élément - aligné au début
        position = initialOffset
      } else if (currentIndex === maxIndex) {
        // Dernier élément - aligné à la fin
        position = finalOffset
      } else {
        // Éléments intermédiaires - calcul proportionnel
        const progress = currentIndex / maxIndex
        position = initialOffset - progress * (initialOffset - finalOffset)
      }

      sliderRef.current.style.transform = `translateX(${position}px)`
    }
  }, [
    currentIndex,
    initialOffset,
    finalOffset,
    maxIndex,
    isDragging,
    dragOffset,
    sliderWidth,
  ])

  // Handlers for dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragOffset(0)

    // Désactiver la transition pendant le drag
    if (sliderRef.current) {
      sliderRef.current.style.transition = "none"
    }
  }

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const diff = clientX - dragStartX
    setDragOffset(diff)
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    // Réactiver la transition
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 500ms ease-in-out"
    }

    // Déterminer si on doit changer d'index
    if (dragOffset > 100 && currentIndex > 0) {
      // Swipe vers la droite - précédent
      goToPrevious()
    } else if (dragOffset < -100 && currentIndex < maxIndex) {
      // Swipe vers la gauche - suivant
      goToNext()
    }

    setIsDragging(false)
    setDragOffset(0)
  }

  // Ajouter et supprimer les event listeners pour le drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove)
      window.addEventListener("touchmove", handleDragMove)
      window.addEventListener("mouseup", handleDragEnd)
      window.addEventListener("touchend", handleDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMove)
      window.removeEventListener("touchmove", handleDragMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging])

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
        {/* Effets de fondu sur les côtés */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#191923] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#191923] to-transparent z-10 pointer-events-none"></div>

        {/* Conteneur du slider avec padding horizontal et largeur max limitée pour l'alignement */}
        <div
          ref={sliderWrapperRef}
          className="max-w-6xl mx-auto px-6 md:px-12 relative"
        >
          {/* Slider track - avec no-select pour empêcher la sélection de texte */}
          <div
            ref={sliderRef}
            className="flex gap-6 transition-transform duration-500 ease-in-out select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            role="region"
            aria-label="Use cases carousel"
            tabIndex={0}
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

          {/* Navigation buttons - avec hidden quand inactifs */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 -left-4 md:left-0 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700/90 h-12 w-12 rounded-full flex items-center justify-center text-white z-20 shadow-lg backdrop-blur-sm transition-opacity duration-300"
              aria-label="Previous slide"
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
