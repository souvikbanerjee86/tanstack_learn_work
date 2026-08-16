import { adminUsersList } from '@/lib/server-function'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useMemo, useState } from 'react'
import { DataTable } from '@/components/web/data-table'
import { AdminUserSkeleton } from '@/components/web/admin-user-skeleton'
import { 
  Users, 
  Shield, 
  Lock, 
  Activity, 
  Command, 
  Mail, 
  Calendar, 
  Search, 
  X, 
  CheckCircle2, 
  Sparkles,
  Inbox,
  ShieldAlert
} from 'lucide-react'
import { getAdminColumns, RoleBadge, StatusBadge, AdminActions } from '@/components/web/admin-columns'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { UserData } from "@/lib/types"

export const adminsQueryOptions = queryOptions({
  queryKey: ['admins'],
  queryFn: () => adminUsersList(),
})

export const Route = createFileRoute('/dashboard/admin-user/')({
  beforeLoad: ({ context }) => {
    return { role: context.role.role }
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(adminsQueryOptions)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<AdminUserSkeleton />}>
      <CandidatesContent />
    </Suspense>
  )
}

function CandidatesContent() {
  const { role } = Route.useRouteContext()
  const { data } = useSuspenseQuery(adminsQueryOptions)
  const allUsers = data?.data ?? []

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'restricted'>('all')

  // Calculate statistics (Memoized)
  const { totalAdmins, activeAdmins, restrictedAdmins } = useMemo(() => {
    return {
      totalAdmins: allUsers.length,
      activeAdmins: allUsers.filter(u => u.user_role?.active && !u.disabled).length,
      restrictedAdmins: allUsers.filter(u => !u.user_role?.active || u.disabled).length
    }
  }, [allUsers])

  // Universal text search and status filter
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const tokens = query.split(/\s+/).filter(Boolean)

    return allUsers.filter((user) => {
      // Status filter
      const isActive = user.user_role?.active && !user.disabled
      if (statusFilter === 'active' && !isActive) return false
      if (statusFilter === 'restricted' && isActive) return false

      // If no search query, return true
      if (tokens.length === 0) return true

      // Searchable fields
      const formattedDate = user.created_at 
        ? format(new Date(parseInt(user.created_at)), "MMM dd yyyy MMM d") 
        : ""

      const searchableBlob = [
        user.display_name || "",
        user.email || "",
        user.uid || "",
        user.user_role?.role || "",
        formattedDate,
      ].join(" ").toLowerCase()

      return tokens.every((token) => searchableBlob.includes(token))
    })
  }, [allUsers, searchQuery, statusFilter])

  const hasFiltersApplied = searchQuery.trim().length > 0 || statusFilter !== 'all'

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Glow --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* --- Executive Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-border/40">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center border border-violet-500/20 shadow-xl shadow-violet-500/5 text-violet-600 dark:text-violet-400 relative overflow-hidden group shrink-0">
            <Command className="h-7 w-7 md:h-8 md:w-8 relative z-10 transition-transform group-hover:scale-110 duration-300" />
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Access & Governance</h1>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-2 py-0.5">
                {totalAdmins} Total
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Shield className="h-3.5 w-3.5 text-violet-500 shrink-0" />
              <span>Administrator credentials, granular permission controls, and account status protocols.</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="secondary" className="px-3 py-1.5 rounded-xl text-xs font-bold bg-muted/60 text-foreground border border-border/40">
            Current Session: <span className="text-violet-600 dark:text-violet-400 uppercase ml-1 font-mono">{role}</span>
          </Badge>
        </div>
      </div>

      {/* --- Interactive Statistics Strip --- */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
        <StatCard
          title="Total User Entities"
          value={totalAdmins.toString()}
          subtitle="Registered accounts"
          icon={<Users className="h-5 w-5" />}
          gradient="from-violet-500/15 to-transparent"
          isActive={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        <StatCard
          title="Active Protocols"
          value={activeAdmins.toString()}
          subtitle="Enabled & authorized"
          icon={<Activity className="h-5 w-5 text-emerald-500" />}
          gradient="from-emerald-500/15 to-transparent"
          isActive={statusFilter === 'active'}
          onClick={() => setStatusFilter('active')}
        />
        <StatCard
          title="Restricted Accounts"
          value={restrictedAdmins.toString()}
          subtitle="Suspended or inactive"
          icon={<Lock className="h-5 w-5 text-rose-500" />}
          gradient="from-rose-500/15 to-transparent"
          isActive={statusFilter === 'restricted'}
          onClick={() => setStatusFilter('restricted')}
        />
      </div>

      {/* --- Main Table/Card Section --- */}
      <div className="relative group p-4 sm:p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5 space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Universal Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, role, or UID..."
              className="pl-10 pr-9 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Buttons & Counter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all",
                  statusFilter === 'all'
                    ? "bg-violet-600 text-white shadow-sm hover:bg-violet-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5",
                  statusFilter === 'active'
                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Active ({activeAdmins})
              </Button>
              <Button
                variant={statusFilter === 'restricted' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('restricted')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5",
                  statusFilter === 'restricted'
                    ? "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <ShieldAlert className="h-3 w-3 text-rose-400" />
                Restricted ({restrictedAdmins})
              </Button>
            </div>

            <span className="text-xs font-medium text-muted-foreground/70 ml-1">
              Showing <strong className="text-foreground">{filteredUsers.length}</strong> of {allUsers.length} accounts
            </span>
          </div>
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block">
          {filteredUsers.length > 0 ? (
            <DataTable columns={getAdminColumns(role!)} data={filteredUsers} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/40 shadow-inner">
                <Inbox className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {hasFiltersApplied ? "No matching accounts found" : "No users identified"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {hasFiltersApplied
                    ? "Try adjusting your search query or status filter."
                    : "Administrator accounts will appear here once authenticated."}
                </p>
              </div>
              {hasFiltersApplied && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="h-8 rounded-xl text-xs font-bold border-border/60"
                >
                  Clear Search & Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Mobile View: Protocol Cards */}
        <div className="flex flex-col gap-4 lg:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserProtocolCard key={user.uid} user={user} currentUserRole={role!} />
            ))
          ) : (
            <div className="text-center py-16 bg-white/30 dark:bg-zinc-950/30 rounded-[2rem] border border-dashed border-border/40 p-6 space-y-3">
              <Inbox className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground font-medium">
                {hasFiltersApplied ? "No accounts match your search criteria." : "No administrators found."}
              </p>
              {hasFiltersApplied && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="h-8 rounded-xl text-xs font-bold border-border/60"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const UserProtocolCard = ({ user, currentUserRole }: { user: UserData, currentUserRole: string }) => {
  const displayName = user.display_name || user.email || "Unknown User"
  const photoUrl = user.photo_url || undefined

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 p-5 space-y-4 transition-all hover:border-violet-500/30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar className="h-11 w-11 rounded-xl border border-border/60 shadow-inner shrink-0">
            <AvatarImage src={photoUrl} alt={displayName} />
            <AvatarFallback className="bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold uppercase text-xs">
              {displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm tracking-tight text-foreground truncate">{displayName}</span>
            <span className="text-[10px] text-muted-foreground font-mono opacity-70 truncate">{user.uid}</span>
          </div>
        </div>
        <AdminActions currentUserRole={currentUserRole} rowData={user} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={user.user_role?.role || "user"} />
        <StatusBadge active={user.user_role?.active ?? false} disabled={user.disabled} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/30">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 truncate">
            <Mail className="h-3 w-3 text-muted-foreground/60 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registered Date</span>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3 w-3 opacity-60 shrink-0" />
            <span className="tabular-nums">
              {user.created_at ? format(new Date(parseInt(user.created_at)), "MMM dd, yyyy") : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

const StatCard = ({ 
  title, 
  value, 
  subtitle,
  icon, 
  gradient,
  isActive,
  onClick
}: { 
  title: string, 
  value: string, 
  subtitle?: string,
  icon: React.ReactNode, 
  gradient: string,
  isActive?: boolean,
  onClick?: () => void
}) => (
  <Card 
    onClick={onClick}
    className={cn(
      "relative overflow-hidden group cursor-pointer transition-all duration-300 rounded-3xl backdrop-blur-xl border",
      isActive 
        ? "bg-white/80 dark:bg-zinc-900/80 border-violet-500/50 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20" 
        : "bg-white/50 dark:bg-zinc-950/50 border-border/60 hover:border-violet-500/30 hover:shadow-md"
    )}
  >
    <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", gradient)} />
    <CardContent className="p-5 sm:p-6 flex items-center justify-between relative z-10">
      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-foreground">{value}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground font-medium">{subtitle}</p>}
      </div>
      <div className="h-11 w-11 rounded-2xl bg-muted/50 dark:bg-zinc-900 border border-border/60 flex items-center justify-center group-hover:scale-105 transition-transform">
        {icon}
      </div>
    </CardContent>
  </Card>
)
