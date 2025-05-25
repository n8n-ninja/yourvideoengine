import { CameraLayerType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createCameraLayer = (
  overrides: Partial<CameraLayerType> = {},
): CameraLayerType => {
  return {
    type: "camera",
    id: uuidv4(),
    url: "",
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
