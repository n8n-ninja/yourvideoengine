import { useState, useRef, useEffect } from "react"
import { UseCaseCard, type UseCaseBullet } from "~/components/UseCaseCard"
import { SectionTitle } from "~/components/SectionTitle"

// Keyframes pour l'animation de pulsation
const pulseKeyframes = `
@keyframes slowPulse {
  0% {
    opacity: 0.85;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.85;
    transform: scale(1);
  }
}

@keyframes slowPulse2 {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  65% {
    opacity: 1;
    transform: scale(1.07);
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
}
`

export interface UseCase {
  number: number
  name: string
  title: string
  intro: string
  bullets: UseCaseBullet[]
}

export interface UseCasesSliderProps {
  title: string
  description: string
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
  const [glowPosition, setGlowPosition] = useState(0)
  const [targetGlowPosition, setTargetGlowPosition] = useState(0)

  // Calculer les dimensions et les indices max
  useEffect(() => {
    const calculateDimensions = () => {
      if (sliderWrapperRef.current && sliderRef.current) {
        const wrapperWidth = sliderWrapperRef.current.clientWidth
        const isMobile = wrapperWidth < 768 // Détecter les écrans mobiles (< 768px)

        // Ajuster la largeur des cartes en fonction de la taille de l'écran
        // Sur mobile: 100% de la largeur, sur desktop: 40% comme avant
        const calculatedCardWidth = isMobile
          ? wrapperWidth // Une carte qui prend toute la largeur sur mobile
          : wrapperWidth * 0.4 // Comportement existant sur desktop

        const gap = isMobile ? 12 : 24 // Pas de gap sur mobile, 24px sur desktop

        // Largeur totale de tous les éléments avec leurs gaps
        const totalContentWidth =
          useCases.length * calculatedCardWidth + (useCases.length - 1) * gap

        // Le nombre d'éléments visibles (complets) dans la fenêtre
        const visibleCards = wrapperWidth / calculatedCardWidth

        // Calculer l'index maximum pour que le dernier élément soit aligné avec la fin
        const calculatedMaxIndex = Math.max(
          0,
          useCases.length - Math.ceil(isMobile ? 1 : visibleCards) // Sur mobile, une seule carte visible
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

      // Mettre à jour la position de la lueur en fonction de la position actuelle
      updateGlowPosition(currentIndex)
    }
  }, [
    currentIndex,
    initialOffset,
    finalOffset,
    maxIndex,
    slideWidth,
    isDragging,
  ])

  // Fonction pour mettre à jour la position de la lueur
  const updateGlowPosition = (index: number) => {
    // On utilise un pourcentage qui correspond à la position de la carte actuelle
    // Mais on limite pour que la lueur s'arrête exactement derrière la dernière carte
    if (maxIndex > 0) {
      // Calculer la position selon où se trouve la carte dans le slider
      // Si c'est la première carte, position = 15% (pour centrer sur la première carte)
      // Si c'est la dernière carte, position = 50% (pour centrer sur la dernière carte)
      const startPosition = 15 // Position de la première carte
      const endPosition = 50 // Position de la dernière carte

      // Calcul proportionnel entre la première et la dernière position
      const positionPercent =
        startPosition + (index / maxIndex) * (endPosition - startPosition)

      // On définit la position cible, mais pas directement la position actuelle
      setTargetGlowPosition(positionPercent)
    } else {
      setTargetGlowPosition(15) // Centré sur la première carte s'il n'y a qu'une carte
    }
  }

  // Effet d'inertie pour la lueur
  useEffect(() => {
    // Si la lueur n'est pas en mouvement (pas de drag), on applique l'effet d'inertie
    if (!isDragging) {
      // Animation frame pour créer une transition douce
      const animationFrame = requestAnimationFrame(() => {
        // Calculer la nouvelle position avec un effet d'inertie (easing)
        const newPosition =
          glowPosition + (targetGlowPosition - glowPosition) * 0.06

        // Si on est très proche de la cible, on arrête l'animation
        if (Math.abs(newPosition - targetGlowPosition) < 0.1) {
          setGlowPosition(targetGlowPosition)
        } else {
          setGlowPosition(newPosition)
        }
      })

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [glowPosition, targetGlowPosition, isDragging])

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

      // Mettre à jour la position de la lueur pendant le drag
      if (maxIndex > 0 && slideWidth > 0) {
        // Calculer l'index approximatif pendant le glissement
        const estimatedIndex = Math.max(
          0,
          Math.min(maxIndex, -newPosition / slideWidth)
        )
        // Utiliser la même logique que updateGlowPosition
        const startPosition = 15
        const endPosition = 50
        const positionPercent =
          startPosition +
          (estimatedIndex / maxIndex) * (endPosition - startPosition)

        // Pendant le drag, on met à jour directement la position cible
        setTargetGlowPosition(positionPercent)

        // On applique aussi un effet d'inertie, mais plus rapide pendant le drag
        setGlowPosition(glowPosition + (positionPercent - glowPosition) * 0.2)
      }
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return

    // Réactiver la transition
    if (sliderRef.current) {
      // Ajuster la durée de la transition en fonction de la vélocité
      const velocityAbs = Math.abs(dragVelocity)
      const baseDuration = 300
      const velocityFactor = Math.min(velocityAbs * 300, 800) // Réduire l'inertie et la durée max
      const transitionDuration = baseDuration + velocityFactor

      // Utiliser une courbe qui ralentit plus rapidement
      sliderRef.current.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`
    }

    // Calculate distance moved
    const distance = currentTranslateX - sliderPosition
    const moveThreshold = slideWidth * 0.15 // Lower threshold (15%) for fast movements

    // Consider both distance moved and velocity
    const velocityThreshold = 0.5 // Pixels per millisecond
    const isSignificantVelocity = Math.abs(dragVelocity) > velocityThreshold

    // Calculer un décalage supplémentaire basé sur la vélocité pour l'inertie
    const inertiaOffset = dragVelocity * 200 // Réduire l'amplification de l'effet de la vélocité

    // Pour les mouvements rapides, appliquer l'inertie en fonction de la vélocité
    if (isSignificantVelocity) {
      // Calculer l'index cible basé sur la position actuelle plus l'inertie
      const targetPosition = currentTranslateX + inertiaOffset
      const estimatedIndex = Math.round(-targetPosition / slideWidth)

      // Limiter l'index dans les bornes
      const boundedIndex = Math.max(0, Math.min(maxIndex, estimatedIndex))
      setCurrentIndex(boundedIndex)
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
    <section className="w-full py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Style pour les animations */}
      <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />

      {/* Titre et description en largeur limitée */}
      <div className="max-w-6xl mx-auto mb-12">
        <SectionTitle title={title} subtitle={description} />
      </div>

      {/* Slider en pleine largeur */}
      <div className="relative w-full pb-12">
        {/* Effet de lueur de fond qui se déplace */}
        <div
          className="absolute -top-[50px]  inset-0 w-full h-full overflow-visible pointer-events-none z-[1]"
          aria-hidden="true"
        >
          {/* Lueur principale avec touche dorée */}
          <div
            className="absolute w-[100%] h-[100%] max-w-[800px] max-h-[800px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.35) 0%, rgba(168,85,247,0.25) 40%, rgba(212,175,55,0.15) 60%, rgba(30,30,80,0) 80%)",
              left: `${glowPosition}%`,

              animation: "slowPulse 4s ease-in-out infinite",
            }}
          />

          {/* Lueur dorée subtile */}
          <div
            className="absolute top-[33%] -translate-y-1/2 w-[40%] aspect-[3.5/0.6] rounded-full blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(255,215,0,0.08) 40%, rgba(30,30,80,0) 70%)",
              left: `${glowPosition}%`,
              transform: `translate(-48%, -52%)`,
              animation: "slowPulse2 6s ease-in-out infinite",
              mixBlendMode: "soft-light",
            }}
          />

          {/* Seconde lueur plus petite et plus intense */}
          <div
            className="absolute top-[35%] -translate-y-1/2 w-[35%] aspect-[3/0.7] rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.2) 50%, rgba(212,175,55,0.1) 65%, rgba(30,30,80,0) 75%)",
              left: `${glowPosition}%`,
              transform: `translate(-50%, -50%)`,
              animation: "slowPulse2 5s ease-in-out infinite",
            }}
          />
        </div>

        {/* Main drag handle that covers the entire width */}
        <button
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing bg-transparent z-[5]"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          aria-label="Drag to navigate carousel"
          type="button"
        />

        {/* Conteneur du slider avec padding ajusté pour aligner avec le bloc supérieur */}
        <div ref={sliderWrapperRef} className="max-w-6xl mx-auto relative">
          {/* Slider container */}
          <div className="relative">
            {/* Slider track */}
            <div
              ref={sliderRef}
              className="flex gap-3 md:gap-6 transition-transform duration-300 ease-out select-none"
              aria-roledescription="carousel"
              aria-label="Use cases carousel"
            >
              {useCases.map((useCase) => (
                <div
                  key={useCase.number}
                  className="w-full md:w-[40%] flex-shrink-0"
                >
                  <UseCaseCard
                    number={useCase.number}
                    name={useCase.name}
                    title={useCase.title}
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
              className="absolute top-1/2 -left-4 md:left-0 -translate-y-1/2 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-white z-20 shadow-lg backdrop-blur-sm transition-all duration-300 border border-purple-400/30"
              aria-label="Previous slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
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
              className="absolute top-1/2 -right-4 md:right-0 -translate-y-1/2 bg-gradient-to-bl from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-white z-20 shadow-lg backdrop-blur-sm transition-all duration-300 border border-purple-400/30"
              aria-label="Next slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
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

      {/* Indicateurs de page pour mobile (points) */}
      <div className="md:hidden max-w-6xl mx-auto flex justify-center gap-2 mt-4">
        {useCases.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-gradient-to-r from-pink-500 to-purple-500"
                : "w-2 bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Barre de progression pour desktop */}
      <div className="hidden md:block max-w-6xl mx-auto">
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
