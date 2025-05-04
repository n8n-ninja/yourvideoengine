import { createSupabaseServerClient } from "~/lib/supabase.server"

export function getClientSlug(request: Request): string | null {
  const host = request.headers.get("host")

  if (!host) return null

  const slug = host.split(".")[0]
  return slug
}

export async function verifyClientAccess(
  request: Request,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  userId: string
): Promise<boolean> {
  const response = new Response()
  const supabase = createSupabaseServerClient(request, response)

  const clientSlug = getClientSlug(request)
  if (!clientSlug) return false

  const { data, error } = await supabase
    .from("client_users")
    .select("client_id, clients:client_id(id, name, slug)")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching client data:", error)
    return false
  }

  const client = data.find((item) => item.clients?.slug === clientSlug)

  return !!client
}
