import { describe, it, expect } from "vitest"
import { getKeyframeValue } from "./getKeyframes"

describe("getKeyframeValue", () => {
  it("returns undefined for empty keyframes", () => {
    expect(getKeyframeValue([], 0, 10)).toBeUndefined()
  })

  it("returns the value of the only keyframe", () => {
    expect(getKeyframeValue([{ time: 0, value: 42 }], 5, 10)).toBe(42)
  })

  it("returns the value at the first keyframe if before", () => {
    const kfs = [
      { time: 2, value: 10 },
      { time: 5, value: 20 },
    ]
    expect(getKeyframeValue(kfs, 0, 10)).toBe(10)
  })

  it("returns the value at the last keyframe if after", () => {
    const kfs = [
      { time: 2, value: 10 },
      { time: 5, value: 20 },
    ]
    expect(getKeyframeValue(kfs, 10, 10)).toBe(20)
  })

  it("interpolates between two numeric keyframes", () => {
    const kfs = [
      { time: 0, value: 0 },
      { time: 10, value: 10 },
    ]
    expect(getKeyframeValue(kfs, 5, 10)).toBeCloseTo(5)
  })

  it("returns exact value if currentTime is on a keyframe", () => {
    const kfs = [
      { time: 0, value: 0 },
      { time: 10, value: 10 },
    ]
    expect(getKeyframeValue(kfs, 10, 10)).toBe(10)
  })

  it("handles negative keyframe times (relative to duration)", () => {
    const kfs = [
      { time: -2, value: 5 }, // duration = 10, so time = 8
      { time: 10, value: 10 },
    ]
    expect(getKeyframeValue(kfs, 9, 10)).toBeCloseTo(7.5)
  })

  it("interpolates between two object keyframes", () => {
    const kfs = [
      { time: 0, value: { x: 0, y: 10 } },
      { time: 10, value: { x: 10, y: 20 } },
    ]
    expect(getKeyframeValue(kfs, 5, 10)).toEqual({ x: 5, y: 15 })
  })

  it("returns previous value if cannot interpolate", () => {
    const kfs: { time: number; value: string }[] = [
      { time: 0, value: "a" },
      { time: 10, value: "b" },
    ]
    expect(getKeyframeValue(kfs, 5, 10)).toBe("a")
  })

  it("returns previous value if keyframes at same time", () => {
    const kfs = [
      { time: 5, value: 1 },
      { time: 5, value: 2 },
    ]
    expect(getKeyframeValue(kfs, 5, 10)).toBe(1)
  })

  it("interpolates only numeric properties in object keyframes", () => {
    const kfs = [
      { time: 0, value: { x: 0, label: "a" } },
      { time: 10, value: { x: 10, label: "b" } },
    ]
    expect(getKeyframeValue(kfs, 5, 10)).toEqual({ x: 5, label: "a" })
  })
})
