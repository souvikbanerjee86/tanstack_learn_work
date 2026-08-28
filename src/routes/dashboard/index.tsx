import { Link, createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Briefcase,
  Compass,
  HardDrive,
  LayoutDashboard,
  Plus,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Suspense, lazy } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashbaordSummary } from '@/lib/server-function'
import { DashboardStatsSkeleton } from '@/components/web/dashboard-stat-skeleton'
import { cn } from '@/lib/utils'

// Lazy load the heavy charting library bundle
const DashboardChartsGrid = lazy(
  () => import('@/components/web/dashboard-charts'),
)

export const dashboardQueryOptions = queryOptions({
  queryKey: ['dashboard'],
  queryFn: () => getDashbaordSummary(),
})

export const Route = createFileRoute('/dashboard/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(dashboardQueryOptions)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden p-4 md:p-10 lg:p-14 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Lighting --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-8%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="flex flex-col gap-8 md:gap-10 max-w-full relative z-10 w-full">
        {/* --- Page Header / Hero --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/40">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
              <LayoutDashboard className="h-7 w-7 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400 relative z-10 transition-transform group-hover:scale-110 duration-300" />
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                  Talent Intelligence
                </h1>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 gap-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
                  Live Sync
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  Real-time recruitment analytics and automated candidate
                  performance metrics.
                </span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            <Link to="/dashboard/jobs/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-10 md:h-11 rounded-xl px-4 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="h-4 w-4" />
                <span>Add Position</span>
              </Button>
            </Link>
            <Link to="/dashboard/discover">
              <Button
                variant="outline"
                size="icon"
                className="h-10 md:h-11 w-10 md:w-11 rounded-xl border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-muted/80 shadow-sm"
                title="Discover Candidates"
              >
                <Compass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </Button>
            </Link>
          </div>
        </div>

        {/* --- Key Metrics Section --- */}
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>

        {/* --- Quick Operational Shortcuts --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Link to="/dashboard/jobs" className="group">
            <Card className="h-full rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Job Pipelines
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Manage open job listings
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/discover" className="group">
            <Card className="h-full rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      AI Discovery
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Semantic candidate match
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/import" className="group">
            <Card className="h-full rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      Archive Bank
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Storage & indexing status
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          </Link>
        </div>

        {/* --- Charts Grid --- */}
        <Suspense
          fallback={
            <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
              <div className="h-[432px] w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2.5rem] border border-border/50 animate-pulse" />
              <div className="h-[432px] w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2.5rem] border border-border/50 animate-pulse delay-75" />
              <div className="h-[432px] w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2.5rem] border border-border/50 animate-pulse delay-150" />
              <div className="h-[432px] w-full bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2.5rem] border border-border/50 animate-pulse delay-200" />
            </div>
          }
        >
          <DashboardChartsGrid />
        </Suspense>
      </div>
    </div>
  )
}

// --- Modern Metric Stat Card Component ---

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  theme: 'indigo' | 'blue' | 'emerald' | 'amber'
  badgeText?: string
}

const themeConfigs = {
  indigo: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    border: 'border-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'from-indigo-500/15 via-transparent to-transparent',
    badge:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'from-blue-500/15 via-transparent to-transparent',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'from-emerald-500/15 via-transparent to-transparent',
    badge:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'from-amber-500/15 via-transparent to-transparent',
    badge:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  theme,
  badgeText,
}: StatCardProps) => {
  const config = themeConfigs[theme]

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group">
      {/* Corner Ambient Glow */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-32 h-32 bg-linear-to-br rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none',
          config.glow,
        )}
      />

      <CardContent className="p-6 md:p-7 flex flex-col justify-between h-full space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'h-10 w-10 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-105',
                config.bg,
                config.border,
                config.text,
              )}
            >
              {icon}
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground/80">
              {title}
            </span>
          </div>

          {badgeText && (
            <Badge
              variant="outline"
              className={cn(
                'text-[9px] font-black uppercase tracking-widest px-2 py-0.5',
                config.badge,
              )}
            >
              {badgeText}
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-foreground">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardStats() {
  const { data } = useSuspenseQuery(dashboardQueryOptions)
  const growth = Math.round(data.growth_percentage)

  return (
    <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Active Pipelines"
        value={data.active_jobs.toString()}
        subtitle="Current open requisitions"
        icon={<Briefcase className="h-5 w-5" />}
        theme="indigo"
        badgeText="Active"
      />
      <StatCard
        title="Talent Pool"
        value={data.total_applicants.toString()}
        subtitle="Evaluated profiles in bank"
        icon={<Users className="h-5 w-5" />}
        theme="blue"
        badgeText="Screened"
      />
      <StatCard
        title="Successful Hires"
        value={data.hired.toString()}
        subtitle="Converted into team members"
        icon={<UserCheck className="h-5 w-5" />}
        theme="emerald"
        badgeText="Offers Accepted"
      />
      <StatCard
        title="Growth Velocity"
        value={`${growth >= 0 ? `+${growth}` : growth}%`}
        subtitle="Period-over-period intake"
        icon={<TrendingUp className="h-5 w-5" />}
        theme="amber"
        badgeText={growth >= 0 ? 'Trending Up' : 'Stable'}
      />
    </div>
  )
}
