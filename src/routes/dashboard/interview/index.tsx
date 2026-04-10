import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { getInterviewCandidateEmailList } from '@/lib/server-function'
import { candidateInterviewEmailColumns } from "@/components/web/interview-email-columns"
import { DataTable } from "@/components/web/data-table"
import { CandidateTableSkeleton } from '@/components/web/candidate-table-skeleton'
import { Mail, Sparkles, Filter, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center border border-amber-200 dark:border-amber-800 shadow-sm relative overflow-hidden group">
                        <Send className="h-7 w-7 text-amber-600 dark:text-amber-400 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Interview Dispatch</h1>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            {data.data.length > 0
                                ? `Managing ${data.data.length} dispatched interview notification${data.data.length !== 1 ? 's' : ''}.`
                                : 'No outgoing interview communications.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                        <Filter className="h-3.5 w-3.5 opacity-50" />
                        Dispatch Filter
                    </Button>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="relative group">
                <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <DataTable columns={candidateInterviewEmailColumns} data={data.data} />
            </div>
        </div>
    )
}
