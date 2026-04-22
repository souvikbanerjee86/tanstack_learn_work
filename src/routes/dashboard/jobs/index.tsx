import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'

import { columns, JobIdBadge, JobTitleItem, JobStatusBadge, JobTypeBadge, JobActionsMenu } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'
import { Briefcase, Plus, Sparkles, MapPin, Calendar, Clock, Loader2, ChevronsRight } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { JobDetail } from "@/lib/types"

const JOBS_PAGE_SIZE = 10

export const jobsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ['jobs', 'list'],
  queryFn: ({ pageParam }) =>
    getJobDetails({
      data: { limit: JOBS_PAGE_SIZE, status: null, last_doc_id: pageParam },
    }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
})

export const Route = createFileRoute('/dashboard/jobs/')({
  beforeLoad: ({ context }) => {
    return { role: context.role.role }
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchInfiniteQuery(jobsInfiniteQueryOptions)
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<JobTableSkeleton />}>
      <JobContent />
    </Suspense>
  )
}

function JobContent() {
  const { role } = Route.useRouteContext()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(jobsInfiniteQueryOptions)

  const allJobs = useMemo(
    () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  )

  const totalCount = data?.pages?.[0]?.count ?? 0

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </div>
      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-muted-foreground/10">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 shadow-xl relative overflow-hidden group">
            <Briefcase className="h-7 w-7 md:h-9 md:w-9 text-indigo-600 dark:text-indigo-400 relative z-10" />
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">Job Pipeline</h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {allJobs.length > 0
                ? `Overseeing ${totalCount} active position${totalCount !== 1 ? 's' : ''} in the network.`
                : 'Awaiting new deployments.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {role === "admin" && (
            <Link to='/dashboard/jobs/add' className="w-full sm:w-auto">
              <Button className="w-full h-11 md:h-12 rounded-[1rem] md:rounded-xl gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4" />
                <span className="text-[11px] md:text-xs font-black uppercase tracking-widest px-2">Add Position</span>
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
            columns={columns}
            data={allJobs}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>

        {/* Mobile View: Protocol Cards */}
        <div className="flex flex-col gap-6 lg:hidden">
          {allJobs.map((job) => (
            <JobProtocolCard key={job.job_id} job={job} />
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
                  Load More Positions
                </>
              )}
            </Button>
          )}

          {allJobs.length === 0 && !isFetchingNextPage && (
            <div className="text-center py-20 bg-white/30 dark:bg-zinc-950/30 rounded-[2rem] border border-dashed border-border/40 text-muted-foreground italic">
              No active deployments found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const JobProtocolCard = ({ job }: { job: JobDetail }) => (
  <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-6 space-y-6">
    <div className="flex items-center justify-between">
      <JobTitleItem title={job.job_title} />
      <JobActionsMenu rowData={job} />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <JobIdBadge jobId={job.job_id} />
      <JobStatusBadge status={job.status} />
      <JobTypeBadge type={job.job_type} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/20">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Deployment Site</span>
        <div className="flex items-center gap-2 text-sm font-medium opacity-80">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="truncate">{job.location}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Timeline Protocol</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium opacity-60">
            <Calendar className="h-3 w-3" />
            <span>{format(job.start_date, "MMM dd")}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-border/40" />
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium opacity-60">
            <Clock className="h-3 w-3" />
            <span>{format(job.end_date, "MMM dd")}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
)
