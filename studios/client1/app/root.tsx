import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import { initSupabaseServerClient } from "~/lib/supabase.server"
import { AppSidebar } from "~/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import styles from "./tailwind.css?url"
import { getRedirectUrl } from "~/utils/get-redirect-url"
import { getConnectUrl } from "@monorepo/shared/index.server"

export const id = "root"

type LoaderData = {
  logoutUrl: string
  user: { email: string }
}
export type { LoaderData }

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

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const redirectUrl = getRedirectUrl()
  const response = new Response()
  const { getUser, verifyClientAccess } = initSupabaseServerClient(
    request,
    response,
  )

  try {
    const user = await getUser()
    const hasAccess = await verifyClientAccess(request)

    if (!user || !hasAccess) {
      throw redirect(redirectUrl)
    }

    return {
      user,
      logoutUrl: `${getConnectUrl()}/logout`,
    }
  } catch (error) {
    console.log(error)
    throw redirect(redirectUrl)
  }
}

export type RootLoaderData = Awaited<ReturnType<typeof loader>>

export function Layout({ children }: { children: React.ReactNode }) {
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
          <div className="flex flex-col flex-grow m-4 rounded-xl border">
            <div className="flew-grow p-4 border-b">
              <SidebarTrigger />
            </div>

            <main>{children}</main>
          </div>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
