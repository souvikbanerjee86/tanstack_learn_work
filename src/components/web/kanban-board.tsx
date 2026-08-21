import { useMemo } from "react";
import { JobDetail } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    MapPin,
    Calendar,
    Share2,
    CheckCircle2,
    AlertCircle,
    Archive,
    Sparkles,
    DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
    jobs: JobDetail[];
    role: string;
    onShareJob: (job: JobDetail) => void;
}

interface ColumnConfig {
    id: 'Active' | 'Inactive' | 'Archived';
    title: string;
    description: string;
    icon: any;
    accentBorder: string;
    badgeBg: string;
    indicatorColor: string;
}

const KANBAN_COLUMNS: ColumnConfig[] = [
    {
        id: 'Active',
        title: 'Active Positions',
        description: 'Accepting applications & conducting live AI assessments',
        icon: CheckCircle2,
        accentBorder: 'border-t-emerald-500',
        badgeBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        indicatorColor: 'bg-emerald-500',
    },
    {
        id: 'Inactive',
        title: 'Paused / Inactive',
        description: 'Temporarily closed to new applicants',
        icon: AlertCircle,
        accentBorder: 'border-t-amber-500',
        badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        indicatorColor: 'bg-amber-500',
    },
    {
        id: 'Archived',
        title: 'Archived / Closed',
        description: 'Past hiring cycles and filled positions',
        icon: Archive,
        accentBorder: 'border-t-zinc-500',
        badgeBg: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700',
        indicatorColor: 'bg-zinc-500',
    },
];

export function KanbanBoard({ jobs, role: _role, onShareJob }: KanbanBoardProps) {
    // Group jobs by their status (normalizing undefined/null to Active or Inactive)
    const groupedJobs = useMemo(() => {
        const groups: Record<'Active' | 'Inactive' | 'Archived', JobDetail[]> = {
            Active: [],
            Inactive: [],
            Archived: [],
        };

        jobs.forEach((job) => {
            const rawStatus = (job.status || 'Active').trim();
            if (rawStatus.toLowerCase() === 'active') {
                groups.Active.push(job);
            } else if (rawStatus.toLowerCase() === 'archived') {
                groups.Archived.push(job);
            } else {
                groups.Inactive.push(job);
            }
        });

        return groups;
    }, [jobs]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start w-full">
            {KANBAN_COLUMNS.map((col) => {
                const columnJobs = groupedJobs[col.id] || [];
                const Icon = col.icon;

                return (
                    <div
                        key={col.id}
                        className={cn(
                            "flex flex-col gap-4 p-4 sm:p-5 rounded-3xl bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 min-h-[520px] border-t-4",
                            col.accentBorder
                        )}
                    >
                        {/* Column Header */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 shadow-xs", col.badgeBg)}>
                                    <Icon className="h-4 w-4 shrink-0" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 tracking-tight leading-snug">
                                        {col.title}
                                    </h3>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal leading-normal">
                                        {col.description}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn("text-xs font-mono font-bold px-2.5 py-1 rounded-full border shrink-0", col.badgeBg)}
                            >
                                {columnJobs.length}
                            </Badge>
                        </div>

                        {/* Cards Stack */}
                        <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[calc(100vh-280px)] pr-0.5">
                            {columnJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 my-auto space-y-2">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No {col.id.toLowerCase()} positions</p>
                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Jobs with this status will appear here</p>
                                    </div>
                                </div>
                            ) : (
                                columnJobs.map((job) => {
                                    const formattedStartDate = job.start_date
                                        ? format(new Date(job.start_date), "MMM d, yyyy")
                                        : null;

                                    return (
                                        <Card
                                            key={job.job_id}
                                            className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl hover:border-indigo-500/60 dark:hover:border-indigo-400/60 transition-all duration-200 overflow-hidden p-4 sm:p-5"
                                        >
                                            <div className="flex flex-col gap-3.5 relative z-10">
                                                {/* Top Row: Job ID & Job Type */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 px-2 py-0.5 rounded-md inline-block">
                                                        {job.job_id}
                                                    </span>

                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 shrink-0"
                                                    >
                                                        {job.job_type || 'Full-time'}
                                                    </Badge>
                                                </div>

                                                {/* Job Title & Description - Plain text, no hyperlinks */}
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-black text-zinc-950 dark:text-zinc-50 leading-snug break-words">
                                                        {job.job_title}
                                                    </h4>
                                                    {job.job_description && (
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal break-words line-clamp-3">
                                                            {job.job_description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Footer: Date & Share Modal Trigger */}
                                                <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 mt-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                                                        <Calendar className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                                        <span>{formattedStartDate ? `Posted ${formattedStartDate}` : 'Active Posting'}</span>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onShareJob(job);
                                                        }}
                                                        className="h-8 px-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 gap-1.5 text-xs font-bold"
                                                        title="Share & QR Code"
                                                    >
                                                        <Share2 className="h-3.5 w-3.5 text-indigo-500" />
                                                        <span>Share</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
