import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/jobs/')({
  component: RouteComponent,
  loader: async () => {
    const data: PaginatedJobResponse = await getJobDetails({ data: { limit: null, status: null, last_doc_id: null } })
    return { data }
  }
})


import { columns } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { PaginatedJobResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'


function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <div className="container max-w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-semibold">Job Details</p>
        <Link to='/dashboard/jobs/add'>
          <Button>Add Job</Button>
        </Link>
      </div>

      <DataTable columns={columns} data={data.data} />
    </div>
  )
}
