// app/routes/logout.tsx

import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare"
import { initSupabaseServerClient } from "~/lib/supabase.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const supabase = initSupabaseServerClient(request)

  await supabase.auth.signOut()

  return redirect("/")
}

export const config = {
  runtime: "edge",
}
