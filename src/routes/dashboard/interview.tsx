import { getInterviewCandidateEmailList } from '@/lib/server-function'
import { CandidatePaginationResponse } from '@/lib/types'
import { createFileRoute } from '@tanstack/react-router'

import { candidateInterviewEmailColumns } from "@/components/web/interview-email-columns"
import { DataTable } from "@/components/web/data-table"


export const Route = createFileRoute('/dashboard/interview')({
  component: RouteComponent,
  loader: async () => {
    const data: CandidatePaginationResponse = await getInterviewCandidateEmailList({ data: { limit: null, last_doc_id: null } })
    return { data }
  }
})

function RouteComponent() {
  const { data } = Route.useLoaderData()
  return (
    <div className="container max-w-full">
      <p className="text-2xl font-semibold mb-4">Candidate Interview Email Notification</p>
      <DataTable columns={candidateInterviewEmailColumns} data={data.data} />
    </div>
  )
}
