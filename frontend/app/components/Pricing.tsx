import { FancyButton } from "~/components/ui/fancy-button"
import { SectionTitle } from "~/components/SectionTitle"

interface FeePlan {
  title: string
  description: string
  items: string[]
}

export interface PricingProps {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  setupFee: FeePlan
  monthlyFee: FeePlan
  footerText: string
}

export function Pricing({
  title,
  description,
  ctaLabel,
  ctaHref,
  setupFee,
  monthlyFee,
  footerText,
}: PricingProps) {
  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 md:-mt-30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <SectionTitle title={title} subtitle={description} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-800/30 backdrop-blur-md border border-purple-800/40 rounded-xl p-8 shadow-lg hover:shadow-purple-900/20 transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              {setupFee.title}
            </h3>
            <p className="mb-4 text-gray-300">{setupFee.description}</p>
            <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-pink-500/50 my-6"></div>
            <ul className="space-y-3 text-gray-300">
              {setupFee.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-pink-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/30 backdrop-blur-md border border-blue-800/40 rounded-xl p-8 shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {monthlyFee.title}
            </h3>
            <p className="mb-4 text-gray-300">{monthlyFee.description}</p>
            <div className="h-px w-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50 my-6"></div>
            <ul className="space-y-3 text-gray-300">
              {monthlyFee.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 italic mb-6">{footerText}</p>
          <div className="flex gap-8 justify-center mt-10">
            <FancyButton href={ctaHref}>{ctaLabel}</FancyButton>
          </div>
        </div>
      </div>
    </section>
  )
}
