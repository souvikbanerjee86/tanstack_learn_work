
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  LineChart,
  Line
} from 'recharts';
import { Briefcase, TrendingUp, UserCheck, Users } from 'lucide-react';


const data = [
  { name: 'Week 1', apps: 45, hires: 12, quality: 30 },
  { name: 'Week 2', apps: 52, hires: 18, quality: 45 },
  { name: 'Week 3', apps: 38, hires: 15, quality: 35 },
  { name: 'Week 4', apps: 65, hires: 25, quality: 55 },
];

const pieData = [
  { name: 'Engineering', value: 45 },
  { name: 'Product', value: 25 },
  { name: 'Design', value: 20 },
  { name: 'Sales', value: 10 },
];

// Vibrant color palette that works in Light & Dark modes
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
export const Route = createFileRoute('/dashboard/')({
  // beforeLoad: () => {
  //   throw redirect({
  //     to: "/dashboard/import"
  //   })
  // },
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Talent Intelligence</h1>
        <p className="text-muted-foreground">Comprehensive recruitment and performance metrics.</p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Active Jobs" value="24" icon={<Briefcase size={20} />} />
        <StatCard title="Total Applicants" value="1,429" icon={<Users size={20} />} />
        <StatCard title="Hired" value="128" icon={<UserCheck size={20} />} />
        <StatCard title="Growth" value="+14%" icon={<TrendingUp size={20} />} />
      </div>

      {/* Charts Grid: 2x2 on Large Screens, 1x4 on Mobile */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">

        {/* 1. Bar Chart: Applications */}
        <ChartWrapper title="Applications vs Hires">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888844" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="apps" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="hires" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartWrapper>

        {/* 2. Area Chart: Quality Score */}
        <ChartWrapper title="Candidate Quality Trend">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[3]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS[3]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <Tooltip />
            <Area type="monotone" dataKey="quality" stroke={COLORS[3]} fillOpacity={1} fill="url(#colorQuality)" />
          </AreaChart>
        </ChartWrapper>

        {/* 3. Line Chart: Engagement Rate */}
        <ChartWrapper title="Engagement Metrics">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888844" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="apps" stroke={COLORS[2]} strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ChartWrapper>

        {/* 4. Pie Chart: Dept Distribution */}
        <ChartWrapper title="Hiring by Department">
          <PieChart>
            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartWrapper>

      </div>
    </div>
  );
};

// --- Helper Components for Cleanliness ---

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card className="border-none bg-slate-100/50 dark:bg-zinc-900/50">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-primary">
        {icon}
      </div>
    </CardContent>
  </Card>
);

const ChartWrapper = ({ title, children }: { title: string, children: React.ReactElement }) => (
  <Card className="overflow-hidden border-none shadow-sm bg-card">
    <CardHeader>
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[280px] w-full p-0 pb-4">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);