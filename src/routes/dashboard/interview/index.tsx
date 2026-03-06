import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

import { getInterviewCandidateEmailList } from '@/lib/server-function'
import { candidateInterviewEmailColumns } from "@/components/web/interview-email-columns"
import { DataTable } from "@/components/web/data-table"
import { CandidateTableSkeleton } from '@/components/web/candidate-table-skeleton'

export const interviewQueryOptions = queryOptions({
    queryKey: ['interview-candidates'],
    queryFn: () => getInterviewCandidateEmailList({ data: { limit: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/interview/')({
    loader: ({ context }) =>
        context.queryClient.prefetchQuery(interviewQueryOptions),
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Suspense fallback={<CandidateTableSkeleton />}>
            <InterviewContent />
        </Suspense>
    )
}

function InterviewContent() {
    const { data } = useSuspenseQuery(interviewQueryOptions)

    return (
        <div className="container max-w-full">
            <p className="text-2xl font-semibold mb-4">Candidate Interview Email Notification</p>
            <DataTable columns={candidateInterviewEmailColumns} data={data.data} />
        </div>
    )
}
