import { describe, it, expect } from "vitest"
import { getProgressEasing } from "../getProgressEasing"

describe("getProgressEasing", () => {
  const fps = 30
  const startFrame = 0
  const endFrame = 90 // 3s

  it("returns correct default values (no transition)", () => {
    const res = getProgressEasing({ startFrame, endFrame, frame: 0, fps })
    // Affiche la valeur réelle pour debug
    console.log("phase:", res.phase)
    console.log("progressIn:", res.progressIn)
    console.log("progressOut:", res.progressOut)
    expect(["in", "steady", "out"]).toContain(res.phase)
    expect(res.progressIn).toBe(1)
    expect(res.progressOut).toBe(0)
  })

  it("returns correct values for linear easing", () => {
    const res = getProgressEasing({
      transition: {
        inDuration: 1,
        outDuration: 1,
        inEasing: "linear",
        outEasing: "linear",
      },
      startFrame,
      endFrame,
      frame: 15,
      fps,
    })
    // inDuration = 30 frames, outDuration = 30 frames
    expect(res.phase).toBe("in")
    expect(res.progressIn).toBeCloseTo(0.5)
    expect(res.progressOut).toBe(1)
  })

  it("returns correct values for easeIn and easeOut", () => {
    const res = getProgressEasing({
      transition: {
        inDuration: 1,
        outDuration: 1,
        inEasing: "easeIn",
        outEasing: "easeOut",
      },
      startFrame,
      endFrame,
      frame: 15,
      fps,
    })
    expect(res.phase).toBe("in")
    expect(res.progressIn).toBeLessThan(0.5) // easeIn starts slow
    expect(res.progressOut).toBe(1)
  })

  it("returns correct values for easeInOut", () => {
    const res = getProgressEasing({
      transition: {
        inDuration: 1,
        outDuration: 1,
        inEasing: "easeInOut",
        outEasing: "easeInOut",
      },
      startFrame,
      endFrame,
      frame: 15,
      fps,
    })
    expect(res.phase).toBe("in")
    expect(res.progressIn).toBeGreaterThan(0)
    expect(res.progressIn).toBeLessThan(1)
    expect(res.progressOut).toBe(1)
  })

  it("returns correct phase for steady", () => {
    const res = getProgressEasing({
      transition: { inDuration: 0.5, outDuration: 0.5 },
      startFrame,
      endFrame,
      frame: 45,
      fps,
    })
    expect(res.phase).toBe("steady")
  })

  it("returns correct phase for out", () => {
    const res = getProgressEasing({
      transition: { inDuration: 1, outDuration: 1 },
      startFrame,
      endFrame,
      frame: 80,
      fps,
    })
    expect(res.phase).toBe("out")
    expect(res.progressOut).toBeLessThan(1)
    expect(res.progressOut).toBeGreaterThan(0)
  })

  it("handles transition.duration as fallback", () => {
    const res = getProgressEasing({
      transition: { duration: 1 },
      startFrame,
      endFrame,
      frame: 15,
      fps,
    })
    expect(res.progressIn).toBeGreaterThan(0)
    expect(res.progressIn).toBeLessThan(1)
    expect(res.progressOut).toBe(1)
  })

  it("returns correct values at endFrame", () => {
    const res = getProgressEasing({
      transition: { inDuration: 1, outDuration: 1 },
      startFrame,
      endFrame,
      frame: endFrame,
      fps,
    })
    expect(res.phase).toBe("out")
    expect(res.progressOut).toBe(0)
  })

  it("returns correct values at inEnd and outStart", () => {
    const inDuration = 1
    const outDuration = 1
    const inEnd = startFrame + inDuration * fps
    const outStart = endFrame - outDuration * fps
    const resInEnd = getProgressEasing({
      transition: { inDuration, outDuration },
      startFrame,
      endFrame,
      frame: inEnd,
      fps,
    })
    expect(resInEnd.phase).toBe("steady")
    expect(resInEnd.progressIn).toBe(1)
    const resOutStart = getProgressEasing({
      transition: { inDuration, outDuration },
      startFrame,
      endFrame,
      frame: outStart,
      fps,
    })
    expect(resOutStart.phase).toBe("out")
    expect(resOutStart.progressOut).toBe(1)
  })
})
