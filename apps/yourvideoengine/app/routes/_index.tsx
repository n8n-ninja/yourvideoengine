import type { MetaFunction } from "@remix-run/node"
import { HeroBanner } from "~/components/HeroBanner"
import { WhatWeOffer } from "~/components/WhatWeOffer"

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
      <WhatWeOffer
        title="What We Offer"
        paragraphs={[
          "Each system we build is designed specifically for you, based on your goals, your content style, and your existing workflows.",
          "We craft robust, intelligent engines that automate what can be automated — so you can focus on where your creativity brings the most value.",
        ]}
      />
    </main>
  )
}
