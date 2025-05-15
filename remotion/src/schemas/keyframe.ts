export type Keyframe<T = number | Record<string, unknown>> = {
  time: number // in seconds (can be negative)
  value: T
}
