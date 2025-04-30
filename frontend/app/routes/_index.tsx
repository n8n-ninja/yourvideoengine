import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { FiftyFifty } from "~/components/FiftyFifty"
import { WhatWeCanBuild } from "~/components/WhatWeCanBuild"
import { UseCasesSlider } from "~/components/UseCasesSlider"
import { SelectedProjects, type Project } from "~/components/SelectedProjects"
import { Pricing } from "~/components/Pricing"
import { Testimonials } from "~/components/Testimonials"
import { FAQ } from "~/components/FAQ"
import { TechnologyExpertise } from "~/components/TechnologyExpertise"
import { WhoWeAre } from "~/components/WhoWeAre"
import { FinalCTA } from "~/components/FinalCTA"
import { FormattedText } from "~/components/FormattedText"
import { HighlightBox } from "~/components/ui/highlight-box"
import { useRef } from "react"
import { BackgroundGlow } from "~/components/BackgroundGlow"
import homeContent from "~/data/home-content.json"

export const meta: MetaFunction = () => {
  return [
    { title: homeContent.meta.title },
    {
      name: "description",
      content: homeContent.meta.description,
    },
  ]
}

const projects = homeContent.selectedProjects.projects.map(
  (project): Project => ({
    ...project,
    videoOrientation: project.videoOrientation as "vertical" | "horizontal",
  })
)

export default function Index() {
  const sectionRef = useRef<HTMLElement>(null)
  const useCaseMarkerRef = useRef<HTMLDivElement>(null)
  const technologyMarkerRef = useRef<HTMLDivElement>(null)

  return (
    <main ref={sectionRef} className="min-h-screen text-foreground">
      <BackgroundGlow
        sectionRef={sectionRef}
        useCaseMarkerRef={useCaseMarkerRef}
        technologyMarkerRef={technologyMarkerRef}
      />

      <HeroBanner
        title={homeContent.hero.title}
        subtitle={homeContent.hero.subtitle}
        primaryCta={homeContent.hero.primaryCta}
      />

      <FiftyFifty imagePosition="right" colorTheme="purple">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
          {homeContent.whatWeOffer.title}
        </h2>
        {homeContent.whatWeOffer.paragraphs.map((paragraph, index) => (
          <div key={index} className="text-lg text-left mb-6 text-gray-100">
            <FormattedText text={paragraph} />
          </div>
        ))}
      </FiftyFifty>

      <StatsRotator stats={homeContent.stats} intervalMs={5000} />

      <FiftyFifty imagePosition="left" colorTheme="blue">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
          {homeContent.videoAutomation.title}
        </h2>
        {homeContent.videoAutomation.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg text-left mb-6 text-gray-100">
            <FormattedText text={paragraph} />
          </p>
        ))}
        <HighlightBox>
          <p className="text-lg text-left text-gray-100">
            <FormattedText text={homeContent.videoAutomation.highlight} />
          </p>
        </HighlightBox>
      </FiftyFifty>

      <WhatWeCanBuild
        title={homeContent.whatWeCanBuild.title}
        description={homeContent.whatWeCanBuild.description}
        categories={homeContent.whatWeCanBuild.categories}
      />

      {/* Marker div pour le fade-out du glow */}
      <div ref={useCaseMarkerRef} className="h-1 w-full"></div>

      <UseCasesSlider
        title={homeContent.useCases.title}
        description={homeContent.useCases.description}
        useCases={homeContent.useCases.items}
      />

      <SelectedProjects
        title={homeContent.selectedProjects.title}
        description={homeContent.selectedProjects.description}
        projects={projects}
      />

      <Pricing
        title={homeContent.pricing.title}
        description={homeContent.pricing.description}
        ctaLabel={homeContent.pricing.ctaLabel}
        ctaHref={homeContent.pricing.ctaHref}
        setupFee={homeContent.pricing.setupFee}
        monthlyFee={homeContent.pricing.monthlyFee}
        footerText={homeContent.pricing.footerText}
      />

      <Testimonials
        title={homeContent.testimonials.title}
        description={homeContent.testimonials.description}
        testimonials={homeContent.testimonials.items}
      />

      {/* Marker div pour le fade-in du glow */}
      <div ref={technologyMarkerRef}></div>

      <TechnologyExpertise
        title={homeContent.technologyExpertise.title}
        description={homeContent.technologyExpertise.description}
        categories={homeContent.technologyExpertise.categories}
        customDevelopment={homeContent.technologyExpertise.customDevelopment}
      />

      <WhoWeAre
        title={homeContent.whoWeAre.title}
        description={homeContent.whoWeAre.description}
        team={homeContent.whoWeAre.team}
      />

      <FAQ
        title={homeContent.faq.title}
        description={homeContent.faq.description}
        faqs={homeContent.faq.items}
      />

      <FinalCTA
        title={homeContent.finalCta.title}
        ctaText={homeContent.finalCta.ctaText}
        ctaHref={homeContent.finalCta.ctaHref}
      />
    </main>
  )
}
