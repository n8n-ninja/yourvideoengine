import { createServerClient } from "@supabase/ssr"
import type { Database } from "./types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"
const isProd = process.env.NODE_ENV === "production"
const domain = isProd ? ".yourvideoengine.com" : ".yourvideoengine.local"

export const createSupabaseServerClient = (
  request: Request,
  response: Response,
  {
    supabaseUrl,
    supabaseKey,
  }: {
    supabaseUrl: string
    supabaseKey: string
  }
): {
  supabase: SupabaseClient
  getUser: () => Promise<any>
  getClientsForUser: (userId: string) => Promise<any[]>
  response: Response
} => {
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: async () => {
        const cookieHeader = request.headers.get("cookie") ?? ""
        return cookieHeader.split(";").map((cookie) => {
          const [name, ...rest] = cookie.trim().split("=")
          return {
            name,
            value: rest.join("="),
          }
        })
      },
      setAll: async (cookies) => {
        for (const { name, value } of cookies) {
          response.headers.append(
            "Set-Cookie",
            `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Domain=${domain}`
          )
        }
      },
    },
  })

  // logique métier embarquée (optionnel)
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    return data.user
  }

  const getClientsForUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("client_users")
      .select("client_id, clients:client_id(id, name, slug)")
      .eq("user_id", userId)

    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => row.clients)
  }

  return {
    supabase,
    getUser,
    getClientsForUser,
    response, // optionnel, si tu veux le retourner après
  }
}
