import type { MetaFunction } from "@remix-run/cloudflare"
import { LoginForm } from "~/components/login-form"

export const meta: MetaFunction = () => {
  return [
    { title: "Client Studio - Your Video Engine" },
    {
      name: "description",
      content:
        "Client Studio is your video engine. Create, edit, and publish videos with ease.",
    },
  ]
}

export default function Index() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </main>
  )
}
