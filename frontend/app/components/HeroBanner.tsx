import { FancyButton } from "~/components/fancy-button"

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
      className={`w-full flex flex-col items-center justify-center text-center px-6 md:px-12`}
    >
      <div className="max-w-3xl mx-auto py-16 md:py-40">
        <h1 className="relative text-4xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <span className="absolute inset-0 bg-gradient-to-r from-white via-pink-300 to-white bg-clip-text text-transparent blur-[0.5px]">
            {title}
          </span>
          <span className="relative bg-gradient-to-br from-white via-purple-300 to-pink-200 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        <p className="text-2xl mb-12 max-w-3xl mx-auto text-balance leading-relaxed drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          {subtitle}
        </p>
        <div className="flex gap-8 justify-center mt-4">
          <FancyButton href={primaryCta.href}>{primaryCta.text}</FancyButton>
        </div>
      </div>
    </section>
  )
}
