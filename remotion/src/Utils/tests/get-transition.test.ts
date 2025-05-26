import { describe, it, expect, vi, beforeEach } from "vitest"
import { getTransition } from "../getTransition"
import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import { addSound } from "../addSound"
import type { TransitionType } from "@/schemas/project"

vi.mock("@remotion/transitions/fade", () => ({ fade: vi.fn(() => "fade") }))
vi.mock("@remotion/transitions/wipe", () => ({ wipe: vi.fn(() => "wipe") }))
vi.mock("@remotion/transitions/slide", () => ({ slide: vi.fn(() => "slide") }))
vi.mock("@remotion/transitions/flip", () => ({ flip: vi.fn(() => "flip") }))
vi.mock("@remotion/transitions/clock-wipe", () => ({
  clockWipe: vi.fn(() => "clockWipe"),
}))
vi.mock("../addSound", () => ({
  addSound: vi.fn((pres, sound) => ({ pres, sound })),
}))
vi.mock("remotion", () => ({
  staticFile: (p: string) =>
    p.startsWith("audio/") ? `/static/sound/${p.slice(6)}` : `/static${p}`,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getTransition", () => {
  it("calls wipe with correct direction", () => {
    getTransition({
      animation: "wipe",
      direction: "from-right",
    } as TransitionType)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-right" })
  })

  it("calls wipe with wipeDirection if present", () => {
    getTransition({
      animation: "wipe",
      wipeDirection: "from-top",
    } as TransitionType)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-top" })
  })

  it("calls slide with correct direction", () => {
    getTransition({
      animation: "slide",
      direction: "from-bottom",
    } as TransitionType)
    expect(slide).toHaveBeenCalledWith({ direction: "from-bottom" })
  })

  it("calls flip with correct direction", () => {
    getTransition({
      animation: "flip",
      direction: "from-left",
    } as TransitionType)
    expect(flip).toHaveBeenCalledWith({ direction: "from-left" })
  })

  it("calls clockWipe with width/height", () => {
    getTransition({ animation: "clockWipe" } as TransitionType, 123, 456)
    expect(clockWipe).toHaveBeenCalledWith({ width: 123, height: 456 })
  })

  it("calls fade for unknown type", () => {
    getTransition({ animation: "unknown" } as unknown as TransitionType)
    expect(fade).toHaveBeenCalled()
  })

  it("calls fade if no type", () => {
    getTransition({} as TransitionType)
    expect(fade).toHaveBeenCalled()
  })

  it("adds sound if transition.sound is set", () => {
    getTransition({ animation: "fade", sound: "test.mp3" } as TransitionType)
    expect(addSound).toHaveBeenCalledWith("fade", "/static/sound/test.mp3")
  })

  it("uses default direction for slide/flip/wipe", () => {
    getTransition({ animation: "slide" } as TransitionType)
    expect(slide).toHaveBeenCalledWith({ direction: "from-left" })
    getTransition({ animation: "flip" } as TransitionType)
    expect(flip).toHaveBeenCalledWith({ direction: "from-left" })
    getTransition({ animation: "wipe" } as TransitionType)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-left" })
  })
})
