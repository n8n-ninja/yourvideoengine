import { json, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const message = url.searchParams.get("msg") || "Unknown error"

  const errorMessages: Record<string, string> = {
    missing_tokens: "Authentication failed: Missing access or refresh tokens",
    not_authenticated: "You are not authenticated",
    default: "An error occurred during authentication",
  }

  const errorMessage = errorMessages[message] || errorMessages.default

  return json({ error: errorMessage })
}

export function meta() {
  return [
    { title: "Authentication Error - Your Video Engine" },
    { name: "description", content: "An error occurred during authentication" },
  ]
}

export default function ErrorPage() {
  const { error } = useLoaderData<{ error: string }>()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Authentication Error</h1>
      <div className="text-red-500 text-center max-w-md p-4 border border-red-200 rounded-lg bg-red-50">
        <p>{error}</p>
      </div>
      <div className="mt-6">
        <a
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Login
        </a>
      </div>
    </div>
  )
}
