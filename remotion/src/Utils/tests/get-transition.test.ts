import { describe, it, expect, vi, beforeEach } from "vitest"
import { getTransition } from "../getTransition"
import { fade } from "@remotion/transitions/fade"
import { wipe } from "@remotion/transitions/wipe"
import { slide } from "@remotion/transitions/slide"
import { flip } from "@remotion/transitions/flip"
import { clockWipe } from "@remotion/transitions/clock-wipe"
import { addSound } from "../addSound"
import type { Transition } from "@/schemas"

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
vi.mock("remotion", () => ({ staticFile: (p: string) => `/static${p}` }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe("getTransition", () => {
  it("calls wipe with correct direction", () => {
    getTransition({ type: "wipe", direction: "from-right" } as Transition)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-right" })
  })

  it("calls wipe with wipeDirection if present", () => {
    getTransition({ type: "wipe", wipeDirection: "from-top" } as Transition)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-top" })
  })

  it("calls slide with correct direction", () => {
    getTransition({ type: "slide", direction: "from-bottom" } as Transition)
    expect(slide).toHaveBeenCalledWith({ direction: "from-bottom" })
  })

  it("calls flip with correct direction", () => {
    getTransition({ type: "flip", direction: "from-left" } as Transition)
    expect(flip).toHaveBeenCalledWith({ direction: "from-left" })
  })

  it("calls clockWipe with width/height", () => {
    getTransition({ type: "clockWipe" } as Transition, 123, 456)
    expect(clockWipe).toHaveBeenCalledWith({ width: 123, height: 456 })
  })

  it("calls fade for unknown type", () => {
    getTransition({ type: "unknown" } as unknown as Transition)
    expect(fade).toHaveBeenCalled()
  })

  it("calls fade if no type", () => {
    getTransition({} as Transition)
    expect(fade).toHaveBeenCalled()
  })

  it("adds sound if transition.sound is set", () => {
    getTransition({ type: "fade", sound: "test.mp3" } as Transition)
    expect(addSound).toHaveBeenCalledWith("fade", "/static/sound/test.mp3")
  })

  it("uses default direction for slide/flip/wipe", () => {
    getTransition({ type: "slide" } as Transition)
    expect(slide).toHaveBeenCalledWith({ direction: "from-left" })
    getTransition({ type: "flip" } as Transition)
    expect(flip).toHaveBeenCalledWith({ direction: "from-left" })
    getTransition({ type: "wipe" } as Transition)
    expect(wipe).toHaveBeenCalledWith({ direction: "from-left" })
  })
})
