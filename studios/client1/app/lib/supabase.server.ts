import { createServerClient } from "@supabase/ssr"
import type { Database } from "~/types/supabase"

const isProd = process.env.NODE_ENV === "production"
const domain = isProd ? ".yourvideoengine.com" : ".yourvideoengine.local"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const createSupabaseServerClient = (
  request: Request,
  response: Response
) => {
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
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
}
