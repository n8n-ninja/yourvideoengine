import type { MetaFunction } from "@remix-run/cloudflare"
import { useEffect } from "react"
import { useNavigate } from "@remix-run/react"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

export default function Index() {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash.substring(1) // remove the #
    const params = new URLSearchParams(hash)

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")
    const expires_in = params.get("expires_in")
    const type = params.get("type")

    if (!access_token) {
      console.error("No access_token found in URL fragment")
      return
    }

    try {
      const payload = JSON.parse(atob(access_token.split(".")[1])) as {
        email: string
        app_metadata: {
          client_slug: string
        }
      }

      const isProd = window.location.hostname !== "localhost"
      let redirectUrl = ""

      if (isProd) {
        redirectUrl = `https://${payload.app_metadata.client_slug}.client.yourvideoengine.com`
      } else {
        redirectUrl = "http://localhost:4000"
      }

      // Construire l'URL finale avec les paramètres
      const finalRedirectUrl = `${redirectUrl}/?access_token=${encodeURIComponent(
        access_token
      )}&refresh_token=${encodeURIComponent(refresh_token || "")}&expires_in=${
        expires_in || ""
      }&type=${type || ""}`

      // Rediriger
      window.location.href = finalRedirectUrl
    } catch (error) {
      console.error("Failed to parse access_token", error)
    }
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Processing authentication...</h1>
      <p>Please wait while we redirect you.</p>
    </div>
  )
}
