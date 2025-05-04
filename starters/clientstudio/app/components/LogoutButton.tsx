import { Link } from "@remix-run/react"
import { useUser } from "~/hooks/use-user"
import { LogOut } from "lucide-react"
import { getRedirectUrl } from "~/utils/get-redirect-url"
import { Button } from "~/components/ui/button"
export function LogoutButton() {
  const user = useUser()
  const logoutUrl = `${getRedirectUrl()}/logout`
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm text-muted-foreground">{user.email}</p>

      <Button asChild>
        <Link to={logoutUrl} type="submit" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Link>
      </Button>
    </div>
  )
}
