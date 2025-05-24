import { Scene } from "@/schemas/index_2"

const titleScenes: Scene[] = [
  {
    duration: 3,
    timeline: [{ type: "title", theme: "minimal", title: "Theme: Minimal" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "impact", title: "Theme: Impact" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "elegant", title: "Theme: Elegant" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "neon", title: "Theme: Neon" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "shadow", title: "Theme: Shadow" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "outline", title: "Theme: Outline" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "gradient", title: "Theme: Gradient" }],
  },
  {
    duration: 3,
    timeline: [{ type: "title", theme: "retro", title: "Theme: Retro" }],
  },
  {
    duration: 3,
    timeline: [
      { type: "title", theme: "cinematic", title: "Theme: Cinematic" },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Custom Style",
        style:
          "color: #ff00a2; font-size: 70px; font-family: Comic Sans MS, cursive; text-shadow: 2px 2px 10px #000; letter-spacing: 0.2em;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Position: Center",
        position: { verticalAlign: "center" },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Position: End",
        position: { verticalAlign: "end" },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "With Transition",
        reveal: { type: "fade", duration: 0.5 },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "With Timing",
        timing: { start: 0.5, end: 2.5 },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Custom Letter Animation",
        letterAnimation: {
          duration: 0.6,
          easing: "easeInOut",
          stagger: 0.1,
          translateY: 40,
        },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        theme: "neon",
        title: "Full Combo!",
        style: "font-size: 100px; text-shadow: 0 0 20px #00fff7;",
        position: { verticalAlign: "center" },
        reveal: { type: "fade", duration: 0.5 },
        timing: { start: 0.2, end: 2.8 },
        letterAnimation: {
          duration: 0.7,
          stagger: 0.08,
        },
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Small Title",
        style: "font-size: 40px; color: #333;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Medium Title",
        style: "font-size: 60px; color: #0070f3;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Large Title",
        style: "font-size: 90px; color: #e63946;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Huge Title",
        style: "font-size: 200px;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Title with Background & Radius",
        style:
          "background: purple; color: #f1faee; padding:  48px; border-radius: 32px; font-size: 70px;",
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Title with Float Effect",
        effects: [{ type: "float", options: { amplitude: 0.5, speed: 0.5 } }],
      },
    ],
  },
  {
    duration: 3,
    timeline: [
      {
        type: "title",
        title: "Title with Tilt3D Effect",
        effects: [
          {
            type: "tilt3D",
            options: {
              amplitude: 0.5,
              speed: 0.5,
            },
          },
        ],
      },
    ],
  },
]

const title = {
  scenes: titleScenes,
}

export default title
