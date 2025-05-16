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
              durationInFrames: 219,
              camera: {
                videoUrl:
                  "https://aiatelier.s3.eu-west-1.amazonaws.com/temporary-uploads/1747260842473-thais-demo-1.mp4",
              },
              captions: {
                words: [{ word: "defefezfze", start: 0, end: 114 }],
                position: {
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  horizontalAlign: "center" as const,
                  verticalAlign: "center" as const,
                },
                boxStyle: "",
                textStyle: "color: red;",
                activeWordStyle: "color: blue;",
                multiColors: [],
                combineTokensWithinMilliseconds: 0,
              },
            },
            {
              durationInFrames: 219,
              camera: {
                videoUrl:
                  "https://aiatelier.s3.eu-west-1.amazonaws.com/temporary-uploads/1747260842473-thais-demo-1.mp4",
              },
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
              multiColors: [""],
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
