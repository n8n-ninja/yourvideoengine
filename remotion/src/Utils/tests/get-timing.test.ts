import { describe, it, expect } from "vitest"
import { getTiming } from "../getTiming"

describe("getTiming", () => {
  const fps = 30
  const durationInFrames = 300 // 10s

  it("calculates timing with positive start and end", () => {
    const timing = getTiming(2, fps, durationInFrames, { start: 1, end: 5 })
    expect(timing.startSec).toBe(1)
    expect(timing.endSec).toBe(5)
    expect(timing.startFrame).toBe(30)
    expect(timing.endFrame).toBe(150)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(true)
    expect(timing.progress).toBeCloseTo((2 - 1) / (5 - 1))
  })

  it("handles negative start and end (relative to total duration)", () => {
    const timing = getTiming(9, fps, durationInFrames, { start: -5, end: -1 })
    // totalDurationSec = 10, so start = 5, end = 9
    expect(timing.startSec).toBe(5)
    expect(timing.endSec).toBe(9)
    expect(timing.startFrame).toBe(150)
    expect(timing.endFrame).toBe(270)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(false)
    expect(timing.progress).toBe(1)
  })

  it("handles duration instead of end", () => {
    const timing = getTiming(3, fps, durationInFrames, {
      start: 2,
      duration: 4,
    })
    expect(timing.startSec).toBe(2)
    expect(timing.endSec).toBe(6)
    expect(timing.startFrame).toBe(60)
    expect(timing.endFrame).toBe(180)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(true)
    expect(timing.progress).toBeCloseTo((3 - 2) / (6 - 2))
  })

  it("progress is 0 before start, 1 after end", () => {
    const timing = getTiming(0.5, fps, durationInFrames, { start: 1, end: 3 })
    expect(timing.progress).toBe(0)
    expect(timing.visible).toBe(false)
    const timing2 = getTiming(4, fps, durationInFrames, { start: 1, end: 3 })
    expect(timing2.progress).toBe(1)
    expect(timing2.visible).toBe(false)
  })

  it("defaults end to total duration if not provided", () => {
    const timing = getTiming(5, fps, durationInFrames, { start: 2 })
    expect(timing.startSec).toBe(2)
    expect(timing.endSec).toBe(10)
    expect(timing.visible).toBe(true)
  })

  it("returns totalFrames as 0 if end <= start", () => {
    const timing = getTiming(2, fps, durationInFrames, { start: 5, end: 2 })
    expect(timing.totalFrames).toBe(0)
  })

  it("handles currentTime exactly at start and end", () => {
    const timing = getTiming(1, fps, durationInFrames, { start: 1, end: 3 })
    expect(timing.progress).toBe(0)
    expect(timing.visible).toBe(true)
    const timing2 = getTiming(3, fps, durationInFrames, { start: 1, end: 3 })
    expect(timing2.progress).toBe(1)
    expect(timing2.visible).toBe(false)
  })
})
