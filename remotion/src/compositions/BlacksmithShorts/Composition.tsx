import { AbsoluteFill, staticFile, Sequence, Audio } from "remotion"
import { theme } from "./theme"
import { ThemeProvider } from "@theme/ThemeProvider"
import * as Layout from "@/components/layout/index"
import { TextElectric } from "@components/TextElectric"
import { LoopingBackgroundVideo } from "@components/VideoLoop"
import { AnimatedWords } from "@components/AnimatedWords"
import { z } from "zod"
import { BadgeNumber } from "@/components/BadgeNumber"
import { ImageReveal } from "@/components/ImageReveal"
import { AudioWithFade } from "@/components/AudioWithFade"
import { ImageWithTitle } from "@/components/ImageWithTitle"
import { HeroHammer } from "@/components/HeroHammer"
import { SerpentineLine } from "./SerpentineLine"
import { ForgeVideo } from "@/compositions/BlacksmithShorts/ForgeVideo"
import { SmokeTransition } from "@/compositions/BlacksmithShorts/SmokeTransition"

// === Schema ===
export const BlacksmithSchema = z.object({
  number: z.number(),
  problem: z.string(),
  hero_image: z.string(),
  solution_1: z.string(),
  solution_2: z.string(),
  steps: z.array(
    z.object({
      logo: z.string(),
      note: z.string(),
      node: z.string(),
    }),
  ),
})

// === Main Composition ===

export const BlacksmithComposition: React.FC<
  z.infer<typeof BlacksmithSchema>
> = ({ problem, number, hero_image, solution_1, solution_2, steps }) => {
  const sequecesDurations = {
    intro: 110,
    inputOutput: 180,
    logo: 170,
    steps: 135 * steps.length,
  }

  const numberToWord = (n: number) => {
    const words = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
    ]

    if (n < 0 || n > 12 || !Number.isInteger(n)) {
      throw new Error("Input must be an integer between 0 and 12.")
    }

    return words[n].toUpperCase()
  }

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
        <Sequence durationInFrames={sequecesDurations.intro}>
          <Layout.Top>
            <Layout.Padding>
              <TextElectric style={{ fontFamily: theme.fonts.title }}>
                AI AUTOMATION
                <br />
                SUPER POWER
              </TextElectric>
            </Layout.Padding>
          </Layout.Top>

          <Layout.Center>
            <BadgeNumber number={number} timing={{ from: 10 }} size={230} />
          </Layout.Center>

          <Layout.Bottom>
            <Layout.Padding horizontal={"lg"}>
              <AnimatedWords
                timing={{ from: 24 }}
                text={problem}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Bottom>
        </Sequence>

        {/* Input & Outout */}
        <Sequence
          from={sequecesDurations.intro}
          durationInFrames={sequecesDurations.inputOutput}
        >
          <Layout.Top>
            <Layout.Padding>
              <ImageReveal timing={{ duration: 200 }} image={hero_image} />
            </Layout.Padding>
          </Layout.Top>

          <Layout.Bottom>
            <Layout.Padding horizontal={"lg"}>
              <AnimatedWords
                timing={{ from: 10, duration: 90 }}
                text={solution_1}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Bottom>

          <Layout.Bottom>
            <Layout.Padding horizontal={"lg"}>
              <AnimatedWords
                timing={{ from: 100 }}
                text={solution_2}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Bottom>
        </Sequence>

        {/* Logo n8n */}
        <Sequence
          from={sequecesDurations.intro + sequecesDurations.inputOutput}
          durationInFrames={sequecesDurations.logo}
        >
          <Layout.Top>
            <Layout.Padding>
              <ImageWithTitle
                timing={{ from: 4, duration: 90 }}
                image={staticFile("logo/n8n.png")}
                title="BLACKSMITH TRAINING"
              />
            </Layout.Padding>
          </Layout.Top>

          <Layout.Bottom>
            <Layout.Padding>
              <AnimatedWords
                timing={{ from: 24, duration: 90 }}
                text={"This is how to build your own  n8n workflow..."}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Bottom>

          <Layout.Center>
            <Layout.Padding>
              <HeroHammer
                timing={{ from: 100 }}
                hammerWords={[
                  "IN",
                  numberToWord(steps.length),
                  "SIMPLE",
                  `STEP${steps.length > 1 ? "S" : ""}`,
                ]}
              />
            </Layout.Padding>
          </Layout.Center>

          <AudioWithFade
            src={staticFile("sound/fire.mp3")}
            maxVolume={0.2}
            fadeInDuration={20}
            fadeOutDuration={35}
          />
        </Sequence>

        {/* Steps */}
        <Sequence
          from={
            sequecesDurations.intro +
            sequecesDurations.inputOutput +
            sequecesDurations.logo -
            30
          }
          durationInFrames={sequecesDurations.steps}
        >
          <SerpentineLine steps={steps} />
        </Sequence>

        {/* Outro */}
        <Sequence
          from={
            sequecesDurations.intro +
            sequecesDurations.inputOutput +
            sequecesDurations.logo +
            sequecesDurations.steps -
            40
          }
          durationInFrames={390}
        >
          <Layout.Center>
            <Layout.Padding horizontal={"sm"}>
              <AnimatedWords
                style={{ fontFamily: theme.fonts.title }}
                timing={{ from: 35, duration: 100 }}
                text={"AI AUTOMATION OFFERS GREAT POWER"}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Center>

          <SmokeTransition
            timing={{ from: 0, duration: 140, fadeIn: 30, fadeOut: 90 }}
          />

          <AudioWithFade
            src={staticFile("sound/volcano.mp3")}
            maxVolume={1}
            fadeInDuration={20}
            fadeOutDuration={35}
          />

          <Layout.Top>
            <Layout.Padding horizontal={"lg"}>
              <AnimatedWords
                style={{
                  fontFamily: theme.fonts.title,
                  textTransform: "uppercase",
                }}
                timing={{ from: 125, duration: 100 }}
                text={"AND With great power comes..."}
                withGlow={"medium"}
              />
            </Layout.Padding>
          </Layout.Top>

          <Layout.Center>
            <TextElectric
              timing={{ from: 175, duration: 120 }}
              style={{ fontFamily: theme.fonts.title }}
            >
              GREAT POSSIBILITIES
            </TextElectric>
          </Layout.Center>

          <Layout.Top>
            <AnimatedWords
              style={{ textTransform: "uppercase" }}
              timing={{ from: 270 }}
              text={"Learn n8n now"}
              withGlow={"medium"}
            />
          </Layout.Top>

          <Layout.Center>
            <Layout.Padding>
              <ImageWithTitle
                timing={{ from: 310 }}
                image={staticFile("logo/n8n.png")}
                title="BLACKSMITH TRAINING"
              />
            </Layout.Padding>
          </Layout.Center>

          <Sequence from={210} durationInFrames={300}>
            <ForgeVideo
              timing={{
                from: 0,
                fadeIn: 100,
              }}
            />
          </Sequence>
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  )
}
