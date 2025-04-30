import { FancyButton } from "~/components/FancyButton"

export interface HeroBannerCta {
  text: string
  href?: string
}

export interface HeroBannerProps {
  title: string
  subtitle: string
  primaryCta: HeroBannerCta
  backgroundClass?: string
}

export function HeroBanner({ title, subtitle, primaryCta }: HeroBannerProps) {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center px-6 md:px-12">
      <div className="max-w-3xl mx-auto py-16 md:py-40">
        <h1 className="relative text-4xl md:text-6xl font-bold mb-8 leading-tight">
          {title}
        </h1>
        <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto  text-balance leading-relaxed">
          {subtitle}
        </p>
        <div className="flex gap-8 justify-center mt-4">
          <FancyButton href={primaryCta.href}>{primaryCta.text}</FancyButton>
        </div>
      </div>
    </section>
  )
}
