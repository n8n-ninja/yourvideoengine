import { Form } from "@remix-run/react"
import { useUser } from "~/hooks/use-user"
import { Button } from "~/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const user = useUser()

  return (
    <Form action="/logout" method="post" className="w-full">
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <Button type="submit" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </Form>
  )
}
