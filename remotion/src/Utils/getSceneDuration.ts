import { SceneType } from "@/schemas/project"
import { parseMedia } from "@remotion/media-parser"

export const getSceneDuration = async (scene: SceneType) => {
  let duration = scene.duration ?? 1

  for (const layer of scene.layers) {
    if (layer.type === "camera" && !layer.timing) {
      const layerDuration = await parseMedia({
        src: layer.url,
        acknowledgeRemotionLicense: true,
        fields: { durationInSeconds: true },
      })
      if (
        layerDuration.durationInSeconds &&
        layerDuration.durationInSeconds > duration
      ) {
        duration = layerDuration.durationInSeconds
      }
    }
  }

  return duration
}
