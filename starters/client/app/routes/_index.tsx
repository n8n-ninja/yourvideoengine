import type { MetaFunction } from "@remix-run/cloudflare"
import { SignUpForm } from "~/components/SignUpForm"
import { LogoutButton } from "~/components/LogoutButton"
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
      <h1>Welcome to Client Studio</h1>
      <SignUpForm />
      <LogoutButton />
    </main>
  )
}
