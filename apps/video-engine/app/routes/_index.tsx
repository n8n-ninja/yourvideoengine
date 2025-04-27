import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { FiftyFifty } from "~/components/FiftyFifty"
import { WhatWeCanBuild } from "~/components/WhatWeCanBuild"
import { UseCasesSlider, type UseCase } from "~/components/UseCasesSlider"
import { SelectedProjects, type Project } from "~/components/SelectedProjects"

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

// Définir les projets
const projects: Project[] = [
  {
    title: "Real Estate News Video Engine",
    label: "Premium Real Estate Agency",
    type: "client",
    metrics: "6h",
    metricsLabel: "saved per video",
    description:
      "Built a custom video production system combining intelligent automation with human creative control. Agents submit key story elements via a form, validate the AI-generated script, and receive a fully produced, branded video ready to engage their audience.",
    highlights: [
      {
        text: "Smart intake form capturing key story elements and agent preferences.",
      },
      {
        text: "AI-assisted script writing with human validation for quality and authenticity.",
      },
      {
        text: "Automated video creation including avatar presentation, captions, thematic b-roll, and branding.",
      },
      {
        text: "Fast turnaround for publishing real estate news, updates, and market insights.",
      },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "Real Estate News Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "Real Estate News Demo 2",
        thumbnail:
          "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "Real Estate News Demo 3",
        thumbnail:
          "https://images.unsplash.com/photo-1628745277866-8b306a277de7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
    ],
    videoOrientation: "vertical",
  },
  {
    title: "Health & Wellness Video Content System",
    label: "Health Supplements Brand",
    type: "client",
    metrics: "27%",
    metricsLabel: "engagement increase",
    description:
      "Designed a custom video production system generating trend-driven, educational short videos for the wellness industry. From ideation to final editing, each video aligns perfectly with the brand's voice and audience expectations.",
    highlights: [
      {
        text: "Trend mining and content ideation based on audience interests and product positioning.",
      },
      {
        text: "Scriptwriting aligned with brand voice and educational storytelling.",
      },
      { text: "Intelligent b-roll matching from curated visual libraries." },
      {
        text: "Automated video assembly with branded style, captions, and distribution.",
      },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "Wellness Video Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "Wellness Video Demo 2",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "Wellness Video Demo 3",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "Wellness Video Demo 4",
      },
    ],
    videoOrientation: "vertical",
  },
  {
    title: "Automated AI Newsfeed",
    label: "Internal Project",
    type: "intern",
    metrics: "100%",
    metricsLabel: "automated production",
    description:
      "Built a daily content engine combining automated research, visual hook creation, script writing, and AI voice cloning to publish high-quality AI news videos — fully autonomously.",
    highlights: [
      { text: "Automated trending topic research via Perplexity AI." },
      { text: "Visual hook creation for each video to maximize attention." },
      {
        text: "Script writing and voice cloning for natural, brand-aligned delivery.",
      },
      { text: "Full video generation and daily publishing." },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "AI Newsfeed Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "AI Newsfeed Demo 2",
      },
    ],
    videoOrientation: "vertical",
  },
  {
    title: "AI Tool Review Factory",
    label: "AI Product Reviews",
    type: "intern",
    metrics: "100%",
    metricsLabel: "automated production",
    description:
      "Developed a smart system for creating structured AI tool reviews. Tools are hand-selected, analyzed via web research, and transformed into ready-to-publish video reviews with clear narratives and branded styling.",
    highlights: [
      {
        text: "Human curation of featured tools based on strategic and market relevance.",
      },
      { text: "Web research-assisted feature analysis and value extraction." },
      {
        text: "Smart script writing focused on strengths, weaknesses, and benefits.",
      },
      {
        text: "Cross-platform video generation with branded style and captions.",
      },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "AI Tool Review Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1633412802994-5c058f151b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "AI Tool Review Demo 2",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "AI Tool Review Demo 3",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "AI Tool Review Demo 4",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "AI Tool Review Demo 5",
      },
    ],
    videoOrientation: "vertical",
  },
  {
    title: "AI Automation Inspiration Channel",
    label: "Innovation Lab",
    type: "intern",
    metrics: "100%",
    metricsLabel: "automated production",
    description:
      "Built an automated video engine crafting premium motion design content around AI automation ideas. Each video combines smart script generation, advanced motion design, and immersive soundscapes — offering full creative experiences without avatars or voiceovers.",
    highlights: [
      {
        text: "Automated script writing based on scenario ideation and storytelling.",
      },
      {
        text: "Advanced motion design with dynamic typography, iconography, and brand elements.",
      },
      {
        text: "Premium sound design to build emotional resonance and atmosphere.",
      },
      {
        text: "Fully autonomous video assembly with premium aesthetic standards.",
      },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "Inspiration Channel Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "Inspiration Channel Demo 2",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "Inspiration Channel Demo 3",
      },
    ],
    videoOrientation: "vertical",
  },
  {
    title: "AI Course Amplifier System",
    label: "Educational Platform",
    type: "intern",
    metrics: "97%",
    metricsLabel: "time saved",
    description:
      "Created a system that automates course content amplification — from video uploads and thumbnail generation to SEO-optimized descriptions and multichannel promotional workflows — maximizing reach without manual effort.",
    highlights: [
      { text: "Automated video upload to learning platforms or YouTube." },
      { text: "Smart thumbnail generation aligned with course branding." },
      {
        text: "AI-assisted title, description, and SEO copywriting for each lesson.",
      },
      {
        text: "Automated posting and repurposing across social media and blogs.",
      },
    ],
    videos: [
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-02743.mp4",
        title: "Course Amplifier Demo 1",
        thumbnail:
          "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-25-07093.mp4",
        title: "Course Amplifier Demo 2",
      },
      {
        url: "https://assets.json2video.com/clients/Xbircb8Q6d/renders/2025-04-26-77742.mp4",
        title: "Course Amplifier Demo 3",
      },
    ],
    videoOrientation: "horizontal",
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

      <SelectedProjects
        title="Selected Projects"
        description={[
          "Here are a few examples of custom systems we've built for clients or for our own use.",
        ]}
        projects={projects}
      />
    </main>
  )
}
