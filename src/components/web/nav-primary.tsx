
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { NavPrimaryProps } from "@/lib/types"


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
                                >
                                    <Link 
                                        to={item.to} 
                                        activeOptions={item.activeOptions}
                                        activeProps={{ className: "bg-primary/10 text-primary font-black" }}
                                        className="flex items-center gap-3 px-4 transition-all duration-300 hover:bg-muted/50"
                                    >
                                        {/* Active Indicator Bar */}
                                        <div className="absolute left-[2px] top-[20%] bottom-[20%] w-[3px] bg-primary rounded-full transition-all duration-300 scale-y-0 opacity-0 group-[.active]:scale-y-100 group-[.active]:opacity-100" />
                                        
                                        <item.icon className="h-5 w-5 transition-transform duration-300 group-hover/item:scale-110" />
                                        
                                        <span className="text-sm font-semibold tracking-tight transition-all duration-300">
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
