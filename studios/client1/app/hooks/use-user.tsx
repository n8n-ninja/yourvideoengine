import { useRouteLoaderData } from "@remix-run/react"
import type { User } from "@supabase/supabase-js"

/**
 * Hook to access the authenticated user anywhere in the app.
 * This hook must be used in components that are rendered inside the root route.
 */
export function useUser() {
  const data = useRouteLoaderData("root") as { user: User } | undefined

  if (!data?.user) {
    throw new Error(
      "No user found in root loader. useUser() must be used in a component that is rendered inside the root route."
    )
  }

  return data.user
}
