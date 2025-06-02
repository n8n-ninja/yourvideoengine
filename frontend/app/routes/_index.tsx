import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
import { StatsRotator } from "~/components/StatsRotator"
import { WhatWeOffer } from "~/components/WhatWeOffer"
import { ValueProposition } from "~/components/ValueProposition"
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
import { useRef, lazy, Suspense, useState, useEffect } from "react"
import { BackgroundGlow } from "~/components/BackgroundGlow"
import homeContent from "~/data/home-content.json"
import { PerformanceMonitor } from "~/components/Performance/PerformanceMonitor"

const Scene3D = lazy(() => import("~/components/Scene3D/Scene3D"))
import type {
  FormationName,
  FormationTrigger,
} from "~/components/Scene3D/Scene3D"

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
  }),
)

export default function Index() {
  const sectionRef = useRef<HTMLElement>(null)
  const useCaseMarkerRef = useRef<HTMLDivElement>(null)
  const technologyMarkerRef = useRef<HTMLDivElement>(null)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Synchroniser l'état des stats avec le mode développement
  useEffect(() => {
    // Désactiver les stats en production si nécessaire
    if (process.env.NODE_ENV === "production") {
      setShowPerformanceMonitor(false)
    }

    // Raccourci clavier global pour activer/désactiver le moniteur
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "p") {
        setShowPerformanceMonitor((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const section4Ref = useRef<HTMLDivElement>(null)
  const section5Ref = useRef<HTMLDivElement>(null)
  const section6Ref = useRef<HTMLDivElement>(null)
  const section6eRef = useRef<HTMLDivElement>(null)
  const section7Ref = useRef<HTMLDivElement>(null)
  const section8Ref = useRef<HTMLDivElement>(null)

  const formationTriggers: FormationTrigger[] = [
    { elementRef: section1Ref, formation: "organic" as FormationName },
    { elementRef: section2Ref, formation: "grid" as FormationName },
    { elementRef: section3Ref, formation: "alternateGrid" as FormationName },
    {
      elementRef: section4Ref,
      formation: "alternateGridFinal" as FormationName,
    },
    { elementRef: section5Ref, formation: "showcase" as FormationName },
    { elementRef: section6Ref, formation: "circle" as FormationName },
    { elementRef: section6eRef, formation: "circle" as FormationName },
    { elementRef: section7Ref, formation: "column" as FormationName },

    { elementRef: section8Ref, formation: "arch" as FormationName },
  ]

  return (
    <main ref={sectionRef} className="min-h-screen text-foreground">
      <div className="fixed top-0 left-0 w-screen h-screen z-[-1] hidden lg:block">
        <Suspense>
          <Scene3D formationTriggers={formationTriggers} smoothFactor={0.1} />
        </Suspense>
      </div>

      {/* Moniteur de performance indépendant */}
      {showPerformanceMonitor && (
        <PerformanceMonitor
          defaultShowStats={true}
          defaultShowDetailedPerf={false}
          position="top-right"
          targetCanvasId="scene3d-canvas"
        />
      )}

      <div
        style={{
          backgroundImage: 'url("bg-mobile.webp")',
        }}
        className="bg-cover opacity-30 bg-center fixed top-0 left-0 w-screen h-screen z-[-1] block lg:hidden"
      ></div>

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

      <div ref={section1Ref}></div>

      <section className="py-16 md:py-24 flex flex-col gap-12">
        <WhatWeOffer>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
            {homeContent.whatWeOffer.title}
          </h2>
          {homeContent.whatWeOffer.paragraphs.map((paragraph, index) => (
            <div key={index} className="text-lg text-left mb-6 text-gray-100">
              <FormattedText text={paragraph} />
            </div>
          ))}
        </WhatWeOffer>

        <div ref={section2Ref}></div>

        <ValueProposition highlightText={homeContent.videoAutomation.highlight}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-left">
            {homeContent.videoAutomation.title}
          </h2>
          {homeContent.videoAutomation.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-left mb-6 text-gray-100">
              <FormattedText text={paragraph} />
            </p>
          ))}
        </ValueProposition>
      </section>

      <div ref={section3Ref}></div>

      <WhatWeCanBuild
        title={homeContent.whatWeCanBuild.title}
        description={homeContent.whatWeCanBuild.description}
        categories={homeContent.whatWeCanBuild.categories}
        footer={homeContent.whatWeCanBuild.footer}
      />

      <div className="absolute -mt-[600px]" ref={section4Ref}></div>

      <div ref={useCaseMarkerRef} className="h-1 w-full"></div>

      <UseCasesSlider
        title={homeContent.useCases.title}
        description={homeContent.useCases.description}
        useCases={homeContent.useCases.items}
      />

      <StatsRotator stats={homeContent.stats} intervalMs={5000} />

      <div ref={section5Ref}></div>

      <SelectedProjects
        title={homeContent.selectedProjects.title}
        description={homeContent.selectedProjects.description}
        projects={projects}
      />

      <div ref={section6Ref}></div>

      <Pricing
        title={homeContent.pricing.title}
        description={homeContent.pricing.description}
        ctaLabel={homeContent.pricing.ctaLabel}
        ctaHref={homeContent.pricing.ctaHref}
        setupFee={homeContent.pricing.setupFee}
        monthlyFee={homeContent.pricing.monthlyFee}
        footerText={homeContent.pricing.footerText}
      />

      <div ref={section6eRef}></div>

      {/* <Testimonials
        title={homeContent.testimonials.title}
        description={homeContent.testimonials.description}
        testimonials={homeContent.testimonials.items}
      /> */}

      <div className="absolute -mt-[500px]" ref={section7Ref}></div>

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

      <div ref={section8Ref}></div>

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
