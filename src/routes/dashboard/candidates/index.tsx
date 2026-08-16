import { getCandidatesList } from '@/lib/server-function'
import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo, useState } from 'react'
import { DataTable } from '@/components/web/data-table'
import { candidateColumns, CandidateActions } from "@/components/web/candidate-columns"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AppliedCandidatesSkeleton } from '@/components/web/applied-candidates-skeleton'
import { 
    Plus, 
    Users, 
    Sparkles, 
    Mail, 
    Briefcase, 
    Calendar, 
    User, 
    Loader2, 
    ChevronsRight, 
    UserPlus, 
    Search, 
    X, 
    Inbox 
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { candidate } from '@/lib/types'
import { format } from 'date-fns'
import { AddMultipleCandidatesDialog } from '@/components/web/add-multiple-candidates-dialog'

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
    const [isAddMultipleOpen, setIsAddMultipleOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedPosition, setSelectedPosition] = useState<string>("all")

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

    const totalCount = data?.pages?.[0]?.count ?? allCandidates.length

    // Extract unique positions for filter dropdown
    const uniquePositions = useMemo(() => {
        const set = new Set<string>()
        allCandidates.forEach((c) => {
            if (c.job_name) set.add(c.job_name)
        })
        return Array.from(set).sort()
    }, [allCandidates])

    // Universal text search across all candidate fields & position filter
    const filteredCandidates = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        const tokens = query.split(/\s+/).filter(Boolean)

        return allCandidates.filter((cand) => {
            // Position filter
            if (selectedPosition !== "all" && cand.job_name !== selectedPosition) {
                return false
            }

            // If no search query, match position filter
            if (tokens.length === 0) {
                return true
            }

            // Build searchable text string
            const formattedDate = cand.uploaded_at
                ? format(new Date(cand.uploaded_at), "MMM dd yyyy MMM d")
                : ""

            const searchableBlob = [
                cand.name || "",
                cand.email || "",
                cand.job_name || "",
                cand.job_id || "",
                formattedDate,
            ].join(" ").toLowerCase()

            // Ensure all search tokens match
            return tokens.every((token) => searchableBlob.includes(token))
        })
    }, [allCandidates, searchQuery, selectedPosition])

    const hasFiltersApplied = searchQuery.trim().length > 0 || selectedPosition !== "all"

    return (
        <div className="relative min-h-screen flex flex-col gap-8 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[80px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-border/40">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-violet-500/10 dark:bg-violet-500/15 flex items-center justify-center border border-violet-500/20 shadow-xl shadow-violet-500/5 relative overflow-hidden group">
                        <Users className="h-7 w-7 md:h-8 md:w-8 text-violet-600 dark:text-violet-400 relative z-10 transition-transform group-hover:scale-110 duration-300" />
                        <div className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Applied Candidates</h1>
                            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-2 py-0.5">
                                {totalCount} Total
                            </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                            <Sparkles className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                            {allCandidates.length > 0
                                ? `Managing ${totalCount} candidate${totalCount !== 1 ? 's' : ''} in the active pipeline.`
                                : 'Awaiting candidates in the pipeline.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {role === "admin" && (
                        <>
                            <Button
                                onClick={() => setIsAddMultipleOpen(true)}
                                className="w-full sm:w-auto h-11 md:h-12 rounded-xl gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="px-1">
                                    Add Multiple
                                </span>
                            </Button>

                            <Link to='/dashboard/candidates/add' search={{ jobId: undefined, jobName: undefined }} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-11 md:h-12 rounded-xl gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider">
                                    <Plus className="h-4 w-4" />
                                    <span className="px-1">Add Candidate</span>
                                </Button>
                            </Link>

                            <AddMultipleCandidatesDialog
                                open={isAddMultipleOpen}
                                onOpenChange={setIsAddMultipleOpen}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* --- Main Section: Search, Filters & Content --- */}
            <div className="relative group p-4 sm:p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5 space-y-6">
                {/* Search & Position Filter Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
                    {/* Universal Search Input */}
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, position, job ID..."
                            className="pl-10 pr-9 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                                title="Clear search"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Controls & Result Counter */}
                    <div className="flex flex-wrap items-center gap-3">
                        {uniquePositions.length > 0 && (
                            <div className="w-full sm:w-auto">
                                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                                    <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-muted/40 border-border/60 text-xs font-semibold">
                                        <SelectValue placeholder="All Positions" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/60 shadow-2xl">
                                        <SelectGroup>
                                            <SelectItem value="all" className="rounded-xl my-1 text-xs font-medium">
                                                All Positions ({allCandidates.length})
                                            </SelectItem>
                                            {uniquePositions.map((pos) => (
                                                <SelectItem key={pos} value={pos} className="rounded-xl my-1 text-xs font-medium">
                                                    {pos}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <span className="text-xs font-medium text-muted-foreground/70 ml-1">
                            Showing <strong className="text-foreground">{filteredCandidates.length}</strong> of {allCandidates.length} candidates
                        </span>
                    </div>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block">
                    {filteredCandidates.length > 0 ? (
                        <DataTable
                            columns={candidateColumns}
                            data={filteredCandidates}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            onLoadMore={() => fetchNextPage()}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/40 shadow-inner">
                                <Inbox className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <h3 className="text-lg font-bold tracking-tight text-foreground">
                                    {hasFiltersApplied ? "No matching candidates found" : "No candidates in pipeline"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {hasFiltersApplied
                                        ? "Try adjusting your search query or position filter."
                                        : "Add candidates or import resumes to start tracking applicants."}
                                </p>
                            </div>
                            {hasFiltersApplied && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedPosition("all")
                                    }}
                                    className="h-8 rounded-xl text-xs font-bold border-border/60"
                                >
                                    Clear Search & Filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile/Tablet View: Cards */}
                <div className="flex flex-col gap-4 lg:hidden">
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((cand: candidate) => (
                            <CandidateMobileCard key={cand.id} candidate={cand} />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white/30 dark:bg-zinc-950/30 rounded-[2rem] border border-dashed border-border/40 p-6 space-y-3">
                            <Inbox className="h-8 w-8 mx-auto text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground font-medium">
                                {hasFiltersApplied ? "No candidates match your search criteria." : "No candidates found."}
                            </p>
                            {hasFiltersApplied && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedPosition("all")
                                    }}
                                    className="h-8 rounded-xl text-xs font-bold border-border/60"
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Load More Button for Mobile */}
                    {hasNextPage && !hasFiltersApplied && (
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
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="truncate">{candidate.job_name}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Applied Date</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="tabular-nums">
                        {candidate.uploaded_at ? format(new Date(candidate.uploaded_at), "MMM dd, yyyy") : "N/A"}
                    </span>
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
