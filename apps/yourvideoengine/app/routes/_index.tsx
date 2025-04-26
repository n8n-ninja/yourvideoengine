import type { MetaFunction } from "@remix-run/node"
import { HeroBanner } from "~/components/HeroBanner"

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Landing Page - Fancy Buttons" },
    {
      name: "description",
      content: "Une landing page Remix avec des boutons stylisés",
    },
  ]
}

export default function Index() {
  return (
    <main className="min-h-screen  text-foreground">
      <HeroBanner
        title="Create Beautiful Websites"
        subtitle="Votre projet mérite d'avoir un style unique. Démarrez avec notre template moderne."
        primaryCta={{
          text: "Get Started",
          href: "/get-started",
        }}
      />
    </main>
  )
}
