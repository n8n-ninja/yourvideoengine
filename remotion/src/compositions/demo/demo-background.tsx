import { Composition } from "remotion"
import {
  ProjectComposition,
  calculateMetadata,
} from "@/compositions/ProjectComposition"
import { Storyboard, BackgroundType } from "@/schemas/project"
import { VIDEO_THAIS_1_URL } from "./urls"

const backgrounds: BackgroundType[] = [
  // Couleur animée
  {
    backgroundColor: "#7928ca",
  },
  // Couleur animée
  {
    backgroundColor: ["#ff0080", "#7928ca", "#0070f3"],
    animationSpeed: 2,
    animationType: "crossfade",
  },
  // Gradient statique
  {
    backgroundGradient: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
  },
  // Gradient statique
  {
    backgroundColor: ["#ff0080", "#7928ca", "#0070f3"],
    backgroundGradient:
      "linear-gradient(180deg, rgba(255,0,0,0) 70%, rgba(0,0,0,0.5) 90%)",
  },
  // Image
  {
    backgroundImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1080&q=80",
  },
  // Vidéo
  {
    backgroundVideo: VIDEO_THAIS_1_URL,
  },
]

export const DemoBackground = ({
  fps = 30,
  width = 1080,
  height = 1920,
  bgKey = 0,
}: {
  fps?: number
  width?: number
  height?: number
  bgKey?: number
}) => {
  return (
    <Composition
      id={`DemoBackground-${bgKey}`}
      component={ProjectComposition}
      fps={fps}
      width={width}
      height={height}
      schema={Storyboard}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        duration: 20,
        background: backgrounds[bgKey],
      }}
    />
  )
}
