import { Sequence, OffthreadVideo, useVideoConfig, staticFile } from "remotion"

export const LoopingBackgroundVideo: React.FC<{
  src: string
  durationPerLoop: number
  overlap?: number
}> = ({ src, durationPerLoop, overlap = 2 }) => {
  const { durationInFrames } = useVideoConfig()
  const loopCount = Math.ceil(durationInFrames / (durationPerLoop - overlap))

  return (
    <>
      {Array.from({ length: loopCount }).map((_, i) => (
        <Sequence
          key={i}
          from={i * (durationPerLoop - overlap)}
          durationInFrames={durationPerLoop}
        >
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={0}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Sequence>
      ))}
    </>
  )
}
