import "./fonts.css"
import { Composition, getInputProps } from "remotion"
import {
  EditComponent,
  editSchema,
  calculateMetadata as editCalculateMetadata,
} from "@/compositions/EditComposition"
import { z } from "zod"
export const RemotionRoot: React.FC = () => {
  const inputProps = getInputProps<{
    fps: number
    width: number
    height: number
    global: z.infer<typeof editSchema>["global"]
    scenes: z.infer<typeof editSchema>["scenes"]
  }>()

  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  return (
    <>
      <Composition
        id="Edit"
        component={EditComponent}
        schema={editSchema}
        durationInFrames={1}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{
          scenes: [
            {
              camera: {
                videoUrl:
                  "https://diwa7aolcke5u.cloudfront.net/uploads/4fce909b-5604-4f8d-8a86-d5962d7313a8.mp4",
                animationKeyframes: [
                  {
                    time: 0,
                    value: {
                      scale: 1,
                      blur: 10,
                    },
                  },
                  {
                    time: 1,
                    value: {
                      scale: 1.2,
                      blur: 0,
                    },
                  },
                ],
              },
              durationInFrames: 91.2,
            },
            {
              camera: {
                videoUrl:
                  "https://diwa7aolcke5u.cloudfront.net/uploads/5d613ac4-8c4b-47aa-bf06-22fe0d7a179f.mp4",
                animationKeyframes: [
                  {
                    time: 0,
                    value: {
                      scale: 1,
                      blur: 10,
                    },
                  },
                  {
                    time: 1,
                    value: {
                      scale: 1.2,
                      blur: 0,
                    },
                  },
                ],
              },
              durationInFrames: 129.60000000000002,
            },
            {
              camera: {
                videoUrl:
                  "https://diwa7aolcke5u.cloudfront.net/uploads/811637bc-cfd4-406e-8831-a56e3e05479e.mp4",
                animationKeyframes: [
                  {
                    time: 0,
                    value: {
                      scale: 1,
                      blur: 10,
                    },
                  },
                  {
                    time: 1,
                    value: {
                      scale: 1.2,
                      blur: 0,
                    },
                  },
                ],
              },
              durationInFrames: 248.39999999999998,
            },
            {
              camera: {
                videoUrl:
                  "https://diwa7aolcke5u.cloudfront.net/uploads/70322735-953b-41f2-b5d9-54fd50ae4549.mp4",
                animationKeyframes: [
                  {
                    time: 0,
                    value: {
                      scale: 1,
                      blur: 10,
                    },
                  },
                  {
                    time: 1,
                    value: {
                      scale: 1.2,
                      blur: 0,
                    },
                  },
                ],
              },
              durationInFrames: 631.1999999999999,
            },
          ],
          global: {
            captions: {
              words: [{ word: "", start: 0, end: 0 }],
              position: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                horizontalAlign: "start" as const,
                verticalAlign: "start" as const,
              },
              multiColors: ["#F7C500"],
              combineTokensWithinMilliseconds: 0,
              activeWordStyle: "font-size: 130px;",
            },
          },
        }}
        calculateMetadata={editCalculateMetadata}
      />
    </>
  )
}
