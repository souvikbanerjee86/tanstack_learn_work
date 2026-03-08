import { getCandidatesList } from '@/lib/server-function'
import { createFileRoute, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { DataTable } from '@/components/web/data-table'
import { candidateColumns } from "@/components/web/candidate-columns"
import { Button } from '@/components/ui/button'
import { AppliedCandidatesSkeleton } from '@/components/web/applied-candidates-skeleton'

export const candidatesQueryOptions = queryOptions({
    queryKey: ['candidates'],
    queryFn: () => getCandidatesList({ data: { limit: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/candidates/')({
    beforeLoad: ({ context }) => {
        return { role: context.role.role }
    },
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(candidatesQueryOptions)
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
    const { data } = useSuspenseQuery(candidatesQueryOptions)



    return (
        <div className="container max-w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-semibold">Applied Candidates</p>
                {role === "admin" &&
                    <Link to='/dashboard/candidates/add'>
                        <Button>Add Candidate</Button>
                    </Link>}
            </div>
            <DataTable columns={candidateColumns} data={data.data} />
        </div>
    )
}
