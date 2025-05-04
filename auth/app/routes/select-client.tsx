import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare"
import { createSupabaseServerClient } from "~/lib/supabase.server"

interface Client {
  id: string
  name: string
  slug: string
}

const isProd = process.env.NODE_ENV === "production"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.id) {
    return redirect("/", { headers: response.headers })
  }

  const { data, error } = await supabase
    .from("client_users")
    .select("client_id, clients:client_id(id, name, slug)")
    .eq("user_id", user.id)

  if (error) {
    console.error("🔴 Error fetching clients:", error.message)
    return new Response("Unable to fetch clients", { status: 500 })
  }

  const clients: Client[] = data.map((row) => row.clients as Client)

  if (clients.length === 1) {
    const client = clients[0]
    const redirectUrl = isProd
      ? `https://${client.slug}.studio.yourvideoengine.com`
      : `http://${client.slug}.studio.yourvideoengine.local:4000`

    return redirect(redirectUrl, { headers: response.headers })
  }

  return new Response(JSON.stringify({ clients }), {
    headers: {
      ...Object.fromEntries(response.headers),
      "Content-Type": "application/json",
    },
  })
}

export const config = {
  runtime: "edge",
}
