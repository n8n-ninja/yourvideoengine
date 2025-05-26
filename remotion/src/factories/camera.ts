import { CameraBlockType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"
import { parseMedia } from "@remotion/media-parser"

export const createCamera = async (
  overrides: Partial<CameraBlockType> = {},
): Promise<CameraBlockType> => {
  if (!overrides.url) {
    throw new Error("URL is required")
  }

  const layerDuration = await parseMedia({
    src: overrides.url,
    acknowledgeRemotionLicense: true,
    fields: { durationInSeconds: true },
  })

  return {
    type: "camera",
    id: uuidv4(),
    url: "",
    duration: layerDuration.durationInSeconds ?? 1,
    style: undefined,
    offsetX: 0,
    offsetY: 0,
    speed: 1,
    volume: 1,
    loop: false,
    frameStyle: undefined,
    keyFrames: undefined,
    ...overrides,
  }
}
