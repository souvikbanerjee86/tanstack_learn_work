import { useState, useMemo } from "react";
import { Briefcase, ChevronRight, Hash, Search, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { JobDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JobContentInterface {
    selectedJobId: string | null
    jobs: JobDetail[]
    getQuestions: (job_id: string) => void
}

export function JobContent({ selectedJobId, jobs, getQuestions }: JobContentInterface) {
    const [searchRole, setSearchRole] = useState("")

    const filteredJobs = useMemo(() => {
        const q = searchRole.trim().toLowerCase()
        if (!q) return jobs
        return jobs.filter((j) => 
            j.job_title?.toLowerCase().includes(q) || 
            j.job_id?.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q)
        )
    }, [jobs, searchRole])

    return (
        <div className={cn(
            "w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3",
            selectedJobId && "hidden lg:flex"
        )}>
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                    <h2 className="text-lg font-black tracking-tight text-foreground">Job Requisitions</h2>
                    <p className="text-xs text-muted-foreground font-medium">Select a role to view question bank</p>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                    {jobs.length} ROLES
                </Badge>
            </div>

            {/* Role Search Filter */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
                    placeholder="Search roles or ID..."
                    className="pl-9 pr-8 h-9 rounded-xl bg-muted/40 border-border/60 text-xs focus:bg-background transition-colors"
                />
                {searchRole && (
                    <button
                        onClick={() => setSearchRole("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            <ScrollArea className="h-[calc(100vh-280px)] min-h-[350px] rounded-[1.8rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5">
                <div className="p-2.5 space-y-1.5">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => {
                            const isActive = selectedJobId === job.job_id;
                            return (
                                <button
                                    key={job.job_id}
                                    onClick={() => getQuestions(job.job_id)}
                                    className={cn(
                                        "w-full group flex items-center justify-between p-3 rounded-2xl text-sm transition-all duration-200 border text-left",
                                        isActive
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 border-indigo-600 translate-x-1"
                                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border-transparent hover:border-border/40"
                                    )}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
                                            isActive 
                                                ? "bg-white/20 text-white" 
                                                : "bg-muted text-muted-foreground group-hover:bg-white dark:group-hover:bg-zinc-800 group-hover:text-foreground"
                                        )}>
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={cn("font-bold text-xs truncate mb-0.5", isActive ? "text-white" : "text-foreground")}>
                                                {job.job_title}
                                            </p>
                                            <div className="flex items-center gap-1.5 opacity-70">
                                                <Hash className="h-2.5 w-2.5 shrink-0" />
                                                <p className="text-[10px] font-mono tracking-wider truncate">
                                                    {job.job_id}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "flex items-center justify-center h-6 w-6 rounded-full transition-all duration-200 shrink-0",
                                        isActive ? "bg-white/20 text-white" : "text-muted-foreground/40 group-hover:text-foreground"
                                    )}>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center text-xs text-muted-foreground font-medium px-4">
                            No roles match "{searchRole}"
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}