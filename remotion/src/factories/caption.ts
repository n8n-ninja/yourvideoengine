import { CaptionBlockType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createCaptionLayer = (
  overrides: Partial<CaptionBlockType> = {},
): CaptionBlockType => {
  return {
    type: "caption",
    id: uuidv4(),
    boxStyle: undefined,
    textStyle: undefined,
    multiColors: undefined,
    combineTokensWithinMilliseconds: 1400,
    words: [],
    activeWord: undefined,
    dynamicFontSize: undefined,
    ...overrides,
  }
}
