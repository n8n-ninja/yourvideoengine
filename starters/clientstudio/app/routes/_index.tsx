import type { MetaFunction } from "@remix-run/cloudflare"
import { useUser } from "~/hooks/use-user"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"

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
      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to YourVideoEngine</CardTitle>
            <CardDescription>
              {user
                ? `Hello ${user.email}! Manage and analyze your video content in one place`
                : "Manage and analyze your video content in one place"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Start creating and managing your video projects with our powerful
              tools and analytics.
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Last login:{" "}
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "Never"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
