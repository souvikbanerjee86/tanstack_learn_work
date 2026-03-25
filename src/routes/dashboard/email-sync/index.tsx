import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { getEmailSyncs } from '@/lib/server-function'
import { emailSyncColumns } from '@/components/web/email-sync-columns'
import { DataTable } from '@/components/web/data-table'
import { EmailSyncSkeleton } from '@/components/web/email-sync-skeleton'


export const emailSyncQueryOptions = queryOptions({
    queryKey: ['email-syncs'],
    queryFn: () => getEmailSyncs({ data: { limit: null, last_doc_id: null } }),
})
export const Route = createFileRoute('/dashboard/email-sync/')({
    beforeLoad: ({ context }) => {
        return { role: context.role.role }
    },
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(emailSyncQueryOptions)
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Suspense fallback={<EmailSyncSkeleton />}>
            <EmailSyncContent />
        </Suspense>
    )
}

function EmailSyncContent() {
    const { data } = useSuspenseQuery(emailSyncQueryOptions)

    return (
        <div className="container max-w-full">
            <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-semibold">Email Sync Details</p>
            </div>
            <DataTable columns={emailSyncColumns} data={data.data} />
        </div>
    )
}
