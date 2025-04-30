import { ActionFunction } from "@remix-run/cloudflare"
import { logout } from "~/lib/auth.server"
import { supabase } from "~/lib/supabaseClient"

export const action: ActionFunction = async ({ request }) => {
  // Déconnecter de Supabase
  await supabase.auth.signOut()

  // Supprimer le cookie de session
  return logout(request)
}
