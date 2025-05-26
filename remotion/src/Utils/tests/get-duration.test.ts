import { describe, it, expect, vi, beforeEach } from "vitest"
import { calculateDurations } from "../getDuration"
import * as mediaParser from "@remotion/media-parser"
import type {
  TrackType,
  SceneType,
  BlockType,
  TransitionType,
} from "@/schemas/project"

vi.mock("@remotion/media-parser", () => ({
  parseMedia: vi.fn(),
}))
import { parseMedia } from "@remotion/media-parser"

const cameraBlock = (url: string, timing?: any): BlockType => ({
  type: "camera",
  url,
  ...(timing ? { timing } : {}),
})

const audioBlock: BlockType = {
  type: "audio",
  sound: "sound.mp3",
  volume: 1,
}

const imageBlock: BlockType = {
  type: "image",
  url: "img.png",
}

const transition = (duration: number): TransitionType => ({
  type: "transition",
  animation: "fade",
  duration,
})

describe("calculateDurations", () => {
  beforeEach(() => {
    ;(parseMedia as any).mockReset()
    ;(parseMedia as any).mockImplementation(({ src }: { src: string }) => {
      if (src === "video10.mp4") return { durationInSeconds: 10 }
      if (src === "video5.mp4") return { durationInSeconds: 5 }
      if (src === "video0.mp4") return { durationInSeconds: 0 }
      if (src === "videoNull.mp4") return { durationInSeconds: null }
      return { durationInSeconds: 1 }
    })
  })

  it("Track with one scene, one camera block (no timing, no duration)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t1",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video10.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(10)
    expect(result[0].items[0].duration).toBe(10)
  })

  it("Track with one scene, camera block with timing (should not force duration)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t2",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video10.mp4", { start: 0, duration: 3 })],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(3)
    expect(result[0].items[0].duration).toBe(3)
  })

  it("Track with one scene, camera + audio block", async () => {
    const tracks: TrackType[] = [
      {
        id: "t3",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4"), audioBlock],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(5)
    expect(result[0].items[0].duration).toBe(5)
  })

  it("Track with one scene, camera + image block", async () => {
    const tracks: TrackType[] = [
      {
        id: "t4",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4"), imageBlock],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(5)
    expect(result[0].items[0].duration).toBe(5)
  })

  it("Track with one scene, two camera blocks (max duration wins)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t5",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4"), cameraBlock("video10.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(10)
    expect(result[0].items[0].duration).toBe(10)
  })

  it("Scene with explicit duration and camera (max(duration, camera))", async () => {
    const tracks: TrackType[] = [
      {
        id: "t6",
        items: [
          {
            type: "scene",
            duration: 8,
            blocks: [cameraBlock("video10.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(10)
    expect(result[0].items[0].duration).toBe(10)
  })

  it("Track with scene and transition (transition subtracted)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t7",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video10.mp4")],
          },
          transition(2),
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(8)
  })

  it("Track with multiple scenes, some without duration (free time split)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t8",
        duration: 12,
        items: [
          {
            type: "scene",
            duration: 4,
            blocks: [cameraBlock("video5.mp4")],
          },
          {
            type: "scene",
            blocks: [],
          },
          {
            type: "scene",
            blocks: [],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    console.log(result[0].items)
    // 4 (first scene) + 4 (split) + 4 (split) = 12
    expect(result[0].items[1].duration).toBeCloseTo(4)
    expect(result[0].items[2].duration).toBeCloseTo(4)
  })

  it("Track with duration Infinity gets max duration of other tracks", async () => {
    const tracks: TrackType[] = [
      {
        id: "t9",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video10.mp4")],
          },
        ],
      },
      {
        id: "t10",
        duration: Infinity,
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[1].duration).toBe(10)
  })

  it("Scene without camera or duration returns 1", async () => {
    const tracks: TrackType[] = [
      {
        id: "t11",
        items: [
          {
            type: "scene",
            blocks: [audioBlock],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].items[0].duration).toBe(1)
  })

  it("Scene with camera, parseMedia returns 0 or null", async () => {
    const tracks: TrackType[] = [
      {
        id: "t12",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video0.mp4")],
          },
          {
            type: "scene",
            blocks: [cameraBlock("videoNull.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].items[0].duration).toBe(1)
    expect(result[0].items[1].duration).toBe(1)
  })

  it("Scene with camera, parseMedia < explicit duration", async () => {
    const tracks: TrackType[] = [
      {
        id: "t13",
        items: [
          {
            type: "scene",
            duration: 8,
            blocks: [cameraBlock("video5.mp4")],
          },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].items[0].duration).toBe(8)
  })

  it("Track with non-scene/non-transition items (should be ignored for duration)", async () => {
    const tracks: TrackType[] = [
      {
        id: "t14",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4")],
          },
          // @ts-expect-error purposely invalid type for test
          { type: "emoji", emoji: "😀" },
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(5)
  })

  it("Multiple tracks, cross cases", async () => {
    const tracks: TrackType[] = [
      {
        id: "t15",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video10.mp4")],
          },
        ],
      },
      {
        id: "t16",
        items: [
          {
            type: "scene",
            blocks: [cameraBlock("video5.mp4")],
          },
          transition(2),
        ],
      },
    ]
    const result = await calculateDurations(tracks)
    expect(result[0].duration).toBe(10)
    expect(result[1].duration).toBe(3)
  })
})
