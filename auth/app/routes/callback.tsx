// app/routes/callback.tsx
import { useEffect } from "react"

export default function Callback() {
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    if (access_token && refresh_token) {
      const redirectUrl = new URL("/set-session", window.location.origin)
      redirectUrl.searchParams.set("access_token", access_token)
      redirectUrl.searchParams.set("refresh_token", refresh_token)

      console.log(redirectUrl.toString())

      window.location.replace(redirectUrl.toString())
    } else {
      console.error("Missing tokens in callback URL")
    }
  }, [])

  return <p>Authenticating...</p>
}
