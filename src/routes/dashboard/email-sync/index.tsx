import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { getEmailSyncs } from '@/lib/server-function'
import { emailSyncColumns } from '@/components/web/email-sync-columns'
import { DataTable } from '@/components/web/data-table'
import { EmailSyncSkeleton } from '@/components/web/email-sync-skeleton'
import { Mails, Sparkles, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center border border-teal-200 dark:border-teal-800 shadow-sm relative overflow-hidden group">
                        <Mails className="h-7 w-7 text-teal-600 dark:text-teal-400 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Email Synchronization</h1>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-teal-500" />
                            {data.data.length > 0
                                ? `Active monitoring for ${data.data.length} synced recruitment account${data.data.length !== 1 ? 's' : ''}.`
                                : 'No recruitment accounts currently bridged.'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest border-muted-foreground/20 hover:bg-muted/50 transition-colors">
                        <Filter className="h-3.5 w-3.5 opacity-50" />
                        Sync Filter
                    </Button>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div className="relative group">
                <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                <DataTable columns={emailSyncColumns} data={data.data} />
            </div>
        </div>
    )
}
