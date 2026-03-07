import { getJobDetails } from '@/lib/server-function'
import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'
import { DataTable } from '@/components/web/data-table'
import { candidateColumns } from "@/components/web/candidate-columns"
import { count } from 'console'
import { PaginatedCandidateResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'

export const jobsQueryOptions = queryOptions({
    queryKey: ['jobs'],
    queryFn: () => getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/candidates/')({
    beforeLoad: ({ context }) => {
        return { role: context.role.role }
    },
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(jobsQueryOptions)
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
    const { data } = useSuspenseQuery(jobsQueryOptions)

    const candiadte: PaginatedCandidateResponse = {
        count: 1,
        next_cursor: "",
        data: [{
            email: "sss",
            name: "sss",
            job_name: "sss",
            uploaded_at: new Date().toISOString(),
            resume_url: "sss",
            id: "ssss"
        }]
    }

    return (
        <div className="container max-w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-semibold">Applied Candidates</p>
                {role === "admin" &&
                    <Link to='/dashboard/candidates/add'>
                        <Button>Add Candidate</Button>
                    </Link>}
            </div>
            <DataTable columns={candidateColumns} data={candiadte.data} />
        </div>
    )
}
