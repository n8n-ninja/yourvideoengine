import { describe, it, expect } from "vitest"
import { getTiming } from "../getTiming"

describe("getTiming", () => {
  const fps = 30
  const durationInFrames = 300 // 10s

  it("calculates timing with positive start and end", () => {
    const start = 1
    const end = 5
    const duration = end - start
    const frame = 2 * fps // 2s
    const timing = getTiming(frame, fps, durationInFrames, start, duration)
    expect(timing.startSec).toBe(1)
    expect(timing.endSec).toBe(5)
    expect(timing.startFrame).toBe(30)
    expect(timing.endFrame).toBe(150)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(true)
    expect(timing.progress).toBeCloseTo((2 - 1) / (5 - 1))
  })

  it("handles negative start and end (relative to total duration)", () => {
    // totalDurationSec = 10, so start = 5, end = 9
    const start = -5
    const end = -1
    const totalDurationSec = durationInFrames / fps
    const resolvedStart = totalDurationSec + start // 5
    const resolvedEnd = totalDurationSec + end // 9
    const duration = resolvedEnd - resolvedStart // 4
    const frame = 9 * fps // 9s
    const timing = getTiming(
      frame,
      fps,
      durationInFrames,
      resolvedStart,
      duration,
    )
    expect(timing.startSec).toBe(5)
    expect(timing.endSec).toBe(9)
    expect(timing.startFrame).toBe(150)
    expect(timing.endFrame).toBe(270)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(false)
    expect(timing.progress).toBe(1)
  })

  it("handles duration instead of end", () => {
    const start = 2
    const duration = 4
    const frame = 3 * fps // 3s
    const timing = getTiming(frame, fps, durationInFrames, start, duration)
    expect(timing.startSec).toBe(2)
    expect(timing.endSec).toBe(6)
    expect(timing.startFrame).toBe(60)
    expect(timing.endFrame).toBe(180)
    expect(timing.totalFrames).toBe(120)
    expect(timing.visible).toBe(true)
    expect(timing.progress).toBeCloseTo((3 - 2) / (6 - 2))
  })

  it("progress is 0 before start, 1 after end", () => {
    const start = 1
    const end = 3
    const duration = end - start
    const frameBefore = 0.5 * fps // 0.5s
    const frameAfter = 4 * fps // 4s
    const timing = getTiming(
      frameBefore,
      fps,
      durationInFrames,
      start,
      duration,
    )
    expect(timing.progress).toBe(0)
    expect(timing.visible).toBe(false)
    const timing2 = getTiming(
      frameAfter,
      fps,
      durationInFrames,
      start,
      duration,
    )
    expect(timing2.progress).toBe(1)
    expect(timing2.visible).toBe(false)
  })

  it("defaults end to total duration if not provided", () => {
    const start = 2
    const duration = 0
    const frame = 5 * fps // 5s
    const timing = getTiming(frame, fps, durationInFrames, start, duration)
    expect(timing.startSec).toBe(2)
    expect(timing.endSec).toBe(10)
    expect(timing.visible).toBe(true)
  })

  it("returns totalFrames as 1 if end <= start (sécurité)", () => {
    const start = 5
    const end = 2
    const duration = end - start // -3
    const frame = 2 * fps // 2s
    const timing = getTiming(frame, fps, durationInFrames, start, duration)
    expect(timing.totalFrames).toBe(60)
  })

  it("handles currentTime exactly at start and end", () => {
    const start = 1
    const end = 3
    const duration = end - start
    const frameAtStart = 1 * fps // 1s
    const frameAtEnd = 3 * fps // 3s
    const timing = getTiming(
      frameAtStart,
      fps,
      durationInFrames,
      start,
      duration,
    )
    expect(timing.progress).toBe(0)
    expect(timing.visible).toBe(true)
    const timing2 = getTiming(
      frameAtEnd,
      fps,
      durationInFrames,
      start,
      duration,
    )
    expect(timing2.progress).toBe(1)
    expect(timing2.visible).toBe(false)
  })
})
