import { AbsoluteFill, staticFile, Sequence, Audio } from "remotion"
import { z } from "zod"
import { theme } from "./theme"
import { ThemeProvider } from "@theme/ThemeProvider"
import * as Layout from "@/components/layout/index"
import { TextElectric } from "@components/TextElectric"
import { LoopingBackgroundVideo } from "@components/VideoLoop"

// === Schema ===

export const DemoShortsSchema = z.object({
  text: z.string(),
})

// === Main Composition ===

export const DemoShortsComposition: React.FC<
  z.infer<typeof DemoShortsSchema>
> = ({ text }) => {
  return (
    <ThemeProvider theme={theme}>
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "black",
          fontFamily: theme.fonts.body,
        }}
      >
        <LoopingBackgroundVideo
          src="video/background-forge.mp4"
          durationPerLoop={86}
        />

        {/* Background Music */}
        <Audio src={staticFile("music/forge-music.mp3")} volume={0.5} />

        {/* Intro */}
        <Sequence durationInFrames={90}>
          <Layout.Center>
            <Layout.Padding>
              <TextElectric
                timing={{
                  from: 10,
                }}
                style={{ fontFamily: theme.fonts.title }}
              >
                {text}
              </TextElectric>
            </Layout.Padding>
          </Layout.Center>
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  )
}
