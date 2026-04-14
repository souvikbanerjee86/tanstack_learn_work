import {
  BookMarkedIcon,
  CompassIcon,
  FileQuestionIcon,
  Import,
  LayoutDashboardIcon,
  MailIcon,
  MailsIcon,
  Users,
  Users2Icon
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
import { NavPrimaryProps, NavUserProps } from "@/lib/types"
import { Logo } from "./Logo"

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboardIcon,
    activeOptions: { exact: true }
  },
  {
    title: "Jobs",
    to: "/dashboard/jobs",
    icon: BookMarkedIcon,
    activeOptions: { exact: false }
  },
  {
    title: "Candidates",
    to: "/dashboard/candidates",
    icon: Users,
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
  {
    title: "Interview Email",
    to: "/dashboard/interview",
    icon: MailIcon,
    activeOptions: { exact: false }
  },
  {
    title: "Questions",
    to: "/dashboard/questions",
    icon: FileQuestionIcon,
    activeOptions: { exact: false }
  },
  {
    title: "Email-Sync",
    to: "/dashboard/email-sync",
    icon: MailsIcon,
    activeOptions: { exact: false }
  },
  {
    title: "Admin User",
    to: "/dashboard/admin-user",
    icon: Users2Icon,
    activeOptions: { exact: false }
  },
])

export function AppSidebar({ user }: { user: NavUserProps }) {
  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="py-6 border-b border-border/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent focus-visible:ring-0">
              <Link to="/">
                <Logo noLink size="md" subtitle="Intelligence Hub" />
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
