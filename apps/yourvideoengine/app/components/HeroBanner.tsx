import { FancyButton } from "~/components/ui/fancy-button"

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
    <section
      className={`w-full min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-12`}
    >
      <div className="max-w-3xl mx-auto py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="flex gap-8 justify-center mt-8">
          <FancyButton href={primaryCta.href}>{primaryCta.text}</FancyButton>
        </div>
      </div>
    </section>
  )
}
