import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { getInterviewCandidateEmailList } from '@/lib/server-function'
import { candidateInterviewEmailColumns, InterviewActions } from "@/components/web/interview-email-columns"
import { DataTable } from "@/components/web/data-table"
import { CandidateTableSkeleton } from '@/components/web/candidate-table-skeleton'
import { Mail, Sparkles, Send, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CandidateRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export const interviewQueryOptions = queryOptions({
    queryKey: ['interview-candidates'],
    queryFn: () => getInterviewCandidateEmailList({ data: { limit: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/interview/')({
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(interviewQueryOptions)
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Suspense fallback={<CandidateTableSkeleton />}>
            <InterviewContent />
        </Suspense>
    )
}

function InterviewContent() {
    const { data } = useSuspenseQuery(interviewQueryOptions)

    return (
        <div className="relative min-h-screen flex flex-col gap-8 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-amber-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-sm relative overflow-hidden group">
                        <Send className="h-7 w-7 md:h-8 md:w-8 text-amber-600 dark:text-amber-400 relative z-10" />
                        <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Interview Dispatch</h1>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            {data.data.length > 0
                                ? `Managing ${data.data.length} dispatched interview notification${data.data.length !== 1 ? 's' : ''}.`
                                : 'No outgoing interview communications.'}
                        </p>
                    </div>
                </div>

            </div>

            {/* --- Main Section --- */}
            <div className="relative group">
                {/* Desktop View: Table */}
                <div className="hidden lg:block relative group p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5">
                    <DataTable columns={candidateInterviewEmailColumns} data={data.data} />
                </div>

                {/* Mobile/Tablet View: Cards */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {data.data.map((record: CandidateRecord) => (
                        <InterviewMobileCard key={record.id} record={record} />
                    ))}
                    {data.data.length === 0 && (
                        <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border/40 text-muted-foreground italic">
                            No dispatch records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const InterviewMobileCard = ({ record }: { record: CandidateRecord }) => (
    <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-5 space-y-4 transition-all hover:border-amber-500/30">
        <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10 uppercase tracking-tighter">
                        {record.job_id}
                    </span>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        record.email_sent
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                            : "bg-muted text-muted-foreground border border-border"
                    )}>
                        {record.email_sent ? "Dispatched" : "Pending"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-sm font-bold tracking-tight truncate">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="truncate">{record.candidate_email}</span>
                </div>
            </div>
            <InterviewActions rowData={record} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center sm:text-left">Evaluation</span>
                <div className="flex items-center justify-center sm:justify-start">
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-[10px] font-bold border",
                        record.interview_status
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-800/30"
                            : "bg-gray-50 text-gray-500 dark:bg-gray-900/20 dark:text-gray-400 border-gray-100 dark:border-gray-800/30"
                    )}>
                        {record.interview_status || "Awaiting"}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center sm:text-left">Verdict</span>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    {record.verdict ? (
                        <>
                            {record.verdict === "ACCEPT" ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-tight",
                                record.verdict === "ACCEPT" ? "text-emerald-600" : "text-red-600"
                            )}>
                                {record.verdict}
                            </span>
                        </>
                    ) : (
                        <span className="text-[10px] text-muted-foreground italic">—</span>
                    )}
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 leading-none">Processed</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium opacity-60">
                        <Calendar className="h-3 w-3" />
                        <span>{record.processed_at ? format(record.processed_at, "MMM dd") : "Pending"}</span>
                    </div>
                </div>
                {record.sent_at && (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 leading-none">Sent</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium opacity-60">
                            <Clock className="h-3 w-3" />
                            <span>{format(record.sent_at, "MMM dd")}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </Card>
)

