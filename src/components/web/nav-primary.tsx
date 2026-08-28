import { Link } from '@tanstack/react-router'
import type { NavPrimaryProps } from '@/lib/types'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavPrimary({ items }: NavPrimaryProps) {
  return (
    <SidebarGroup className="py-6">
      <SidebarGroupContent>
        <SidebarMenu className="gap-2 px-1">
          {items.map((item, index) => {
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className="group/item transition-all duration-300 relative rounded-xl"
                  tooltip={item.title}
                >
                  <Link
                    to={item.to}
                    activeOptions={item.activeOptions}
                    activeProps={{
                      className:
                        'bg-primary/10 text-primary font-bold shadow-xs border border-primary/20',
                    }}
                    inactiveProps={{
                      className:
                        'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent',
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover/item:scale-110" />

                    <span className="text-sm tracking-tight transition-all duration-200 group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
