import { Scene } from "@/schemas"
import { SceneOrTransition } from "@/schemas/timeline"

export const shawheenScenes: SceneOrTransition[] = [
  {
    duration: 39.057,
    timeline: [
      // {
      //   type: "sound",
      //   sound: "woosh-1.mp3",
      //   timing: { start: 0.05, duration: 39.057 },
      // },
      {
        type: "sound",
        sound: "https://files.catbox.moe/mbgrk0.mp3",
        timing: { start: 3 },
        volume: 1,
        reveal: {
          type: "fade",
          duration: 10,
        },
      },
      {
        type: "camera",
        videoUrl:
          "https://diwa7aolcke5u.cloudfront.net/uploads/shawheen-yve-demohook.mp4",
      },
    ],
  },
]

// ADD MUSIC https://files.catbox.moe/mbgrk0.mp3

const shawheen = {
  scenes: shawheenScenes,
  globalTimeline: [],
}

export default shawheen
