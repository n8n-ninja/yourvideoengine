import { useState, createContext, useContext, useRef } from "react"
import {
  ProjectCard,
  type ProjectHighlight,
  type ProjectVideo,
} from "~/components/ProjectCard"
import { SectionTitle } from "~/components/SectionTitle"

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
  description: string
  highlights: ProjectHighlight[]
  videos: ProjectVideo[]
  videoOrientation: "horizontal" | "vertical"
  metrics?: string
  metricsLabel?: string
}

export interface SelectedProjectsProps {
  title: string
  description: string
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
  // Refs pour les éléments projet
  const projectRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  // Fonction pour scroller vers un projet spécifique
  const scrollToProject = (index: number) => {
    // Calcul simplifié : position de base + index * hauteur de viewport
    // La position de base est celle du premier projet dans la page
    const baseOffset = sectionRef.current?.offsetTop || 0
    const headerOffset = 300 // Offset pour tenir compte du header et de la description

    // Calcul de l'offset : hauteur du header + (index * hauteur viewport)
    // Ajuster 1.5 à une valeur plus grande ou plus petite selon les besoins
    const scrollPosition =
      baseOffset + headerOffset + index * window.innerHeight * 1.0

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    })
  }

  return (
    <VideoContext.Provider
      value={{ activeVideoId, setActiveVideoId, isMuted, setIsMuted }}
    >
      <section
        className="w-full py-16 md:py-24 px-6 md:px-12 relative"
        ref={sectionRef}
      >
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec titre et description */}
          <div className="mb-40">
            <SectionTitle title={title} subtitle={description} />
          </div>

          {/* Container des projets */}
          <div className="pb-[10px] -mb-44 relative">
            {projects.map((project, index) => (
              <div
                key={index}
                ref={(el) => (projectRefs.current[index] = el)}
                className=" md:h-[90vh] md:sticky md:top-[15%] w-full mb-10 pb-10"
              >
                <ProjectCardWithContext
                  {...project}
                  imagePosition={index % 2 === 0 ? "right" : "left"}
                  tabPosition={index}
                  totalTabs={projects.length}
                  onTabClick={(idx) => scrollToProject(idx)}
                />
              </div>
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
  tabPosition?: number
  totalTabs?: number
  onTabClick?: (index: number) => void
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
