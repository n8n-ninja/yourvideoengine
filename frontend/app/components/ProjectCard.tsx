import { useRef } from "react"

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
  isMuted = false,
  tabPosition = 0,
  totalTabs = 1,
  onTabClick,
}: ProjectCardProps) {
  // Timer pour cacher les contrôles après un délai d'inactivité
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentVideo = videos[0]

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

  const videoPlayerMobile = (
    <div className="w-full  p-5 md:p-7 flex flex-col items-center">
      <video
        ref={videoRef}
        className={`w-full rounded-2xl border border-pink-500/60 h-full object-cover relative shadow-[0_10px_25px_-5px_rgba(236,72,153,0.5)] transition-all duration-300 group-hover:border-pink-500/80 group-hover:shadow-[0_8px_32px_-5px_rgba(236,72,153,0.7)]`}
        src={currentVideo.url}
        poster={currentVideo.thumbnail}
        playsInline
        controls
        muted={isMuted}
      >
        <track kind="captions" src="" label="Français" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
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
        {videoPlayerMobile}
      </div>
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
