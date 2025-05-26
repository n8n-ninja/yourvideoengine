import { EmojiBlockType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createEmoji = (
  overrides: Partial<EmojiBlockType> = {},
): EmojiBlockType => {
  return {
    type: "emoji",
    id: uuidv4(),
    emoji: "smile",
    containerStyle: "overflow: visible",
    ...overrides,
  }
}
