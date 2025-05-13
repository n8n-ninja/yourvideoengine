import { Composition, Series, getInputProps } from "remotion"
import { z } from "zod"
import { Captions, CaptionsSchema } from "@/components/Captions"
import { Camera, CameraSchema } from "@/components/Camera"
import { Title, TitlesSchema } from "@/components/Title"

type InputProps = {
  fps: number
  width: number
  height: number
  scenes: {
    captions: z.infer<typeof CaptionsSchema>
    camera: z.infer<typeof CameraSchema>
    titles: z.infer<typeof TitlesSchema>
    durationInFrames: number
  }[]
}

export const EditComponent = ({ scenes }: { scenes: InputProps["scenes"] }) => {
  return (
    <Series>
      {scenes.map((scene, index) => (
        <Series.Sequence durationInFrames={scene.durationInFrames} key={index}>
          <Camera {...scene.camera} />
          <Captions {...scene.captions} />
          <Title titles={scene.titles} />
        </Series.Sequence>
      ))}
    </Series>
  )
}

export const EditComposition = () => {
  const inputProps = getInputProps<InputProps>()

  const durationInFrames = 200
  const fps = inputProps.fps || 30
  const width = inputProps.width || 1080
  const height = inputProps.height || 1920

  return (
    <Composition
      id="Edit"
      component={EditComponent}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
      defaultProps={{
        scenes: [
          {
            captions: {
              words: [{ word: "test", start: 0, end: 1 }],
              fontSize: 70,
            },
            camera: {
              videoUrl:
                "https://files2.heygen.ai/aws_pacific/avatar_tmp/57ec360eba014be689b1992950c520f7/873be32229784da083ceac3b7eebefe0.mp4?Expires=1747395461&Signature=KBw-prseIuyekM~u~pN1vD3c~qJ2wDKe8ivG7bW3yolHza4AUh--MNHy3IuHpSEW12B5Ig4CWHnJlrnLhgWJJjHVV3d-uAfrkD3bzsslVx64AhpUtw2f2bAT-VXBaNN2hbQw7ZkZRflgiDTuuLT1PY~6hb1--g5ZMk4CfU0ENlYy4w~JvwagQfyYBc2Mdp0lhRp2NSrRzSoWZfEuUZSz825GWAQ51O6P09F8nRYn18rhBKktJ8Qx~LI1fuZkEmeMKHkBMiEMRlSyrQpfzqhCSZoqeImVUPT-0~YhR0U0jqklBJF5zaNWSGwDdpJW94NgSj-AgyyYVWmU~OQnIwzWXA__&Key-Pair-Id=K38HBHX5LX3X2H",
              keyframes: [
                {
                  time: 0,
                  scale: 1.02,
                  glitch: {
                    intensity: 10,
                    duration: 0.2,
                  },
                  vignette: {
                    intensity: 10,
                    size: 10,
                    color: "rgba(0,0,0,1)",
                  },
                },
                {
                  time: 1,
                  scale: 1.5,
                  easing: "ease-in-out",
                  vignette: {
                    intensity: 100,
                    size: 100,
                    color: "rgba(0,0,0,1)",
                  },
                },
              ],
            },
            titles: [
              {
                time: 0,
                title: "Hello world",
              },
            ],

            durationInFrames: 30,
          },
          {
            captions: {
              words: [{ word: "test2", start: 10, end: 1 }],
              fontSize: 80,
              fontFamily: "Arial",
              backgroundColor: "rgba(0,0,0,1)",
              top: 0,
            },
            camera: {
              videoUrl:
                "https://files2.heygen.ai/aws_pacific/avatar_tmp/c330096d4fe2412196a174937603458f/42a35d3bcbf042efa2baa3869f9fa37b.mp4?Expires=1747559878&Signature=PlgNZ1sbX6DuRa3JCLTWHzS8HXuRZ4qohrmQWVOd-wDuS60a0JhputRQLKqDr9eFc~-1LxyrkRd8SrYx4~5g9Z9D-OsbUKD-NnQKyfNSxCKBQt11mNU0uJw1RgZ9g5iW3XqZOFJ~ofHCHbaicYsiUbTJJGAWwPIwJ8xL6exbI7ZejwySIhng6lZNH7GhMb483UdKEgycolS2wuDjGpl15K8d0Zn6-7ZC~3IJLIhghlfDT5AmF9kfLeK3g6~9JS7~DwxNb6SErmWh0bfaFHkpYJUOW0y-ulMKygNvkS~i2jf9FkTK3DtJUeTZf3vtxUEa83CkITS3db5UFX00-zRJfA__&Key-Pair-Id=K38HBHX5LX3X2H",
              keyframes: [
                {
                  time: 0,
                  scale: 1.0,
                  blur: 10,
                },
                {
                  time: 0.1,
                  blur: 0,
                  scale: 1.5,
                },
              ],
            },
            titles: [
              {
                title: "Mon Titre Animé qui plait aux vieux et aux jeunes ",
                time: 1,
                duration: 3.2,
                titleInDuration: 0.5,
                titleOutDuration: 0.5,
                titleStartOffset: 0,
                letterAnimation: {
                  preset: "slide",
                  direction: "edges",
                  from: { opacity: 0, scale: 1.5 },
                  to: { opacity: 1, scale: 1 },
                },
                titleStyle: {
                  padding: 10,
                  textAlign: "center",
                },
                backgroundBox: {
                  style: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    borderRadius: 8,
                    padding: "10px",
                    width: "1000px",
                    margin: 0,
                    transformOrigin: "center center",
                  },
                  animation: {
                    from: {
                      opacity: 0,
                    },
                    to: {
                      opacity: 1,
                    },
                    exit: {
                      opacity: 0,
                    },
                    inDuration: 0.2,
                    easing: "easeOut",
                  },
                },
              },
            ],
            durationInFrames: 190,
          },
        ],
      }}
    />
  )
}
