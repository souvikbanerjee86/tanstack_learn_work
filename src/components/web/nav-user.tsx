

import {
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from 'firebase/auth'
import { logoutFn } from "@/lib/auth"
import { auth } from "@/lib/firebase"
import { useNavigate } from "@tanstack/react-router"
import { NavUserProps } from "@/lib/types"
export function NavUser({ user }: { user: NavUserProps }) {
    const { isMobile } = useSidebar()
    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await signOut(auth);
            await logoutFn();
            navigate({ to: "/" })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-16 px-3 bg-muted/30 hover:bg-muted/50 transition-all duration-300 rounded-2xl border border-border/10 shadow-sm group/user mt-4"
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 rounded-xl ring-2 ring-primary/5 group-hover/user:ring-primary/20 transition-all">
                                    <AvatarImage src={user?.picture ?? 'https://api.dicebear.com/9.x/glass/svg?seed=Aidan'} alt={user.name} />
                                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">{user?.name?.split(' ').map(name => name[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-500 border-2 border-background rounded-full" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                                <span className="truncate font-black tracking-tight">{user?.name}</span>
                                <span className="truncate text-[10px] text-muted-foreground uppercase font-bold opacity-60 tracking-wider">Intelligence Access</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground opacity-40 group-hover/user:opacity-100 transition-opacity" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-2xl border-border/40 shadow-2xl p-2"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={12}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-3 py-4 text-left">
                                <Avatar className="h-12 w-12 rounded-xl">
                                    <AvatarImage src={user?.picture ?? 'https://api.dicebear.com/9.x/glass/svg?seed=Aidan'} alt={user?.name ?? ''} />
                                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold">
                                        {user?.name?.split(' ').map(name => name[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-black tracking-tight text-base">{user?.name}</span>
                                    <span className="truncate text-xs text-muted-foreground font-medium opacity-70">{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-2 opacity-10" />
                        <DropdownMenuItem 
                            onClick={handleLogout}
                            className="h-12 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-[0.2em] w-full">
                                <LogOut className="size-4" />
                                <span>Terminate Session</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
