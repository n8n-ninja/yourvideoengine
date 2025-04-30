import type { MetaFunction } from "@remix-run/cloudflare"
import { HeroBanner } from "~/components/HeroBanner"
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

export default function Index() {
  return (
    <main className="min-h-screen">
      <HeroBanner
        title={homeContent.hero.title}
        subtitle={homeContent.hero.subtitle}
        primaryCta={homeContent.hero.primaryCta}
      />
    </main>
  )
}
