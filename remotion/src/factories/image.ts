import { ImageBlockType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createImage = (
  overrides: Partial<ImageBlockType> = {},
): ImageBlockType => {
  return {
    type: "image",
    id: uuidv4(),
    url: "https://placehold.co/600x400",
    objectFit: "cover",
    style: undefined,
    ...overrides,
  }
}
