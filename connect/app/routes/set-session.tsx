// app/routes/set-session.tsx

import { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { initSupabaseServerClient } from "~/lib/supabase.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("set-session")

  const response = new Response()

  const url = new URL(request.url)
  const access_token = url.searchParams.get("access_token")
  const refresh_token = url.searchParams.get("refresh_token")

  if (!access_token || !refresh_token) {
    return new Response("Missing tokens", { status: 400 })
  }

  const { supabase } = initSupabaseServerClient(request, response)

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  })

  if (error) {
    console.error("❌ setSession failed:", error.message)
    return new Response("Auth failed", { status: 401 })
  }

  response.headers.set("Location", "/select-client")
  return new Response(null, {
    status: 302,
    headers: response.headers,
  })
}

export const config = {
  runtime: "edge",
}
