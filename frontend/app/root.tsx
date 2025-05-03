import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "@remix-run/react"
import type { LinksFunction } from "@remix-run/cloudflare"
import { useEffect } from "react"
import * as gtag from "~/utils/gtags.client"
import styles from "./tailwind.css?url"
import glowStyles from "./styles/glow-background.css?url"

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
  { rel: "stylesheet", href: glowStyles },
  { rel: "stylesheet", href: styles },
]

export const loader = async () => {
  return { gaTrackingId: "G-1S646G4KGG" }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { gaTrackingId } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId)
    }
  }, [location, gaTrackingId])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <div className="glow-background">
          <div className="blob"></div>
        </div>
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (typeof window.gtag !== "undefined") {
      window.gtag("config", "'G-1S646G4KGG", {
        page_path: location.pathname,
      })
    }
  }, [location])

  return <Outlet />
}
