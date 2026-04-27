import { getCandidatesList } from '@/lib/server-function'
import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'
import { DataTable } from '@/components/web/data-table'
import { candidateColumns, CandidateActions } from "@/components/web/candidate-columns"
import { Button } from '@/components/ui/button'
import { AppliedCandidatesSkeleton } from '@/components/web/applied-candidates-skeleton'
import { Plus, Users, Sparkles, Mail, Briefcase, Calendar, User, Loader2, ChevronsRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { candidate } from '@/lib/types'
import { format } from 'date-fns'

const CANDIDATES_PAGE_SIZE = 10

export const candidatesQueryOptions = infiniteQueryOptions({
    queryKey: ['candidates', 'list'],
    queryFn: ({ pageParam }) =>
        getCandidatesList({ data: { limit: CANDIDATES_PAGE_SIZE, last_doc_id: pageParam } }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
})

export const Route = createFileRoute('/dashboard/candidates/')({
    beforeLoad: ({ context }) => {
        return { role: context.role.role }
    },
    loader: async ({ context }) => {
        await context.queryClient.prefetchInfiniteQuery(candidatesQueryOptions)
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
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSuspenseInfiniteQuery(candidatesQueryOptions)

    const allCandidates = useMemo(
        () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
        [data?.pages],
    )

    const totalCount = data?.pages?.[0]?.count ?? 0

    return (
        <div className="relative min-h-screen flex flex-col gap-8 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center border border-violet-200 dark:border-violet-800 shadow-sm relative overflow-hidden group">
                        <Users className="h-7 w-7 md:h-8 md:w-8 text-violet-600 dark:text-violet-400 relative z-10" />
                        <div className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Applied Candidates</h1>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                            {allCandidates.length > 0
                                ? `Managing ${totalCount} candidate${totalCount !== 1 ? 's' : ''} in the pipeline.`
                                : 'Awaiting candidates in the pipeline.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {role === "admin" && (
                        <Link to='/dashboard/candidates/add' className="w-full md:w-auto">
                            <Button className="w-full h-11 md:h-12 rounded-[1rem] md:rounded-xl gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Plus className="h-4 w-4" />
                                <span className="text-[11px] md:text-xs font-black uppercase tracking-widest px-2">Add Candidate</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* --- Main Section --- */}
            <div className="relative group">
                {/* Desktop View: Table */}
                <div className="hidden lg:block relative group p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5">
                    <DataTable
                        columns={candidateColumns}
                        data={allCandidates}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                    />
                </div>

                {/* Mobile/Tablet View: Cards */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {allCandidates.map((candidate: candidate) => (
                        <CandidateMobileCard key={candidate.id} candidate={candidate} />
                    ))}

                    {/* Load More Button for Mobile */}
                    {hasNextPage && (
                        <Button
                            variant="outline"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-full h-14 rounded-2xl border-dashed border-border/60 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-xl font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Syncing Data...
                                </>
                            ) : (
                                <>
                                    <ChevronsRight className="h-4 w-4" />
                                    Load More Candidates
                                </>
                            )}
                        </Button>
                    )}

                    {allCandidates.length === 0 && !isFetchingNextPage && (
                        <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border/40 text-muted-foreground italic">
                            No candidates found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const CandidateMobileCard = ({ candidate }: { candidate: candidate }) => (
    <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-5 space-y-4 transition-all hover:border-violet-500/30">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 shadow-inner">
                    <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm tracking-tight truncate">{candidate.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium opacity-80 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                    </div>
                </div>
            </div>
            <CandidateActions rowData={candidate} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/20">
            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Position</span>
                <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span>{candidate.job_name}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Applied Date</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className="tabular-nums">{format(new Date(candidate.uploaded_at), "MMM dd, yyyy")}</span>
                </div>
            </div>
        </div>

        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <span className="font-black text-[32px] uppercase tracking-tighter select-none">
                {candidate.job_id}
            </span>
        </div>
    </Card>
)

