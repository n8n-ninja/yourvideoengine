import { SceneType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createScene = (overrides: Partial<SceneType> = {}): SceneType => {
  const baseScene: SceneType = {
    id: uuidv4(),
    type: "scene",
    duration: 1,
    blocks: [],
    ...overrides,
  }

  // Si duration est passé en override, il prévaut
  if (overrides.duration !== undefined) {
    return {
      ...baseScene,
      duration: overrides.duration,
    }
  }

  const firstBlock = baseScene.blocks[0]
  let duration = baseScene.duration

  if (firstBlock) {
    if (
      firstBlock.type === "camera" &&
      !("timing" in firstBlock && firstBlock.timing)
    ) {
      duration = (firstBlock as { duration?: number }).duration ?? duration
    } else if (
      "timing" in firstBlock &&
      firstBlock.timing &&
      "duration" in firstBlock.timing
    ) {
      duration =
        (firstBlock.timing as { duration?: number }).duration ?? duration
    }
  }

  return {
    ...baseScene,
    duration,
  }
}
