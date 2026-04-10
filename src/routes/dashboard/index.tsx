import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Briefcase, TrendingUp, PieChartIcon, Activity, LayoutDashboard, Calendar, Sparkles, Target, Zap } from 'lucide-react';
import { getDashbaordSummary } from '@/lib/server-function';
import { DashboardStatsSkeleton } from '@/components/web/dashboard-stat-skeleton';
import { Suspense } from 'react';
import { Badge } from '@/components/ui/badge';

const chartData = [
  { name: 'Week 1', apps: 45, hires: 12, quality: 30, engagement: 25 },
  { name: 'Week 2', apps: 52, hires: 18, quality: 45, engagement: 35 },
  { name: 'Week 3', apps: 38, hires: 15, quality: 35, engagement: 30 },
  { name: 'Week 4', apps: 65, hires: 25, quality: 55, engagement: 45 },
];

const pieData = [
  { name: 'Engineering', value: 45 },
  { name: 'Product', value: 25 },
  { name: 'Design', value: 20 },
  { name: 'Sales', value: 10 },
];

// Modern, harmonious color palette
const COLORS = [
  'hsl(var(--primary))',
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
];

export const dashboardQueryOptions = queryOptions({
  queryKey: ['dashboard'],
  queryFn: () => getDashbaordSummary(),
})

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden p-4 md:p-10 lg:p-14">
      {/* --- Decorative Background Elements --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-violet-500/5 blur-[160px] rounded-full" />
      </div>

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
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* 1. Bar Chart: Applications */}
          <ChartWrapper title="Applications vs Hires" icon={<Target className="h-4 w-4" />}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} dy={15} />
              <YAxis stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                contentStyle={{
                  borderRadius: '20px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)',
                  padding: '12px 16px'
                }}
              />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              <Bar dataKey="apps" name="Applications" fill={COLORS[0]} radius={[8, 8, 0, 0]} barSize={28} />
              <Bar dataKey="hires" name="Hires" fill={COLORS[1]} radius={[8, 8, 0, 0]} barSize={28} />
            </BarChart>
          </ChartWrapper>

          {/* 2. Area Chart: Quality Score */}
          <ChartWrapper title="Candidate Quality Trend" icon={<Activity className="h-4 w-4" />}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} dy={15} />
              <YAxis stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  padding: '12px 16px'
                }}
              />
              <Area type="monotone" dataKey="quality" name="Quality Score" stroke={COLORS[3]} strokeWidth={4} fillOpacity={1} fill="url(#colorQuality)" dot={{ r: 6, fill: COLORS[3], strokeWidth: 3, stroke: 'hsl(var(--background))' }} activeDot={{ r: 10, strokeWidth: 0 }} />
            </AreaChart>
          </ChartWrapper>

          {/* 3. Line Chart: Engagement Rate */}
          <ChartWrapper title="Engagement Metrics" icon={<TrendingUp className="h-4 w-4" />}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.15)" />
              <XAxis dataKey="name" stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} dy={15} />
              <YAxis stroke="currentColor" className="text-foreground/60" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: '1px solid hsl(var(--border))',
                  background: 'hsl(var(--card))',
                  padding: '12px 16px'
                }}
              />
              <Line type="monotone" dataKey="engagement" name="Engagement" stroke={COLORS[2]} strokeWidth={5} dot={{ r: 6, fill: COLORS[2], strokeWidth: 3, stroke: 'hsl(var(--background))' }} activeDot={{ r: 10, strokeWidth: 0 }} />
            </LineChart>
          </ChartWrapper>

          {/* 4. Pie Chart: Dept Distribution */}
          <ChartWrapper title="Hiring by Department" icon={<PieChartIcon className="h-4 w-4" />}>
            <PieChart>
              <Pie data={pieData} innerRadius={85} outerRadius={120} paddingAngle={10} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '20px',
                  border: 'none',
                  background: 'hsl(var(--card))',
                  boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.2)',
                  padding: '12px 16px'
                }}
              />
              <Legend verticalAlign="bottom" align="center" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '20px' }} />
            </PieChart>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card className="relative overflow-hidden group border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[2.5rem] bg-card hover:bg-muted/5">
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

const ChartWrapper = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactElement }) => (
  <Card className="overflow-hidden border-border shadow-lg bg-card/60 backdrop-blur-md rounded-[3rem] p-4">
    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground shadow-inner border border-border/50">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-50">Intelligence Stream</p>
        </div>
      </div>
      <Badge variant="secondary" className="text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-border bg-muted/50">DATA READY</Badge>
    </CardHeader>
    <CardContent className="h-[360px] w-full p-6 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
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