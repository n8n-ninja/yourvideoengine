// app/lib/supabase.server.ts

import { createSupabaseServerClient } from "@monorepo/shared/index.server"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const initSupabaseServerClient = (
  request: Request,
  response: Response = new Response()
) => {
  return createSupabaseServerClient(request, response, {
    supabaseUrl,
    supabaseKey,
  })
}
