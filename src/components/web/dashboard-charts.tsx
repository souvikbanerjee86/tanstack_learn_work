import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, Legend
} from 'recharts'
import { Target, Activity, TrendingUp, PieChartIcon } from 'lucide-react'

const chartData = [
  { name: 'Week 1', apps: 45, hires: 12, quality: 30, engagement: 25 },
  { name: 'Week 2', apps: 52, hires: 18, quality: 45, engagement: 35 },
  { name: 'Week 3', apps: 38, hires: 15, quality: 35, engagement: 30 },
  { name: 'Week 4', apps: 65, hires: 25, quality: 55, engagement: 45 },
]

const pieData = [
  { name: 'Engineering', value: 45 },
  { name: 'Product', value: 25 },
  { name: 'Design', value: 20 },
  { name: 'Sales', value: 10 },
]

const COLORS = [
  'hsl(var(--primary))',
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
]

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
)

export default function DashboardChartsGrid() {
  return (
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
  )
}
