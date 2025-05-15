/**
 * Represents a keyframe for animation.
 * The time can be negative (relative to the end of the animation).
 *
 * @template T The type of the value (number or object).
 * @property time The time of the keyframe (in seconds, can be negative).
 * @property value The value at this keyframe.
 */
export type Keyframe<T = number | Record<string, unknown>> = {
  time: number // in seconds (can be negative)
  value: T
}
