import { describe, it, expect } from "vitest"
import { getRevealTransitionStyle } from "./getRevealTransition"

const base = {
  progressIn: 0.5,
  progressOut: 0.5,
}

describe("getRevealTransitionStyle", () => {
  it("returns correct style for fade (default)", () => {
    const style = getRevealTransitionStyle({ phase: "in", ...base })
    expect(style.opacity).toBe(0.5)
    expect(style.transform).toBeUndefined()
    expect(style.filter).toBeUndefined()
  })

  it("returns correct style for slide-up", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-up" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("translateY")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for slide-down", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-down" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("translateY")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for slide-left", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-left" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("translateX")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for slide-right", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-right" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("translateX")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for zoom-in", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "zoom-in" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("scale")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for zoom-out", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "zoom-out" },
      phase: "in",
      ...base,
    })
    expect(style.transform).toContain("scale")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for blur", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "blur" },
      phase: "in",
      ...base,
    })
    expect(style.filter).toContain("blur")
    expect(style.opacity).toBe(0.5)
    expect(style.transform).toBeUndefined()
  })

  it("returns correct style for out phase", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-up" },
      phase: "out",
      ...base,
    })
    expect(style.transform).toContain("translateY")
    expect(style.opacity).toBe(0.5)
  })

  it("returns correct style for steady phase", () => {
    const style = getRevealTransitionStyle({
      transition: { type: "slide-up" },
      phase: "steady",
      ...base,
    })
    expect(style.opacity).toBe(1)
    expect(style.transform).toBe("none")
    expect(style.filter).toBe("none")
  })

  it("handles missing transition object", () => {
    const style = getRevealTransitionStyle({ phase: "in", ...base })
    expect(style.opacity).toBe(0.5)
  })

  it("handles missing type (should fallback to fade)", () => {
    const style = getRevealTransitionStyle({
      transition: {},
      phase: "in",
      ...base,
    })
    expect(style.opacity).toBe(0.5)
    expect(style.transform).toBeUndefined()
    expect(style.filter).toBeUndefined()
  })
})
