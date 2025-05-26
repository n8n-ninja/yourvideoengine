import { AudioBlockType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createAudio = (
  overrides: Partial<AudioBlockType> = {},
): AudioBlockType => {
  return {
    type: "audio",
    id: uuidv4(),
    sound: "",
    pitch: 1,
    speed: 1,
    volume: 1,
    loop: false,
    volumes: undefined,
    ...overrides,
  }
}
