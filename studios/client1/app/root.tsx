import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import { createSupabaseServerClient } from "~/lib/supabase.server"
import { AppSidebar } from "~/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar"
import { verifyClientAccess } from "~/lib/verifyAccess"
import styles from "./tailwind.css?url"
import { getRedirectUrl } from "~/utils/get-redirect-url"

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
  const redirectUrl = getRedirectUrl()
  const response = new Response()
  const supabase = createSupabaseServerClient(request, response)

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return redirect(redirectUrl)
    }

    const hasAccess = await verifyClientAccess(request, user.id)

    if (!hasAccess) {
      return redirect(redirectUrl)
    }

    return new Response(JSON.stringify({ user }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return redirect(redirectUrl)
  }
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
