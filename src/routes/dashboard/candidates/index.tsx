import { getCandidatesList } from '@/lib/server-function'
import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { DataTable } from '@/components/web/data-table'
import { candidateColumns } from "@/components/web/candidate-columns"
import { Button } from '@/components/ui/button'
import { AppliedCandidatesSkeleton } from '@/components/web/applied-candidates-skeleton'
import { Plus, Users, Sparkles, Filter } from 'lucide-react'

export const candidatesQueryOptions = queryOptions({
    queryKey: ['candidates'],
    queryFn: () => getCandidatesList({ data: { limit: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/candidates/')({
    beforeLoad: ({ context }) => {
        return { role: context.role.role }
    },
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(candidatesQueryOptions)
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Suspense fallback={<AppliedCandidatesSkeleton />}>
            <CandidatesContent />
        </Suspense>
    )
}

function CandidatesContent() {
    const { role } = Route.useRouteContext()
    const { data } = useSuspenseQuery(candidatesQueryOptions)

    return (
        <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center border border-violet-200 dark:border-violet-800 shadow-sm relative overflow-hidden group">
                        <Users className="h-7 w-7 text-violet-600 dark:text-violet-400 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Applied Candidates</h1>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                            {data.data.length > 0
                                ? `Managing ${data.data.length} candidate${data.data.length !== 1 ? 's' : ''} in the intelligence pipeline.`
                                : 'Awaiting candidates in the pipeline.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">

                    {role === "admin" && (
                        <Link to='/dashboard/candidates/add'>
                            <Button className="h-10 rounded-xl gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Plus className="h-4 w-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Add Candidate</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="relative group">
                <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <DataTable columns={candidateColumns} data={data.data} />
            </div>
        </div>
    )
}
