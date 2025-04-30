import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { supabase } from "~/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

export const meta: MetaFunction = () => {
  return [
    { title: "Data - YourVideoEngine" },
    {
      name: "description",
      content: "YourVideoEngine Data Management",
    },
  ]
}

type ManubData = {
  id: string // Changé en string car c'est un UUID
  title: string
  content: string
  created_at: string
}

export const loader: LoaderFunction = async () => {
  // Récupérer l'utilisateur depuis la session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from(`${user?.app_metadata.client_slug}_data`)
    .select("*")

  if (error) {
    console.error("Supabase error:", error)
    throw new Error(`Error fetching data: ${error.message}`)
  }

  return { data, user }
}

export default function Data() {
  const { data, user } = useLoaderData<{
    data: ManubData[]
    user: User
  }>()

  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Data Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Data Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Content</th>
                <th className="px-6 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{row.id}</td>
                  <td className="px-6 py-4">{row.title}</td>
                  <td className="px-6 py-4">{row.content}</td>
                  <td className="px-6 py-4">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Debug Information</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({ data, user }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
