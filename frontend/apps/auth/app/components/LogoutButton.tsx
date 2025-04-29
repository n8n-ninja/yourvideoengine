import { supabase } from "~/lib/supabaseClient"

export function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return <button onClick={handleLogout}>Logout</button>
}
