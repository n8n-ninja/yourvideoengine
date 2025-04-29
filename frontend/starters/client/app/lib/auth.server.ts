import { createCookieSessionStorage, redirect } from "@remix-run/cloudflare"
import { supabase } from "./supabaseClient"

// Configuration du stockage de session
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "sb-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "default-secret-key"],
    secure: process.env.NODE_ENV === "production",
  },
})

// Obtenir la session actuelle
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie")
  return sessionStorage.getSession(cookie)
}

// Créer une nouvelle session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession()
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  })
}

// Vérifier si l'utilisateur est authentifié
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getSession(request)
  const userId = session.get("userId")
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

// Déconnecter l'utilisateur
export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  })
}

// Authentifier avec un token d'accès
export async function authenticateWithToken(request: Request) {
  const url = new URL(request.url)
  const accessToken = url.searchParams.get("access_token")
  const refreshToken = url.searchParams.get("refresh_token")

  if (accessToken) {
    try {
      // Vérifier d'abord si le token est valide
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(accessToken)

      if (userError || !user) {
        return null
      }

      // Configurer la session
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || "",
      })

      if (error || !data.session?.user) {
        return null
      }

      return createUserSession(data.session.user.id, "/")
    } catch (error) {
      return null
    }
  }

  return null
}
