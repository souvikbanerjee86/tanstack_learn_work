import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/web/app-sidebar'
import { getUserFn } from '@/lib/auth'
import { userRoleQueryOptions } from '@/lib/server-function'
import { NavUserProps } from '@/lib/types'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard')({
    beforeLoad: async ({ context }) => {
        const role = await context.queryClient.ensureQueryData(userRoleQueryOptions)
        return { role }
    },
    component: RouteComponent,
    loader: async () => {
        const user = await getUserFn()
        return user
    }
})

function RouteComponent() {
    const user: NavUserProps = Route.useLoaderData()

    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-border/5 px-6 transition-all">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/10 shadow-sm" />
                        <Separator
                            orientation="vertical"
                            className="h-4 opacity-20"
                        />
                        <div className="flex items-center gap-2">
                             {/* Optional: Add a subtle breadcrumb or status here if needed */}
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
