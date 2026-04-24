import { createFileRoute, Link, useLocation } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
    Calendar,
    MapPin,
    Briefcase,
    Share2,
    Download,
    TimerIcon,
    Edit,
    ChevronLeft,
    Clock,
    FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute('/dashboard/jobs/$id/')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const jobInfo = location.state as any;

    if (!jobInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <Briefcase className="h-12 w-12" />
                </div>
                <p className="text-slate-500 font-medium tracking-tight">Job information not found.</p>
                <Link to="/dashboard/jobs">
                    <Button variant="outline" className="rounded-xl">Return to Jobs</Button>
                </Link>
            </div>
        );
    }

    const job = jobInfo;

    return (
        <div className="relative min-h-screen w-full bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30 overflow-hidden p-4 md:p-10 lg:p-14 pb-20">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:3s]" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
                {/* Simplified Back Navigation */}
                <div className="flex items-center justify-between">
                    <Link to='/dashboard/jobs'>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group gap-2 px-4 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-900/50 backdrop-blur-sm rounded-full transition-all"
                        >
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span className="font-semibold tracking-tight">Return to Pipeline</span>
                        </Button>
                    </Link>

                    <Link to="/dashboard/jobs/$id/edit" params={{ id: job.job_id }} state={job}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 px-4 rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-all"
                        >
                            <Edit className="h-3.5 w-3.5" />
                            Modify Listing
                        </Button>
                    </Link>
                </div>

                {/* --- HERO SECTION --- */}
                <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 dark:shadow-none rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                    <CardContent className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge variant="outline" className="h-6 bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-black text-[10px] uppercase tracking-widest px-3">
                                        {job.status || 'Active'}
                                    </Badge>
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        ID: {job.job_id}
                                    </span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                                    {job.job_title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-indigo-500" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-indigo-500" />
                                        {job.job_type}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        Posted {format(job.created_at || new Date(), "MMM d, yyyy")}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-3 min-w-[200px]">
                                <Link to="/dashboard/candidates/add">
                                    <Button className="w-full h-12 gap-2 text-sm font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 text-white group transition-all active:scale-[0.98]">
                                        Apply for Position
                                        <Share2 className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Button>
                                </Link>
                                <Button variant="outline" className="flex-1 h-12 gap-2 text-sm font-bold rounded-2xl bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <Download className="h-4 w-4" />
                                    Job Details PDF
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: DESCRIPTION */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-500/5 dark:shadow-none rounded-[2rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                            <CardHeader className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800/50 mx-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest text-[13px] opacity-70">Job Description</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-6">
                                <div className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium selection:bg-indigo-200 dark:selection:bg-indigo-900/40">
                                    {job.job_description}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: OVERVIEW */}
                    <div className="space-y-8">
                        <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-500/5 dark:shadow-none rounded-[2rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50 sticky top-8">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">Role Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-8">
                                <div className="grid gap-6">
                                    <MetricItem
                                        icon={MapPin}
                                        label="Primary Location"
                                        value={job.location}
                                    />
                                    <MetricItem
                                        icon={Briefcase}
                                        label="Listing Status"
                                        value={job.job_type}
                                    />
                                    <MetricItem
                                        icon={TimerIcon}
                                        label="Target Experience"
                                        value={`${job.experience} Years Required`}
                                    />
                                    <MetricItem
                                        icon={Calendar}
                                        label="Listing Timeline"
                                        value={`Available until ${format(job.end_date, "PPP")}`}
                                        subValue={`Started on ${format(job.start_date, "PPP")}`}
                                    />
                                </div>

                                <Separator className="bg-slate-200/50 dark:bg-slate-800/50" />

                                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Candidate Spotlight</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        We are actively seeking candidates with strong technical aptitude and a passion for data-driven innovation.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Help Desk Card */}
                        <Card className="border-none bg-indigo-600 dark:bg-indigo-950/40 shadow-xl shadow-indigo-600/20 rounded-[2rem] overflow-hidden">
                            <CardContent className="p-8">
                                <h3 className="text-white font-black tracking-tight text-xl mb-2">Need Assistance?</h3>
                                <p className="text-indigo-100/70 text-sm font-medium mb-6 leading-relaxed">
                                    Have questions about the requirements or application process? Our HR team is here to help.
                                </p>
                                <Button variant="secondary" className="w-full h-11 rounded-xl font-bold bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                                    Contact Recruitment
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricItem({ icon: Icon, label, value, subValue }: { icon: any, label: string, value: string, subValue?: string }) {
    return (
        <div className="flex gap-4 group">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl h-fit border border-indigo-500/10 group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{value}</p>
                {subValue && <p className="text-[11px] font-medium text-slate-500/70 dark:text-slate-400/50 mt-1">{subValue}</p>}
            </div>
        </div>
    );
}
