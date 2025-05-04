import { Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Shield } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-red-100 p-4">
          <Shield className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Accès non autorisé
        </h1>

        <p className="text-muted-foreground">
          Vous n&apos;avez pas les permissions nécessaires pour accéder à ce
          client.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
