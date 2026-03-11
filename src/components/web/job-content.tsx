import { Briefcase, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { JobDetail } from "@/lib/types";

interface JobContentInterface {
    selectedJobId: string | null
    jobs: JobDetail[]
    getQuestions: (job_id: string) => void
}

export function JobContent({ selectedJobId, jobs, getQuestions }: JobContentInterface) {
    return <div className={`w-full md:w-80 lg:w-96 shrink-0 ${selectedJobId && 'hidden md:flex'} flex flex-col gap-4`}>
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight">Job Roles</h2>
            <Badge variant="outline">{jobs.length}</Badge>
        </div>
        <ScrollArea className="flex-1 rounded-xl border bg-card shadow-sm">
            <div className="p-2 space-y-1">
                {jobs.map((job) => (
                    <button
                        key={job.job_id}
                        onClick={() => getQuestions(job.job_id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all ${selectedJobId === job.job_id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-4 w-4" />
                            <div className="text-left">
                                <p className="font-semibold leading-none mb-1">{job.job_title}</p>
                                <p className={`text-[10px] uppercase tracking-wider ${selectedJobId === job.job_id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    {job.job_id}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 opacity-50 ${selectedJobId === job.job_id ? 'translate-x-1' : ''}`} />
                    </button>
                ))}
            </div>
        </ScrollArea>
    </div>
}