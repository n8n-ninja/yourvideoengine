import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { FiftyFifty } from "~/components/FiftyFifty"
import {
  WhatWeCanBuild,
  type ServiceCategoryData,
} from "~/components/WhatWeCanBuild"
import { UseCasesSlider, type UseCase } from "~/components/UseCasesSlider"
import { SelectedProjects, type Project } from "~/components/SelectedProjects"
import { Pricing } from "~/components/Pricing"
import { Testimonials } from "~/components/Testimonials"
import { FAQ } from "~/components/FAQ"
import { TechnologyExpertise } from "~/components/TechnologyExpertise"
import { WhoWeAre } from "~/components/WhoWeAre"
import { FinalCTA } from "~/components/FinalCTA"
import { FormattedText } from "~/components/FormattedText"
import { HighlightBox } from "~/components/ui/highlight-box"

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
    intro: "Transform listings into high-conversion video tours.",
    bullets: [
      { text: "Automated video generation from listing details." },
      { text: "Dynamic voiceovers or avatar presentations." },
      { text: "Branded intros, outros, and customizations." },
      { text: "Cross-posting to multiple platforms." },
    ],
  },
  {
    number: 2,
    name: "Online Course Factory",
    title: "Scale your education content into a professional academy.",
    intro: "Transform curriculum into polished, modular video lessons.",
    bullets: [
      { text: "Automated script generation from course outlines." },
      { text: "Avatar or voiceover video lessons with your branding." },
      { text: "Modular editing with premium motion design." },
      { text: "Ready-to-publish content for learning platforms." },
    ],
  },
  {
    number: 3,
    name: "Founder Clone System",
    title: "Be everywhere without being everywhere.",
    intro: "Clone your presence for videos without constant filming.",
    bullets: [
      { text: "AI-powered video clones for routine communications." },
      { text: "On-demand FAQ and announcement videos." },
      { text: "Consistent branding across all messages." },
      { text: "Automated scheduling and publishing." },
    ],
  },
  {
    number: 4,
    name: "Weekly Authority Broadcast",
    title: "Publish a weekly expert show without weekly effort.",
    intro: "Produce consistent expert content without the exhaustion.",
    bullets: [
      { text: "Automated scripts from market trends and brand themes." },
      { text: "Professional avatar or voiceover delivery." },
      { text: "Branded editing with motion design elements." },
      { text: "Automatic distribution to YouTube, LinkedIn, and podcasts." },
    ],
  },
  {
    number: 5,
    name: "Product Launch Video Machine",
    title: "Turn product features into complete video campaigns.",
    intro: "Transform feature rollouts into multi-format video campaigns.",
    bullets: [
      { text: "Rapid video production for releases and updates." },
      { text: "Custom templates aligned with your brand." },
      { text: "AI-generated teasers, demos, and tutorials." },
      { text: "Multichannel publishing with tracking." },
    ],
  },
  {
    number: 6,
    name: "Membership Video Hub",
    title: "Fuel your community with fresh, automated content.",
    intro: "Keep members engaged without exhausting your team.",
    bullets: [
      { text: "Weekly content production on autopilot." },
      { text: "Personalized member spotlights and announcements." },
      { text: "Branded video editing for community tone." },
      { text: "Direct publishing to Skool, Circle, or Discord." },
    ],
  },
  {
    number: 7,
    name: "Franchise Video Replication",
    title: "Localized branded videos at scale.",
    intro: "Replicate videos with location-specific adaptations.",
    bullets: [
      { text: "Templates adapted automatically per region." },
      { text: "Location-specific intros, offers, and CTAs." },
      { text: "AI voiceovers in multiple languages." },
      { text: "Simultaneous publishing to all local channels." },
    ],
  },
]

// Définir les projets
const projects: Project[] = [
  {
    title: "Real Estate News Video Engine",
    label: "Real Estate",
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
    label: "Marketing",
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
    label: "News",
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
    label: "Reviews",
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
    label: "Motion",
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
    label: "Education",
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

// Données pour WhatWeCanBuild
const serviceCategories: ServiceCategoryData[] = [
  {
    title: "Automated Research & Scriptwriting",
    colorClass: "from-blue-500 to-purple-500",
    services: [
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
    ],
  },
  {
    title: "Automated Video Creation",
    colorClass: "from-pink-500 to-purple-500",
    services: [
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
        title: "Automated B-roll",
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
    ],
  },
  {
    title: "Automated Publishing & Scaling",
    colorClass: "from-purple-500 to-blue-500",
    services: [
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

      <FiftyFifty imagePosition="right" colorTheme="purple">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
          What We Offer
        </h2>
        <div className="text-lg text-left mb-6 text-gray-100">
          <FormattedText text="Each system we build is designed **specifically for you**, based on your goals, content style, and existing workflows." />
        </div>
        <div className="text-lg text-left mb-6 text-gray-100">
          <FormattedText text="We craft robust, **intelligent engines** that automate what can be automated so you can focus on where your creativity brings the most value." />
        </div>
      </FiftyFifty>

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

      <FiftyFifty imagePosition="left" colorTheme="blue">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
          Video Automation Matters
        </h2>
        <p className="text-lg text-left mb-6 text-gray-100">
          <FormattedText text="Video is the core of communication." />
        </p>
        <p className="text-lg text-left mb-6 text-gray-100">
          <FormattedText text="But producing high-quality, frequent content is **time-consuming,** expensive, and operationally heavy. Thanks to recent advances in AI (video generation, voice cloning, script writing, sound design, image creation...), it's now possible to **automate much of the heavy lifting**." />
        </p>
        <p className="text-lg text-left mb-6 text-gray-100">
          <FormattedText text="At the same time, **human creativity remains irreplaceable** to create content that truly connects and stands out." />
        </p>
        <HighlightBox>
          <p className="text-lg text-left text-gray-100">
            <FormattedText text="Our systems automate repetitive tasks and streamline production, **so you save time.**" />
          </p>
        </HighlightBox>
      </FiftyFifty>

      <WhatWeCanBuild
        title="What We Can Build For You"
        description={[
          "We design tailored production engines by assembling the right building blocks.",
        ]}
        categories={serviceCategories}
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

      <Pricing
        title="Pricing"
        description={[
          "Every system we build is unique and so is its investment.",
        ]}
        ctaLabel="Tell us about your project"
        ctaHref="/contact"
        setupTitle="Setup Fee"
        setupDescription="A one-time investment to create your tailored video engine."
        setupItems={[
          "Custom system architecture design",
          "Development and integration",
          "Initial setup and configuration",
          "Onboarding and training",
        ]}
        monthlyTitle="Monthly Plan"
        monthlyDescription="Ongoing support to keep your system running smoothly."
        monthlyItems={[
          "System hosting and infrastructure",
          "Monitoring and maintenance",
          "Technical support",
          "Minor updates and improvements",
        ]}
        footerText="Our solutions are crafted for serious businesses and creators ready to invest in high-quality, time-saving automation."
      />

      <Testimonials
        title="What Our Clients Say"
        description={[
          "Discover how our video automation solutions have transformed workflows and boosted productivity for businesses across industries.",
        ]}
        testimonials={[
          {
            quote:
              "The custom video system developed for our real estate agency has completely revolutionized our content strategy. We're now able to publish stunning property videos in a fraction of the time, giving us a major edge over competitors.",
            author: "Alexandra Martin",
            role: "Marketing Director",
            company: "Premier Properties",
          },
          {
            quote:
              "As an online educator, I was spending 70% of my time on video production rather than curriculum development. This AI video system has flipped that ratio, letting me focus on what truly matters - creating exceptional learning experiences.",
            author: "Michael Chen",
            role: "Founder",
            company: "TechEd Academy",
          },
          {
            quote:
              "Our product launch videos used to take weeks to produce. Now we can create professional, branded videos for each feature release in just hours. The ROI has been incredible, both in time saved and increased engagement.",
            author: "Sarah Johnson",
            role: "Product Lead",
            company: "Innovate Solutions",
          },
        ]}
      />

      <TechnologyExpertise
        title="Technology & Expertise"
        description={[
          "Each system is crafted using the right tools for your needs.",
        ]}
        categories={[
          {
            title: "Core Technologies We Use",
            description:
              "The foundation of every system we build relies on these powerful tools and platforms.",
            items: [
              { name: "Video Editing", category: "category" },
              { name: "Remotion", category: "video" },
              { name: "Json2Video", category: "video" },
              { name: "Creatomate", category: "video" },

              { name: "AI Research & Text Generation", category: "category" },
              { name: "OpenAI", category: "ai-research" },
              { name: "Perplexity AI", category: "ai-research" },
              { name: "DeepSeek", category: "ai-research" },

              { name: "AI Content Generation", category: "category" },
              { name: "HeyGen", category: "content" },
              { name: "Runway", category: "content" },
              { name: "MidJourney", category: "content" },
              { name: "Sora", category: "content" },
              { name: "Flux", category: "content" },
              { name: "ElevenLabs", category: "content" },

              { name: "Publishing", category: "category" },
              { name: "Matricool", category: "publishing" },
              { name: "Blotato", category: "publishing" },
              { name: "Postiz", category: "publishing" },

              { name: "Infrastructure", category: "category" },
              { name: "AWS", category: "infra" },
              { name: "Cloudflare", category: "infra" },
            ],
          },
          {
            title: "Seamless Integrations",
            description:
              "We build systems that fit into your existing workflows and connect with your favorite tools.",
            items: [
              { name: "Trello" },
              { name: "Google Workspace" },
              { name: "WordPress" },
              { name: "Pipedrive" },
              { name: "Zoho" },
              { name: "HubSpot" },
              { name: "Slack" },
              { name: "Notion" },
              { name: "Airtable" },
              { name: "Mailchimp" },
              { name: "N8n" },
              { name: "Make" },
            ],
          },
          {
            title: "Content Distribution Channels",
            description:
              "Get your videos out to the world through all the platforms that matter to your audience.",
            items: [
              { name: "YouTube" },
              { name: "TikTok" },
              { name: "Instagram" },
              { name: "LinkedIn" },
              { name: "Twitter" },
              { name: "Facebook" },
            ],
          },
        ]}
      />

      <WhoWeAre
        title="Who We Are"
        description={[
          "A team of senior professionals combining technical expertise, creative strategy, and AI innovation.",
        ]}
        team={[
          {
            name: "Manu",
            role: "Senior Engineer",
            location: "Switzerland",
            description:
              "Manu brings 20 years of experience in software development, AI automation, and advanced video production workflows. He specializes in building robust, scalable systems that combine efficiency, creativity, and precision — with a focus on smart automation that serves, not replaces, human creativity.",
          },
          {
            name: "Thais",
            role: "Business Strategist & AI Consultant",
            location: "Brazil",
            description:
              "Thais is a marketing expert and AI strategist with a strong background in content creation, branding, and prompt engineering. She designs strategies that bridge technology and storytelling, helping brands harness AI-driven workflows without losing authenticity or strategic depth.",
          },
        ]}
      />

      <FAQ
        title="Frequently Asked Questions"
        description={[
          "Everything you need to know about our video automation systems.",
        ]}
        faqs={[
          {
            question: "How much does it cost?",
            answer:
              "Every system we build is tailored to your specific needs and goals. After sharing a few details about your project, you'll receive a personalized estimate covering the setup and monthly plan.",
          },
          {
            question: "What's included in the monthly plan?",
            answer:
              "The monthly plan covers hosting, monitoring, maintenance, and support — ensuring your system remains stable and fully operational. Major upgrades or new developments are handled through separate quotes.",
          },
          {
            question: "What happens if I want to evolve my system later?",
            answer:
              "If you need new features, expansions, or structural changes, we'll define a custom roadmap and quote accordingly. You keep full control over how your system evolves over time.",
          },
          {
            question: "Can I update content myself once the system is live?",
            answer:
              "Yes — most systems are designed with simple, intuitive interfaces to trigger new content creation or updates without needing technical skills. You focus on the creative input; we handle the technical complexity.",
          },
          {
            question: "How long does it take to build my system?",
            answer:
              "Most systems are delivered within 3 to 6 weeks after kickoff, depending on the scope and complexity of the project.",
          },
          {
            question:
              "Are third-party service costs (like HeyGen, OpenAI, ElevenLabs) included?",
            answer:
              "It depends on the setup. If you already have active subscriptions, we can connect your system to them. If not, we can use our own access where possible, or recommend the best approach based on your needs.",
          },
          {
            question: "Is the system fully automated?",
            answer:
              "In most cases, no. We automate repetitive and time-consuming tasks to save you time, reduce costs, and let you focus where your creativity and expertise create the most value. Key steps are usually kept under your control to maintain quality, authenticity, and strategic alignment.",
          },
        ]}
      />

      <FinalCTA
        title="Ready to transform your content creation?"
        ctaText="Tell us about your project"
        ctaHref="/contact"
      />
    </main>
  )
}
