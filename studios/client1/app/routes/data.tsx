import type { MetaFunction } from "@remix-run/cloudflare"

export const meta: MetaFunction = () => {
  return [
    { title: "Data - YourVideoEngine" },
    {
      name: "description",
      content: "YourVideoEngine Data Management",
    },
  ]
}

export default function Data() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Data Management</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No data available</p>
      </div>
    </div>
  )
}
