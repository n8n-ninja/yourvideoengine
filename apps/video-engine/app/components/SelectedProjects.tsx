import { useState, createContext, useContext } from "react"
import {
  ProjectCard,
  type ProjectHighlight,
  type ProjectVideo,
} from "~/components/ProjectCard"

// Contexte pour la gestion globale des vidéos
interface VideoContextType {
  activeVideoId: string | null
  setActiveVideoId: (id: string | null) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
}

const VideoContext = createContext<VideoContextType>({
  activeVideoId: null,
  setActiveVideoId: () => {},
  isMuted: false,
  setIsMuted: () => {},
})

export interface Project {
  title: string
  label: string
  type: "client" | "intern"
  description: string
  highlights: ProjectHighlight[]
  videos: ProjectVideo[]
  videoOrientation: "horizontal" | "vertical"
  metrics?: string
  metricsLabel?: string
}

export interface SelectedProjectsProps {
  title: string
  description: string[]
  projects: Project[]
}

export function SelectedProjects({
  title,
  description,
  projects,
}: SelectedProjectsProps) {
  // State pour suivre quelle vidéo est active
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  // State pour gérer le son partagé entre toutes les vidéos (son activé par défaut)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <VideoContext.Provider
      value={{ activeVideoId, setActiveVideoId, isMuted, setIsMuted }}
    >
      <section className="w-full py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
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

          <div className="space-y-12">
            {projects.map((project, index) => (
              <ProjectCardWithContext
                key={index}
                {...project}
                imagePosition={index % 2 === 0 ? "right" : "left"}
              />
            ))}
          </div>
        </div>
      </section>
    </VideoContext.Provider>
  )
}

// Composant intermédiaire qui connecte ProjectCard au contexte
interface ProjectCardWithContextProps extends Project {
  imagePosition?: "left" | "right"
}

function ProjectCardWithContext({ ...props }: ProjectCardWithContextProps) {
  const { activeVideoId, setActiveVideoId, isMuted, setIsMuted } =
    useContext(VideoContext)

  // Function to handle video play
  const handleVideoPlay = (videoIndex: number) => {
    // Cas spécial: si videoIndex est -1, c'est une demande de pause
    if (videoIndex === -1) {
      // Mettre activeVideoId à null pour indiquer qu'aucune vidéo ne devrait jouer
      setActiveVideoId(null)
      return true
    }

    // Générer un ID unique pour cette combinaison projet/vidéo
    const videoId = `project-${props.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-video-${videoIndex}`

    // Si on clique sur la vidéo déjà active, on met l'ID à null pour indiquer qu'il faut la mettre en pause
    if (activeVideoId === videoId) {
      setActiveVideoId(null)
    } else {
      // Si c'est une nouvelle vidéo, on la définit comme active
      setActiveVideoId(videoId)
    }

    // On retourne toujours true pour permettre la lecture/pause
    return true
  }

  // Function to handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  return (
    <ProjectCard
      {...props}
      onVideoPlay={handleVideoPlay}
      activeVideoId={activeVideoId}
      isMuted={isMuted}
      onMuteToggle={handleMuteToggle}
    />
  )
}
