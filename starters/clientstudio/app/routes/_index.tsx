import type { MetaFunction } from "@remix-run/cloudflare"
import { useUser } from "~/hooks/use-user"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - YourVideoEngine" },
    {
      name: "description",
      content: "YourVideoEngine Dashboard",
    },
  ]
}

export default function Index() {
  const user = useUser()

  return (
    <div className="p-8">
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}
