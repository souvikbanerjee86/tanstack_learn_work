import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'


export const jobsQueryOptions = queryOptions({
  queryKey: ['jobs'],
  queryFn: () => getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/jobs/')({

  loader: ({ context }) =>
    context.queryClient.ensureQueryData(jobsQueryOptions),
  component: RouteComponent,
})


import { columns } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'
import { Suspense } from 'react'


function RouteComponent() {
  const { data } = useSuspenseQuery(jobsQueryOptions)

  return (
    <Suspense fallback={<JobTableSkeleton />}> <div className="container max-w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold">Job Details</p>
        <Link to='/dashboard/jobs/add'>
          <Button>Add Job</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data.data} />
    </div> </Suspense>

  )
}
