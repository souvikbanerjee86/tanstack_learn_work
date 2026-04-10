import { Briefcase, ChevronRight, Hash } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { JobDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JobContentInterface {
    selectedJobId: string | null
    jobs: JobDetail[]
    getQuestions: (job_id: string) => void
}

export function JobContent({ selectedJobId, jobs, getQuestions }: JobContentInterface) {
    return (
        <div className={cn(
            "w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-4",
            selectedJobId && "hidden md:flex"
        )}>
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold tracking-tight">Job Roles</h2>
                    <p className="text-xs text-muted-foreground">Select a role to manage questions</p>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] px-1.5 h-5">
                    {jobs.length} ROLES
                </Badge>
            </div>
            <ScrollArea className="flex-1 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm">
                <div className="p-3 space-y-2">
                    {jobs.map((job) => {
                        const isActive = selectedJobId === job.job_id;
                        return (
                            <button
                                key={job.job_id}
                                onClick={() => getQuestions(job.job_id)}
                                className={cn(
                                    "w-full group flex items-center justify-between p-4 rounded-xl text-sm transition-all duration-200 border",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg border-primary translate-x-1"
                                        : "hover:bg-muted/80 text-muted-foreground hover:text-foreground border-transparent hover:border-muted-foreground/10"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-inner",
                                        isActive ? "bg-white/20" : "bg-muted group-hover:bg-white dark:group-hover:bg-zinc-800"
                                    )}>
                                        <Briefcase className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold leading-none mb-1.5">{job.job_title}</p>
                                        <div className="flex items-center gap-1.5 opacity-80">
                                            <Hash className="h-3 w-3" />
                                            <p className="text-[10px] font-mono tracking-wider tabular-nums">
                                                {job.job_id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "flex items-center justify-center h-6 w-6 rounded-full transition-all duration-300",
                                    isActive ? "bg-white/20 rotate-0" : "bg-transparent -rotate-45"
                                )}>
                                    <ChevronRight className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground/30 group-hover:text-muted-foreground")} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}