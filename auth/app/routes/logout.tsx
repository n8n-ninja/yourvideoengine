import { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { createSupabaseServerClient } from "~/lib/supabase.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerClient(request, response)

  await supabase.auth.signOut()

  // Optionnel : rediriger vers la landing page d'auth
  response.headers.set("Location", "/")

  return new Response(null, {
    status: 302,
    headers: response.headers,
  })
}

export const config = {
  runtime: "edge",
}
