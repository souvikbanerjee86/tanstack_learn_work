import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'
import type { NavUserProps } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/web/app-sidebar'
import { getUserFn } from '@/lib/auth'
import { userRoleQueryOptions } from '@/lib/server-function'
import { GlobalSearchDialog } from '@/components/web/global-search-dialog'
import { OnboardingTourDialog } from '@/components/web/onboarding-tour-dialog'
import { ThemeToggle } from '@/components/web/theme-toggle'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const role = await context.queryClient.ensureQueryData(userRoleQueryOptions)
    return { role }
  },
  component: RouteComponent,
  loader: async () => {
    const user = await getUserFn()
    return user
  },
})

const routeTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/jobs': 'Jobs Pipeline',
  '/dashboard/jobs/add': 'Add Position',
  '/dashboard/candidates': 'Candidates',
  '/dashboard/import': 'Archive Bank',
  '/dashboard/discover': 'AI Discovery',
  '/dashboard/interview': 'Interview Outcomes',
  '/dashboard/questions': 'Question Bank',
  '/dashboard/email-sync': 'Email Sync',
  '/dashboard/admin-user': 'Admin Management',
  '/dashboard/config': 'Configurations',
}

function RouteComponent() {
  const user: NavUserProps = Route.useLoaderData()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)

  // Calculate breadcrumb current section
  const currentPath = location.pathname.replace(/\/$/, '') || '/dashboard'
  const currentSection =
    routeTitles[currentPath] ||
    (currentPath.startsWith('/dashboard/jobs/') ? 'Job Details' : 'Dashboard')

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="bg-transparent">
        <header className="glass-header sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:px-8 border-b border-border/40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all">
          {/* Left: Sidebar Toggle & Section Title */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl hover:bg-muted/60 transition-all border border-border/40 shadow-sm" />
            <Separator orientation="vertical" className="h-4 opacity-30" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/60 hidden sm:inline">
                Intelligence
              </span>
              <span className="text-xs font-medium text-muted-foreground/40 hidden sm:inline">
                /
              </span>
              <span className="text-sm font-bold text-foreground truncate">
                {currentSection}
              </span>
            </div>
          </div>

          {/* Right: Global Search Trigger, Feature Tour Trigger & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search Trigger */}
            <Button
              variant="outline"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center justify-between gap-4 h-9 px-3 w-60 lg:w-72 rounded-xl border-border/60 bg-muted/30 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all text-xs font-medium shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Search or jump to...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Mobile Search Trigger Icon */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="md:hidden h-9 w-9 rounded-xl border-border/60 bg-muted/30 hover:bg-muted/70 shadow-sm"
              aria-label="Open Global Search"
            >
              <Search className="h-4 w-4 text-foreground" />
            </Button>

            {/* Feature Tour Trigger Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTourOpen(true)}
              className="h-9 px-3 rounded-xl border-border/60 bg-muted/30 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 text-xs font-bold transition-all shadow-xs gap-1.5 cursor-pointer"
              title="Interactive Platform Tour"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Tour</span>
            </Button>

            <Separator orientation="vertical" className="h-4 opacity-30" />

            {/* Theme Toggle */}
            <div className="[&_button]:h-9 [&_button]:w-9 [&_button]:rounded-xl [&_button]:border-border/60 [&_button]:bg-muted/30 [&_button]:hover:bg-muted/70 [&_button]:shadow-sm">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <Outlet />
        </div>
      </SidebarInset>

      {/* Global Search Palette Modal */}
      <GlobalSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onOpenTour={() => setTourOpen(true)}
      />

      {/* Interactive Feature Tour Walkthrough (Auto-shows on 1st visit, cached in localStorage) */}
      <OnboardingTourDialog open={tourOpen} onOpenChange={setTourOpen} />
    </SidebarProvider>
  )
}
