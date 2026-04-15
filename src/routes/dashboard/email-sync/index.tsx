import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { getEmailSyncs } from '@/lib/server-function'
import { emailSyncColumns } from '@/components/web/email-sync-columns'
import { DataTable } from '@/components/web/data-table'
import { EmailSyncSkeleton } from '@/components/web/email-sync-skeleton'
import { Mails, Sparkles, Filter, User, Mail, Briefcase, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmailSyncRecord } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

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

function EmailSyncMobileCard({ record }: { record: EmailSyncRecord }) {
    const formattedDate = format(new Date(record.created_at), "MMM dd, yyyy")

    return (
        <div className="relative group p-5 rounded-[2rem] bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border border-muted/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-teal-500/20 transition-all duration-300">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5",
                    record.processed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30"
                        : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
                )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", record.processed ? "bg-emerald-500" : "bg-amber-500")} />
                    {record.processed ? "Processed" : "Pending"}
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 shadow-inner">
                    <User className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0 pr-16">
                    <h3 className="text-lg font-black truncate leading-tight uppercase tracking-tight">{record.applicant_name}</h3>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                        <Mail className="h-3 w-3" />
                        <span className="text-[11px] font-medium truncate">{record.applicant_email}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 rounded-2xl bg-muted/30 border border-transparent group-hover:bg-white dark:group-hover:bg-zinc-900/40 group-hover:border-teal-500/10 transition-all">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-teal-500/60" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Job Role</span>
                    </div>
                    <p className="text-xs font-bold truncate tracking-tight">{record.job_id}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/30 border border-transparent group-hover:bg-white dark:group-hover:bg-zinc-900/40 group-hover:border-teal-500/10 transition-all">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-500/60" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">Synced On</span>
                    </div>
                    <p className="text-xs font-bold truncate tracking-tight">{formattedDate}</p>
                </div>
            </div>

            {/* File Info */}
            <div className="mt-4 p-3 rounded-2xl border border-dashed border-muted/50 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-teal-500/40" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-0.5">Attachment</p>
                    <p className="text-xs font-medium truncate opacity-70 italic">{record.cv_filename}</p>
                </div>
            </div>
        </div>
    )
}

function EmailSyncContent() {
    const { data } = useSuspenseQuery(emailSyncQueryOptions)
    const records = data.data as EmailSyncRecord[]

    return (
        <div className="flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-x-hidden">
            {/* --- Executive Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-[1.25rem] md:rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center border border-teal-200 dark:border-teal-800 shadow-sm relative overflow-hidden group shrink-0">
                        <Mails className="h-6 w-6 md:h-7 md:w-7 text-teal-600 dark:text-teal-400 relative z-10" />
                        <div className="absolute inset-0 bg-linear-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black tracking-tight leading-none mb-1 md:mb-1.5 uppercase">Email Synchronization</h1>
                        <p className="text-[10px] md:text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                            <Sparkles className="h-3 md:h-3.5 w-3 md:w-3.5 text-teal-500 shrink-0" />
                            <span className="opacity-80">
                                {records.length > 0
                                    ? `Active monitoring for ${records.length} synced account${records.length !== 1 ? 's' : ''}.`
                                    : 'No accounts currently bridged.'}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest border-muted-foreground/20 hover:bg-muted/50 transition-colors shadow-sm">
                        <Filter className="h-3.5 w-3.5 opacity-50" />
                        Sync Filter
                    </Button>
                </div>
            </div>

            {/* --- Content Section --- */}
            <div className="relative group">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                {/* Mobile/Tablet View: Cards */}
                <div className="grid grid-cols-1 lg:hidden gap-4">
                    {records.map((record) => (
                        <EmailSyncMobileCard key={record.id} record={record} />
                    ))}
                    {records.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-center rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-dashed border-muted/50">
                            <Mails className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-bold mb-1">No Sync Records</h3>
                            <p className="text-sm text-muted-foreground">Accounts will appear here once bridged.</p>
                        </div>
                    )}
                </div>

                {/* Desktop/Tablet View: Table */}
                <div className="hidden lg:block">
                    <DataTable columns={emailSyncColumns} data={records} />
                </div>
            </div>
        </div>
    )
}

