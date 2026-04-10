import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'

import { columns } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'
import { Briefcase, Plus, Sparkles, Filter } from 'lucide-react'

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
    <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm relative overflow-hidden group">
            <Briefcase className="h-7 w-7 text-indigo-600 dark:text-indigo-400 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Active Job Pipeline</h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {allJobs.length > 0
                ? `Overseeing ${totalCount} active job position${totalCount !== 1 ? 's' : ''} in the intelligence network.`
                : 'Awaiting new position deployments.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {role === "admin" && (
            <Link to='/dashboard/jobs/add'>
              <Button className="h-10 rounded-xl gap-2 shadow-lg shadow-indigo-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Add Position</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="relative group">
        <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <DataTable
          columns={columns}
          data={allJobs}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  )
}
