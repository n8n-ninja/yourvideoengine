import { useState, useRef, useEffect } from "react"

export interface ProjectHighlight {
  text: string
}

export interface ProjectVideo {
  url: string
  thumbnail?: string
  title?: string
}

export interface ProjectCardProps {
  title: string
  label: string
  description: string
  highlights: ProjectHighlight[]
  videos: ProjectVideo[]
  videoOrientation: "horizontal" | "vertical"
  imagePosition?: "left" | "right"
  metrics?: string
  metricsLabel?: string
  onVideoPlay?: (videoIndex: number) => boolean
  activeVideoId?: string | null
  isMuted?: boolean
  onMuteToggle?: () => void
  tabPosition?: number
  totalTabs?: number
  onTabClick?: (index: number) => void
}

export function ProjectCard({
  title,
  label,
  description,
  highlights,
  videos,
  videoOrientation,
  imagePosition = "right",
  metrics,
  metricsLabel,
  onVideoPlay,
  activeVideoId,
  isMuted = false,
  onMuteToggle,
  tabPosition = 0,
  totalTabs = 1,
  onTabClick,
}: ProjectCardProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  // Timer pour cacher les contrôles après un délai d'inactivité
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentVideo = videos[currentVideoIndex]

  // Fonction pour réinitialiser le timer qui cache les contrôles
  const resetHideControlsTimer = () => {
    // Annuler le timer précédent s'il existe
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current)
    }

    // Si la vidéo est en lecture, on définit un nouveau timer
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false)
      }, 800) // Cacher après 800ms d'inactivité (plus rapide)
    }
  }

  // Nettoyer le timer quand le composant est démonté
  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current)
      }
    }
  }, [])

  // Gérer la lecture/pause de la vidéo
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        // Si la vidéo est en cours de lecture, on la met en pause
        videoRef.current.pause()
        setIsPlaying(false)
        // Quand on met en pause, on montre les contrôles
        setShowControls(true)

        // Annuler le timer d'inactivité
        if (hideControlsTimerRef.current) {
          clearTimeout(hideControlsTimerRef.current)
          hideControlsTimerRef.current = null
        }

        // Si une fonction de notification est fournie, on indique que la vidéo a été mise en pause
        if (onVideoPlay) {
          // Le résultat est ignoré car nous voulons juste déclencher la mise à jour de l'état
          onVideoPlay(-1) // Valeur spéciale pour indiquer "pause"
        }
      } else {
        // Si la vidéo est en pause, on la démarre
        if (onVideoPlay) {
          onVideoPlay(currentVideoIndex)
        }

        videoRef.current.play()
        setIsPlaying(true)
        // On cache les contrôles au démarrage de la lecture
        setShowControls(false)
      }
    }
  }

  // Gérer le son de la vidéo
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher la propagation au reste de l'overlay
    if (onMuteToggle) {
      onMuteToggle() // Utiliser la fonction fournie par les props
    }
  }

  // Mettre à jour le statut muet de la vidéo quand la prop change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !!isMuted
    }
  }, [isMuted])

  // Surveiller les changements d'ID vidéo active
  useEffect(() => {
    if (!videoRef.current) return

    // Générer notre ID vidéo
    const ourVideoId = `project-${title
      .replace(/\s+/g, "-")
      .toLowerCase()}-video-${currentVideoIndex}`

    // Cas 1: Si l'ID vidéo active devient null et que notre vidéo joue, on la met en pause
    if (activeVideoId === null && isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
    // Cas 2: Si l'ID vidéo active est notre vidéo et qu'elle n'est pas en train de jouer, on la lance
    else if (activeVideoId === ourVideoId && !isPlaying) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay prevented:", err)
      })
      setIsPlaying(true)
    }
    // Cas 3: Si l'ID vidéo active n'est pas notre vidéo mais que la nôtre joue, on la met en pause
    else if (
      activeVideoId !== null &&
      activeVideoId !== ourVideoId &&
      isPlaying
    ) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [activeVideoId, currentVideoIndex, isPlaying, title])

  // Surveiller la fin de la vidéo pour réinitialiser l'état
  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  // Surveiller les événements de lecture/pause externes
  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  // Fonction pour changer de vidéo et lancer la lecture automatiquement
  const changeVideo = (index: number) => {
    setCurrentVideoIndex(index)

    // Si une fonction de notification de lecture est fournie, l'utiliser
    let canPlay = true
    if (onVideoPlay) {
      canPlay = onVideoPlay(index)
    }

    // Mettre à jour l'état uniquement si autorisé à jouer
    if (canPlay) {
      setIsPlaying(true)
      // On utilise setTimeout pour s'assurer que le DOM est mis à jour avec la nouvelle vidéo
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Autoplay prevented:", err)
            setIsPlaying(false)
          })
        }
      }, 50)
    }
  }

  // Créer le player vidéo
  const videoPlayer = (
    <div
      className={`w-full h-full flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-xl border border-pink-500/60 overflow-hidden shadow-lg relative ${
        videoOrientation === "vertical" ? "aspect-[9/16]" : "aspect-[16/9]"
      } shadow-[0_10px_25px_-5px_rgba(236,72,153,0.5)] transition-all duration-300 group hover:border-pink-500/80 hover:shadow-[0_8px_32px_-5px_rgba(236,72,153,0.7)]`}
      onMouseEnter={() => {
        // Si la vidéo n'est pas en train de jouer, on montre toujours les contrôles
        if (!isPlaying) {
          setShowControls(true)
        } else {
          // Si la vidéo joue, on montre les contrôles et on réinitialise le timer
          setShowControls(true)
          resetHideControlsTimer()
        }
      }}
      onMouseLeave={() => {
        // On cache les contrôles quand la souris quitte la zone
        setShowControls(false)
        // On annule le timer
        if (hideControlsTimerRef.current) {
          clearTimeout(hideControlsTimerRef.current)
          hideControlsTimerRef.current = null
        }
      }}
      onMouseMove={() => {
        // Pour les vidéos en pause, on montre toujours les contrôles
        if (!isPlaying) {
          setShowControls(true)
        }
        // Pour les vidéos en lecture, on montre les contrôles pendant un délai limité
        else {
          setShowControls(true)
          // Réinitialiser le timer à chaque mouvement
          resetHideControlsTimer()
        }
      }}
    >
      {/* Glow effect around the video - always visible but intensifies on hover */}
      <div className="absolute -inset-[1px] rounded-xl pointer-events-none bg-gradient-to-b from-pink-500/50 to-purple-500/30 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="absolute -inset-[2px] rounded-xl pointer-events-none bg-gradient-to-tr from-pink-400/20 via-pink-400/30 to-pink-600/40 opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      <div className="absolute -inset-[3px] rounded-xl pointer-events-none bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300 blur-md"></div>

      {currentVideo ? (
        <>
          {/* Thumbnail personnalisé lorsque la vidéo n'est pas en lecture */}
          {!isPlaying && currentVideo.thumbnail && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title || "Video thumbnail"}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover relative ${
              isPlaying ? "z-10" : "z-0"
            }`}
            src={currentVideo.url}
            playsInline
            muted={isMuted}
            onClick={(e) => {
              // La vidéo elle-même ne déclenche pas togglePlayPause directement
              // car cela pourrait interférer avec l'overlay et le bouton
              e.stopPropagation()
            }}
            onEnded={handleVideoEnded}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          >
            <track kind="captions" src="" label="Français" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>

          {/* Overlay pour les contrôles personnalisés */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 z-30 ${
              !isPlaying || showControls ? "opacity-100" : "opacity-0"
            }`}
            onClick={(e) => {
              // On arrête la propagation pour éviter un double déclenchement
              e.stopPropagation()
              togglePlayPause()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                togglePlayPause()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isPlaying ? "Pause la vidéo" : "Lancer la vidéo"}
          >
            {/* Bouton play/pause */}
            <button
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full text-white transition-transform hover:scale-110 bg-pink-500/80 hover:bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
              onClick={(e) => {
                e.stopPropagation()
                togglePlayPause()
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Bouton son on/off - n'apparaît que lorsque la vidéo est en lecture */}
            {isPlaying && (
              <button
                className="absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-white transition-transform hover:scale-110 hover:bg-gray-700 hover:text-blue-300"
                onClick={toggleMute}
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.68-1.87-3.392l1.425-1.425A5.985 5.985 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z" />
                    <path d="M11 5l-1 1.5l-3.5 2.5H2v6h4.5L10 18l1-1.5v-11z" />
                    <line
                      x1="22"
                      y1="2"
                      x2="2"
                      y2="22"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.332a.5.5 0 0 1 .817.387v15.89a.5.5 0 0 1-.817.387L5.89 16zm13.517 4.134l-1.416-1.416A8.978 8.978 0 0 0 21 12a8.982 8.982 0 0 0-3.304-6.968l1.42-1.42A10.976 10.976 0 0 1 23 12c0 3.223-1.386 6.122-3.594 8.134zm-3.543-3.543l-1.422-1.422A3.993 3.993 0 0 0 16 12c0-1.43-.75-2.68-1.87-3.392l1.425-1.425A5.985 5.985 0 0 1 18 12c0 1.842-.83 3.49-2.137 4.591z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Barre de progression au bas de la vidéo */}
          <div
            className={`absolute bottom-0 left-0 w-full h-1 bg-gray-800/50 z-10 ${
              showControls ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{
                width: `${
                  videoRef.current
                    ? (videoRef.current.currentTime /
                        videoRef.current.duration) *
                      100
                    : 0
                }%`,
              }}
            />
          </div>
        </>
      ) : (
        <div className="text-gray-400 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{videoOrientation === "vertical" ? "9:16 Video" : "16:9 Video"}</p>
        </div>
      )}
    </div>
  )

  // Thumbnails pour navigation entre vidéos
  const videoNavigation = (
    <div className="flex justify-center gap-2 mt-4">
      {videos.map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-sm transition-all ${
            index === currentVideoIndex
              ? "bg-pink-500 scale-125 shadow-[0_0_6px_rgba(236,72,153,0.6)]"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
          onClick={() => changeVideo(index)}
          aria-label={`Voir vidéo ${index + 1}`}
          title={videos[index].title || `Vidéo ${index + 1}`}
        />
      ))}
    </div>
  )

  // Contenu texte pour la description du projet
  const textContent = (
    <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent transition-transform duration-300">
            {title}
          </h3>
        </div>

        <p className="text-gray-300">{description}</p>

        {metrics && (
          <div className="my-8 flex justify-center">
            <div className="inline-flex items-center bg-gray-800/80 rounded-lg px-6 py-4 border border-pink-500/40 shadow-lg shadow-pink-500/20 transition-all duration-300 hover:shadow-pink-500/30 hover:border-pink-500/60">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {metrics}
                </div>
                {metricsLabel && (
                  <div className="text-sm text-gray-300 mt-1">
                    {metricsLabel}
                  </div>
                )}
              </div>
              <div className="h-10 w-10 rounded-full bg-pink-500/20 flex-shrink-0 ml-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-200">
            Highlights:
          </h3>
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-start">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 flex-shrink-0 mt-1 mr-3 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                </div>
                <p className="text-gray-300 text-sm">{highlight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Contenu vidéo avec navigation
  const videoContent = (
    <div className="w-full md:w-1/2 p-5 md:p-7 flex flex-col items-center">
      <div
        className={
          videoOrientation === "vertical"
            ? "w-[85%] sm:w-[75%] md:w-[70%] lg:w-[60%] mx-auto max-w-[400px] min-w-[250px]"
            : "w-[90%] md:w-full max-w-[900px]"
        }
      >
        {videoPlayer}
      </div>
      {videos.length > 1 && videoNavigation}
    </div>
  )

  return (
    <div className="group bg-gray-900/95 backdrop-blur-sm rounded-2xl  border border-gray-700/50 mb-12 last:mb-0 relative mt-7 transition-all duration-500 flex flex-col md:h-[680px]">
      {/* Fond avec dégradé pour créer un effet de relief */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={`absolute inset-0 ${
            imagePosition === "left"
              ? "bg-gradient-to-r from-gray-900/100 via-gray-900/95 to-gray-900/90"
              : "bg-gradient-to-l from-gray-900/100 via-gray-900/95 to-gray-900/90"
          }`}
        ></div>
      </div>

      {/* Pour s'assurer que le contenu soit toujours au-dessus des effets visuels */}
      <div
        style={{ position: "relative", zIndex: 5 }}
        className="h-full flex flex-col"
      >
        {/* Badge sur mobile */}
        {label && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 md:hidden">
            <div className="bg-gray-900 text-white font-medium px-6 py-2 rounded-full text-sm whitespace-nowrap border-2 border-blue-500/80">
              {label}
            </div>
          </div>
        )}

        {/* Badge desktop distribué selon position */}
        {label && (
          <div
            className="absolute -top-[1px] z-10 hidden md:block"
            style={{
              left: `${(tabPosition + 0.5) * (100 / totalTabs)}%`,
              transform: "translateX(-50%) translateY(-97%)",
            }}
          >
            <div
              className="text-white font-medium py-2 rounded-t-lg text-sm whitespace-nowrap border-t border-l border-r border-gray-700/40 flex items-center justify-center w-40 px-3 bg-gray-900 cursor-pointer"
              onClick={() => onTabClick && onTabClick(tabPosition)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onTabClick && onTabClick(tabPosition)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="truncate">{label}</span>
            </div>
          </div>
        )}

        {/* Sur mobile: toujours texte puis vidéo */}
        <div className="md:hidden flex flex-col pt-8 h-full">
          {textContent}
          {videoContent}
        </div>

        {/* Sur desktop: layout basé sur imagePosition */}
        <div className="hidden md:flex md:flex-row pt-8 h-full items-center">
          {imagePosition === "left" ? (
            <>
              {videoContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {videoContent}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
