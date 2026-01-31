
import * as React from "react"
import {
  BookMarkedIcon,
  BookmarkIcon,
  CompassIcon,
  Import
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavPrimary } from "./nav-primary"
import { NavUser } from "./nav-user"
import { Link, linkOptions } from "@tanstack/react-router"
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from "@/lib/firebase";
import { NavPrimaryProps } from "@/lib/types"

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: "Items",
    to: "/dashboard/items",
    icon: BookMarkedIcon,
    activeOptions: { exact: false }
  },
  {
    title: "Import",
    to: "/dashboard/import",
    icon: Import,
    activeOptions: { exact: false }
  },
  {
    title: "Discover",
    to: "/dashboard/discover",
    icon: CompassIcon,
    activeOptions: { exact: false }
  },
])

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<User | null>(null)
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();


  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center size-8 justify-center rounded-lg">
                  <BookmarkIcon className="size-4" />
                </div>
                <div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-medium">EasyAI</span>
                    <span className="text-xs">Your AI Recruiter</span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
