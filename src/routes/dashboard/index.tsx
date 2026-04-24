import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card";
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Briefcase, LayoutDashboard, Sparkles, Zap } from 'lucide-react';
import { getDashbaordSummary } from '@/lib/server-function';
import { DashboardStatsSkeleton } from '@/components/web/dashboard-stat-skeleton';
import React, { Suspense, lazy } from 'react';


// Lazy load the heavy charting library bundle
const DashboardChartsGrid = lazy(() => import('@/components/web/dashboard-charts'))

export const dashboardQueryOptions = queryOptions({
  queryKey: ['dashboard'],
  queryFn: () => getDashbaordSummary(),
})

export const Route = createFileRoute('/dashboard/')({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(dashboardQueryOptions)
  },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden p-4 md:p-10 lg:p-14">
      <div className="flex flex-col gap-10 pb-20 max-w-full relative z-10 w-full">
        {/* --- Page Header / Hero --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/50">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg relative overflow-hidden group">
              <LayoutDashboard className="h-9 w-9 text-primary relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter">Talent Intelligence</h1>
              <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Real-time recruitment analytics and performance metrics.
              </p>
            </div>
          </div>
        </div>

        {/* --- Stats Section --- */}
        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>

        {/* --- Charts Grid --- */}
        <Suspense fallback={
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <div className="h-[432px] w-full bg-card/40 backdrop-blur-sm rounded-[3rem] border border-border/50 animate-pulse" />
            <div className="h-[432px] w-full bg-card/40 backdrop-blur-sm rounded-[3rem] border border-border/50 animate-pulse delay-75" />
            <div className="h-[432px] w-full bg-card/40 backdrop-blur-sm rounded-[3rem] border border-border/50 animate-pulse delay-150" />
            <div className="h-[432px] w-full bg-card/40 backdrop-blur-sm rounded-[3rem] border border-border/50 animate-pulse delay-200" />
          </div>
        }>
          <DashboardChartsGrid />
        </Suspense>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card className="glass-card relative overflow-hidden group rounded-[2.5rem]">
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
      <Sparkles className="h-24 w-24" />
    </div>
    <CardContent className="p-10 flex items-center justify-between relative z-10">
      <div className="space-y-5">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">{title}</p>
        <div className="space-y-2">
          <h3 className="text-5xl font-black tracking-tighter tabular-nums text-foreground">{value}</h3>
        </div>
      </div>
      <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-muted/40 border border-border shadow-inner text-primary group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-700">
        {icon}
      </div>
    </CardContent>
  </Card>
);

function DashboardStats() {
  const { data } = useSuspenseQuery(dashboardQueryOptions)
  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Active Pipelines"
        value={data.active_jobs.toString()}
        icon={<Briefcase className="h-9 w-9" />}
      />
      <StatCard
        title="Talent Pool"
        value={data.total_applicants.toString()}
        icon={<Users className="h-9 w-9" />}
      />
      <StatCard
        title="Conversion"
        value={data.hired.toString()}
        icon={<UserCheck className="h-9 w-9" />}
      />
      <StatCard
        title="Growth Velocity"
        value={`${Math.round(data.growth_percentage)}%`}
        icon={<Zap className="h-9 w-9" />}
      />
    </div>
  )
}

function UserCheck({ className, size }: { className?: string, size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
    </svg>
  )
}

function Users({ className, size }: { className?: string, size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="19" cy="7" r="4" />
    </svg>
  )
}