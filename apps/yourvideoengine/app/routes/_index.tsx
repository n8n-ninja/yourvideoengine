import type { MetaFunction } from "@remix-run/node"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { FiftyFifty } from "~/components/FiftyFifty"
import { WhatWeCanBuild } from "~/components/WhatWeCanBuild"

export const meta: MetaFunction = () => {
  return [
    { title: "Tailored AI Video Automation System" },
    {
      name: "description",
      content:
        "Streamline your video production with a custom AI-powered engine.",
    },
  ]
}

export default function Index() {
  return (
    <main className="min-h-screen text-foreground">
      <HeroBanner
        title="Tailored AI Video Automation System"
        subtitle="Streamline your video production with a custom AI-powered engine."
        primaryCta={{
          text: "Tell us about your project",
          href: "/contact",
        }}
      />

      <FiftyFifty
        title="What We Offer"
        paragraphs={[
          "Each system we build is designed specifically for you, based on your goals, your content style, and your existing workflows.",
          "We craft robust, intelligent engines that automate what can be automated — so you can focus on where your creativity brings the most value.",
        ]}
        imagePosition="right"
        colorTheme="purple"
      />

      <StatsRotator
        stats={[
          "91% of businesses use video as a marketing tool today. (Wyzowl, 2024)",
          "78% of people watch videos online every week. (HubSpot)",
          "Companies that use video marketing grow revenue 49% faster than non-video users. (WordStream)",
          "92% of mobile video consumers share videos with others. (Insivia)",
          "Video content is 12 times more likely to be shared than text and images combined. (SmallBizTrends)",
        ]}
        intervalMs={5000}
      />

      <FiftyFifty
        title="Why Smart Video Automation Matters"
        paragraphs={[
          "Video is no longer optional — it's the core of communication today.",
          "But producing high-quality, frequent content is time-consuming, expensive, and operationally heavy.",
          "Thanks to recent advances in AI (video generation, voice cloning, script writing, sound design, image creation...), it's now possible to automate much of the heavy lifting.",
          "At the same time, human creativity remains irreplaceable to create content that truly connects and stands out.",
          "Our systems automate repetitive tasks and streamline production, freeing up your resources for what matters most: creativity, strategy, and authentic impact.",
        ]}
        imagePosition="left"
        colorTheme="blue"
      />

      <WhatWeCanBuild
        title="What We Can Build For You"
        description={[
          "We design tailored production engines by assembling the right building blocks for your needs.",
        ]}
      />
    </main>
  )
}
