import { TransitionType } from "@/schemas/project"
import { v4 as uuidv4 } from "uuid"

export const createTransition = (
  overrides: Partial<TransitionType> = {},
): TransitionType => {
  return {
    type: "transition",
    id: uuidv4(),
    animation: "fade",
    duration: 1,
    direction: undefined,
    wipeDirection: undefined,
    sound: undefined,
    ...overrides,
  }
}
