import { AbsoluteFill, Sequence } from "remotion"
import { z } from "zod"
import { theme } from "./theme"
import { ThemeProvider } from "@theme/ThemeProvider"
import * as Layout from "@/components/layout/index"
import { TextElectric } from "@components/TextElectric"

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
