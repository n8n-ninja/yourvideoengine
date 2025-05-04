import * as React from "react"
import { LayoutDashboard, Database, LogOut } from "lucide-react"
import { useLoaderData, Link } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import type { LoaderData } from "~/root"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logoutUrl } = useLoaderData<LoaderData>()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="text-xl font-bold p-4">Your Video Engine</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <div className="border-t p-3 flex flex-col items-start gap-2">
        <p className="text-sm text-muted-foreground">{user.email}</p>

        <Button asChild>
          <Link to={logoutUrl} type="submit" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  )
}
