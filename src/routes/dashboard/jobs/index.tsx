import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/jobs/')({
  component: RouteComponent,
  loader: async () => {
    const data: PaginatedJobResponse = await getJobDetails()
    return { data }
  }
})


import { columns } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { PaginatedJobResponse } from '@/lib/types'


function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <div className="container max-w-full">
      <p className="text-2xl font-semibold mb-4">Job Details</p>
      <DataTable columns={columns} data={data.data} />
    </div>
  )
}
