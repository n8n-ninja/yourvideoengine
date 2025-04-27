import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { FiftyFifty } from "~/components/FiftyFifty"
import { WhatWeCanBuild } from "~/components/WhatWeCanBuild"
import { UseCasesSlider, type UseCase } from "~/components/UseCasesSlider"

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

// Définir les use cases
const useCases: UseCase[] = [
  {
    number: 1,
    name: "Real Estate Video Engine",
    title: "Turn property listings into stunning video tours.",
    intro:
      "The real estate market moves fast. With our system, you can instantly transform new listings into personalized, high-conversion video tours — ready to publish across platforms without human bottlenecks.",
    bullets: [
      { text: "Automated video generation from listing details and photos." },
      { text: "Dynamic voiceovers or avatar presentations for each property." },
      { text: "Branded intros, outros, and agent-specific customizations." },
      {
        text: "Cross-posting to YouTube, TikTok, Instagram, and agency websites.",
      },
    ],
  },
  {
    number: 2,
    name: "Online Course Factory",
    title: "Scale your education content into a professional  academy.",
    intro:
      "Educational content deserves better than talking-head Zoom recordings. Our system transforms your curriculum into polished, modular video lessons — helping you scale your offers without scaling your workload.",
    bullets: [
      { text: "Automated script generation from course outlines and notes." },
      { text: "Avatar or voiceover video lessons aligned with your brand." },
      {
        text: "Modular editing with motion design for premium user experience.",
      },
      {
        text: "Ready-to-publish lesson sequences for your learning platforms.",
      },
    ],
  },
  {
    number: 3,
    name: "Founder clone system",
    title: "Be everywhere without being everywhere.",
    intro:
      "Founders are the face of their brand, but time is limited. Our system clones your presence into dynamic, human-like videos for onboarding, FAQs, updates, and launches — keeping you visible without daily filming.",
    bullets: [
      { text: "AI-powered video clones for routine communication." },
      { text: "Personalized FAQ and announcement videos on-demand." },
      { text: "Seamless branding and style continuity across messages." },
      {
        text: "Scheduling and publishing automation to stay active effortlessly.",
      },
    ],
  },
  {
    number: 4,
    name: "Weekly Authority Broadcast",
    title: "Publish a weekly expert show without weekly effort.",
    intro:
      "Consistency builds authority — but it's exhausting. Our system produces a branded, ready-to-publish expert series each week, based on your ideas and positioning, without draining your energy.",
    bullets: [
      {
        text: "Automated script suggestions from market trends and brand themes.",
      },
      { text: "Video avatar or voiceover for expert delivery." },
      { text: "Branded editing with professional motion design." },
      {
        text: "Automatic scheduling and distribution across YouTube, LinkedIn, and podcasts.",
      },
    ],
  },
  {
    number: 5,
    name: "Product Launch Video Machine",
    title: "Turn every new product feature into a complete video campaign.",
    intro:
      "New products deserve more than rushed launch videos. Our system transforms your feature rollouts into structured, multi-format video campaigns — faster, smoother, and fully branded.",
    bullets: [
      {
        text: "Rapid video production for feature releases, updates, and announcements.",
      },
      { text: "Pre-designed launch templates customized for your brand." },
      {
        text: "AI-generated teasers, demos, and tutorials from simple briefs.",
      },
      { text: "Full multichannel publishing and campaign tracking." },
    ],
  },
  {
    number: 6,
    name: "Membership / Community Video Hub",
    title: "Fuel your private community with fresh, automated video content.",
    intro:
      "Member communities thrive on consistent value. Our system automates video content creation and publishing for your membership programs — keeping your audience engaged without exhausting your team.",
    bullets: [
      { text: "Weekly lesson or update video production on autopilot." },
      { text: "Personalized member spotlights and special announcements." },
      { text: "Automated video editing and branding for community tone." },
      {
        text: "Scheduled publishing inside your private hubs (Skool, Circle, Discord).",
      },
    ],
  },
  {
    number: 7,
    name: "Franchise Video Replication",
    title: "Expand your reach with localized branded videos at scale.",
    intro:
      "Franchise and multi-location brands need consistent messaging with local flavor. Our system replicates branded videos with location-specific adaptations — fast, accurate, and fully automated.",
    bullets: [
      { text: "Central brand templates adapted automatically per region." },
      { text: "Location-specific intros, addresses, offers, and CTAs." },
      { text: "AI-assisted video voiceover in multiple languages." },
      {
        text: "Simultaneous publishing to local social accounts and websites.",
      },
    ],
  },
]

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

      <UseCasesSlider
        title="Use Cases"
        description={[
          "From real estate to education, AI powered video automation is transforming content creation.",
        ]}
        useCases={useCases}
      />
    </main>
  )
}
