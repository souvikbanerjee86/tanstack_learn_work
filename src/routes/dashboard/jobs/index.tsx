import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo } from 'react'

import { columns } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'

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

  return (
    <div className="container max-w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold">Job Details</p>
        {role === "admin" &&
          <Link to='/dashboard/jobs/add'>
            <Button>Add Job</Button>
          </Link>}
      </div>
      <DataTable
        columns={columns}
        data={allJobs}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />
    </div>
  )
}
