import { adminUsersList } from '@/lib/server-function'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'
import { DataTable } from '@/components/web/data-table'
import { AdminUserSkeleton } from '@/components/web/admin-user-skeleton'
import { Users, Shield, Lock, Activity, Command, Mail, Calendar } from 'lucide-react'
import { getAdminColumns, RoleBadge, StatusBadge, AdminActions } from '@/components/web/admin-columns'
import { Card, CardContent } from "@/components/ui/card"
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

  // Calculate statistics (Memoized to prevent recalculation on every render)
  const { totalAdmins, activeAdmins, restrictedAdmins } = useMemo(() => {
    return {
      totalAdmins: data.data.length,
      activeAdmins: data.data.filter(u => u.user_role?.active).length,
      restrictedAdmins: data.data.filter(u => !u.user_role?.active).length
    }
  }, [data.data])

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </div>

      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-muted-foreground/10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-violet-600/10 flex items-center justify-center border border-violet-500/20 shadow-xl relative overflow-hidden group">
            <Command className="h-7 w-7 md:h-9 md:w-9 text-violet-600 dark:text-violet-400 relative z-10" />
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter">Command Center</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Shield className="h-3.5 w-3.5 text-violet-500" />
              <span className="truncate">System governance and administrator protocols.</span>
            </p>
          </div>
        </div>
      </div>

      {/* --- Stats Section --- */}
      <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Entities"
          value={totalAdmins.toString()}
          icon={<Users className="h-6 w-6 md:h-7 md:w-7" />}
          gradient="from-violet-500/20 to-transparent"
        />
        <StatCard
          title="Active Protocols"
          value={activeAdmins.toString()}
          icon={<Activity className="h-6 w-6 md:h-7 md:w-7" />}
          gradient="from-emerald-500/20 to-transparent"
        />
        <StatCard
          title="Security Locks"
          value={restrictedAdmins.toString()}
          icon={<Lock className="h-6 w-6 md:h-7 md:w-7" />}
          gradient="from-rose-500/20 to-transparent"
        />
      </div>

      {/* --- Table/Card Section --- */}
      <div className="mt-4 md:mt-2">
        {/* Desktop View: Table */}
        <div className="hidden lg:block relative group p-6 md:p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5">
          <DataTable columns={getAdminColumns(role!)} data={data.data} />
        </div>

        {/* Mobile View: Cards */}
        <div className="flex flex-col gap-6 lg:hidden">
          {data.data.map((user) => (
            <UserProtocolCard key={user.uid} user={user} currentUserRole={role!} />
          ))}
          {data.data.length === 0 && (
            <div className="text-center py-20 bg-white/30 dark:bg-zinc-950/30 rounded-[2.5rem] border border-dashed border-border/40 text-muted-foreground italic">
              No administrators identified in this protocol.
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
    <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 rounded-2xl border border-muted-foreground/10 shadow-inner">
            <AvatarImage src={photoUrl} alt={displayName} />
            <AvatarFallback className="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 font-bold uppercase">
              {displayName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight">{displayName}</span>
            <span className="text-[10px] text-muted-foreground font-mono opacity-60 mt-0.5">{user.uid}</span>
          </div>
        </div>
        <AdminActions currentUserRole={currentUserRole} rowData={user} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <RoleBadge role={user.user_role?.role || "user"} />
        <StatusBadge active={user.user_role?.active ?? false} disabled={user.disabled} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/20">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Interface</span>
          <div className="flex items-center gap-2 text-sm font-medium opacity-80">
            <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Timestamp</span>
          <div className="flex items-center gap-2 text-sm font-medium opacity-60">
            <Calendar className="h-3.5 w-3.5" />
            <span className="tabular-nums">
              {user.created_at ? format(new Date(parseInt(user.created_at)), "MMM dd, yyyy") : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

const StatCard = ({ title, value, icon, gradient }: { title: string, value: string, icon: React.ReactNode, gradient: string }) => (
  <Card className="relative overflow-hidden group border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
    <div className={cn("absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", gradient)} />
    <CardContent className="p-6 md:p-8 flex items-center justify-between relative z-10">
      <div className="space-y-3 md:space-y-4">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{title}</p>
        <h3 className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums">{value}</h3>
      </div>
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-700">
        {icon}
      </div>
    </CardContent>
  </Card>
)
