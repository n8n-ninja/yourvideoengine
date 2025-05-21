import { describe, it, expect } from "vitest"
import { clamp, lerp, interpolateObject } from "../math"

describe("clamp", () => {
  it("returns value if in range", () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it("returns min if value is below", () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })
  it("returns max if value is above", () => {
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe("lerp", () => {
  it("returns a if t=0", () => {
    expect(lerp(0, 10, 0)).toBe(0)
  })
  it("returns b if t=1", () => {
    expect(lerp(0, 10, 1)).toBe(10)
  })
  it("returns midpoint if t=0.5", () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
  it("works with negative numbers", () => {
    expect(lerp(-10, 10, 0.5)).toBe(0)
  })
})

describe("interpolateObject", () => {
  it("interpolates numeric properties", () => {
    expect(interpolateObject({ x: 0, y: 10 }, { x: 10, y: 20 }, 0.5)).toEqual({
      x: 5,
      y: 15,
    })
  })
  it("keeps non-numeric properties from a", () => {
    expect(
      interpolateObject({ x: 0, label: "a" }, { x: 10, label: "b" }, 0.5),
    ).toEqual({ x: 5, label: "a" })
  })
  it("keeps properties from a if missing in b", () => {
    expect(interpolateObject({ x: 0, y: 10 }, { x: 10 }, 0.5)).toEqual({
      x: 5,
      y: 10,
    })
  })

  it("interpolates px units", () => {
    expect(
      interpolateObject({ left: "100px" }, { left: "200px" }, 0.5),
    ).toEqual({ left: "150px" })
  })

  it("interpolates vw units", () => {
    expect(
      interpolateObject({ width: "10vw" }, { width: "30vw" }, 0.25),
    ).toEqual({ width: "15vw" })
  })

  it("interpolates vh units", () => {
    expect(
      interpolateObject({ height: "10vh" }, { height: "30vh" }, 0.75),
    ).toEqual({ height: "25vh" })
  })

  it("does not interpolate if units differ", () => {
    expect(interpolateObject({ left: "100px" }, { left: "50vw" }, 0.5)).toEqual(
      { left: "100px" },
    )
  })

  it("does not interpolate if only one value has unit", () => {
    expect(interpolateObject({ left: "100px" }, { left: "200" }, 0.5)).toEqual({
      left: "100px",
    })
  })

  it("picks closest for percent strings", () => {
    expect(interpolateObject({ top: "0%" }, { top: "100%" }, 0.2)).toEqual({
      top: "0%",
    })
    expect(interpolateObject({ top: "0%" }, { top: "100%" }, 0.8)).toEqual({
      top: "100%",
    })
  })
})
