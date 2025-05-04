// app/routes/select-client.tsx

import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { initSupabaseServerClient } from "~/lib/supabase.server"
import { getClientUrl } from "@monorepo/shared/index.server"

interface Client {
  id: string
  name: string
  slug: string
  url: string
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getUser, getClientsForUser } = initSupabaseServerClient(request)

  console.log("select-client")

  const user = await getUser()

  if (!user) return redirect("/")

  const clients = (await getClientsForUser(user.id)).map((client) => ({
    ...client,
    url: getClientUrl(client.slug),
  }))

  if (clients.length === 1 && clients[0]) {
    const clientUrl = getClientUrl(clients[0].slug)
    console.log("redirecting to", clientUrl)
    // return redirect(clientUrl)
  }

  return { clients }
}

export default function Index() {
  const { clients } = useLoaderData<{ clients: Client[] }>()

  console.log(clients)

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center">Select a client</h1>
        <div className="flex flex-col gap-2">
          {clients.map((client) => (
            <a
              key={client.id}
              href={client.url}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              {client.name}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export const config = {
  runtime: "edge",
}
