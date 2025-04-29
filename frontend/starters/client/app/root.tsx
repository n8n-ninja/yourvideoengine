import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare"
import { json, redirect } from "@remix-run/cloudflare"
import { authenticateWithToken, getSession } from "~/lib/auth.server"
import { supabase } from "~/lib/supabaseClient"
import { AppSidebar } from "~/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar"
import styles from "./tailwind.css?url"

// Add route ID for useRouteLoaderData
export const id = "root"

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
]

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("access_token")

  if (accessToken) {
    const response = await authenticateWithToken(request)
    if (response) {
      return response
    }
  }

  try {
    const session = await getSession(request)
    const userId = session.get("userId")

    if (userId) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        throw error || new Error("No user found")
      }

      return json({ user })
    }
  } catch (error) {
    // En cas d'erreur, rediriger vers l'authentification
  }

  // Redirection vers la page d'authentification
  const isLocalhost =
    url.hostname === "localhost" || url.hostname === "127.0.0.1"
  const redirectUrl = isLocalhost
    ? "http://localhost:3000"
    : "https://connect.yourvideoengine.com"

  return redirect(redirectUrl)
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
