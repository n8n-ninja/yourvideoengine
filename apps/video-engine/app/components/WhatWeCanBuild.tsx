import { ServiceCategory, type Service } from "~/components/ServiceCategory"

export interface WhatWeCanBuildProps {
  title: string
  description: string[]
}

export function WhatWeCanBuild({ title, description }: WhatWeCanBuildProps) {
  const researchServices: Service[] = [
    {
      title: "Trending topic discovery",
      description:
        "Identify trending themes and conversations inside your industry to generate relevant, high-performing ideas.",
    },
    {
      title: "Information research",
      description:
        "Use AI-driven and human-validated methods to gather key insights and data for your content.",
    },
    {
      title: "Script generation",
      description:
        "Automatically draft and refine scripts for different formats — short videos, educational pieces, promotional content...",
    },
  ]

  const videoCreationServices: Service[] = [
    {
      title: "AI video and voice cloning",
      description:
        "Create realistic clones for consistent video and voice outputs without the need for constant filming.",
    },
    {
      title: "AI-generated images and videos",
      description:
        "Produce supporting visuals using advanced AI models (images, B-roll, dynamic elements).",
    },
    {
      title: "Automated B-roll ",
      description:
        "Automatically find, match, or generate complementary footage to enrich your video production.",
    },
    {
      title: "Captions and subtitle generation",
      description:
        "Auto-generate captions and subtitles in multiple languages for accessibility and reach.",
    },
    {
      title: "Motion design",
      description:
        "Collaborate with top-tier motion designers to bring life, energy, and emotion to your videos when needed — always aligned with your creative direction.",
    },
    {
      title: "Visual branding integration",
      description:
        "Apply your brand identity consistently across all outputs: logos, colors, typography, intro/outro animations, and more.",
    },
  ]

  const publishingServices: Service[] = [
    {
      title: "Automated video editing",
      description:
        "Implement smart assembly systems to automatically edit and finalize videos based on custom templates and rules.",
    },
    {
      title: "Cross-platform publishing",
      description:
        "Distribute content automatically across platforms like YouTube, TikTok, Instagram, LinkedIn, and more — formatted for each.",
    },
    {
      title: "Content repurposing",
      description:
        "Extract blog posts, social media snippets, or newsletters from video content to maximize impact.",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {title}
        </h2>

        <div className="mb-14 max-w-4xl mx-auto">
          {description.map((paragraph, index) => (
            <p key={index} className="text-lg text-center mb-4 text-gray-100">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-gray-700/50">
          <ServiceCategory
            title="Automated Research & Scriptwriting"
            services={researchServices}
            colorClass="from-blue-500 to-purple-500"
          />

          <ServiceCategory
            title="Automated Video Creation"
            services={videoCreationServices}
            colorClass="from-pink-500 to-purple-500"
          />

          <ServiceCategory
            title="Publishing & Scaling"
            services={publishingServices}
            colorClass="from-purple-500 to-blue-500"
          />
        </div>
      </div>
    </section>
  )
}
