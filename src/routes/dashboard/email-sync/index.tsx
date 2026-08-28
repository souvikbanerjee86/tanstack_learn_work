import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useMemo, useState } from 'react'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  Mails,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { EmailSyncRecord } from '@/lib/types'
import { getEmailSyncs } from '@/lib/server-function'
import { emailSyncColumns } from '@/components/web/email-sync-columns'
import { DataTable } from '@/components/web/data-table'
import { EmailSyncSkeleton } from '@/components/web/email-sync-skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EmailReaderDialog } from '@/components/web/email-reader-dialog'
import { exportToCSV } from '@/lib/export-utils'

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

function EmailSyncMobileCard({
  record,
  onOpenReader,
}: {
  record: EmailSyncRecord
  onOpenReader: () => void
}) {
  const formattedDate = format(new Date(record.created_at), 'MMM dd, yyyy')

  return (
    <div
      onClick={onOpenReader}
      className="relative group p-5 rounded-[2rem] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:border-teal-500/30 transition-all duration-300 cursor-pointer"
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div
          className={cn(
            'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5',
            record.processed
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              record.processed ? 'bg-emerald-500' : 'bg-amber-500',
            )}
          />
          {record.processed ? 'Processed' : 'Pending'}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-inner">
          <User className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0 pr-16">
          <h3 className="text-base font-black truncate leading-tight tracking-tight text-foreground">
            {record.applicant_name}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
            <Mail className="h-3 w-3" />
            <span className="text-[11px] font-medium truncate">
              {record.applicant_email}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Briefcase className="h-3.5 w-3.5 text-teal-500/60" />
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">
              Job Role
            </span>
          </div>
          <p className="text-xs font-bold truncate tracking-tight text-foreground">
            {record.job_id}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="h-3.5 w-3.5 text-teal-500/60" />
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">
              Synced On
            </span>
          </div>
          <p className="text-xs font-bold truncate tracking-tight text-foreground">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* File Info */}
      <div className="mt-4 p-3 rounded-2xl border border-dashed border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-teal-500/60 shrink-0" />
          <p className="text-xs font-medium truncate opacity-80 italic">
            {record.cv_filename || 'Attached Resume.pdf'}
          </p>
        </div>
        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 shrink-0">
          <Eye className="h-3 w-3" /> View
        </span>
      </div>
    </div>
  )
}

function EmailSyncContent() {
  const { data } = useSuspenseQuery(emailSyncQueryOptions)
  const records = (data.data || [])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'processed' | 'pending'
  >('all')
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null)
  const [readerOpen, setReaderOpen] = useState(false)

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return records.filter((r) => {
      if (statusFilter === 'processed' && !r.processed) return false
      if (statusFilter === 'pending' && r.processed) return false

      if (!query) return true

      const searchable = [
        r.applicant_name || '',
        r.applicant_email || '',
        r.job_id || '',
        r.cv_filename || '',
      ]
        .join(' ')
        .toLowerCase()

      return searchable.includes(query)
    })
  }, [records, searchQuery, statusFilter])

  const handleExportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No email sync records available to export')
      return
    }

    const exportRows = filteredRecords.map((r) => ({
      'Applicant Name': r.applicant_name,
      'Applicant Email': r.applicant_email,
      'Job ID': r.job_id,
      Status: r.processed ? 'PROCESSED' : 'PENDING',
      'CV Filename': r.cv_filename,
      'Synced At': format(new Date(r.created_at), 'yyyy-MM-dd HH:mm'),
    }))

    exportToCSV(
      exportRows,
      `eazyai-synced-emails-${format(new Date(), 'yyyyMMdd-HHmm')}`,
    )
    toast.success(`Exported ${exportRows.length} email records to CSV`)
  }

  const handleOpenEmail = (record: EmailSyncRecord) => {
    setSelectedEmail({
      from_email: record.applicant_email,
      candidate_name: record.applicant_name,
      job_id: record.job_id,
      job_name: record.job_id,
      date: record.created_at,
      subject: `Application Submission for Job Reference: ${record.job_id}`,
      body: `Inbound application received from candidate ${record.applicant_name} (${record.applicant_email}) regarding job position ${record.job_id}.\n\nResume attachment filename: ${record.cv_filename}.\n\nStatus: ${record.processed ? 'Processed into candidate pipeline' : 'Awaiting review and processing'}.`,
    })
    setReaderOpen(true)
  }

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-teal-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </div>

      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 flex items-center justify-center border border-teal-500/20 shadow-sm relative overflow-hidden group shrink-0 text-teal-600 dark:text-teal-400">
            <Mails className="h-6 w-6 md:h-7 md:w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-foreground">
                Email Synchronization
              </h1>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
              >
                {records.length} Records
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Sparkles className="h-3.5 w-3.5 text-teal-500 shrink-0" />
              <span>
                Inbound candidate applications automatically monitored and
                synced from connected inboxes.
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-10 rounded-xl px-3.5 border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-xs font-bold gap-2 shadow-xs transition-all active:scale-[0.98]"
            title="Export Synced Emails to CSV"
          >
            <Download className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* --- Main Section: Search, Filters & Content --- */}
      <div className="relative group p-4 sm:p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5 space-y-6">
        {/* Search & Status Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by applicant name, email, job ID..."
              className="pl-10 pr-9 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all',
                  statusFilter === 'all'
                    ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                All ({records.length})
              </Button>
              <Button
                variant={statusFilter === 'processed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('processed')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5',
                  statusFilter === 'processed'
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Processed
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5',
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-sm hover:bg-amber-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                <Clock className="h-3 w-3 text-amber-400" />
                Pending
              </Button>
            </div>

            <span className="text-xs font-medium text-muted-foreground/70 ml-2">
              Showing{' '}
              <strong className="text-foreground">
                {filteredRecords.length}
              </strong>{' '}
              records
            </span>
          </div>
        </div>

        {/* Mobile/Tablet View: Cards */}
        <div className="grid grid-cols-1 lg:hidden gap-4">
          {filteredRecords.map((record) => (
            <EmailSyncMobileCard
              key={record.id}
              record={record}
              onOpenReader={() => handleOpenEmail(record)}
            />
          ))}
          {filteredRecords.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-[2.5rem] bg-card/40 backdrop-blur-xl border-2 border-dashed border-muted/50">
              <Mails className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold mb-1">
                No Matching Email Records
              </h3>
              <p className="text-xs text-muted-foreground">
                Try clearing search keywords or status filter.
              </p>
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden lg:block">
          <DataTable columns={emailSyncColumns} data={filteredRecords} />
        </div>
      </div>

      {/* Email Reader Dialog */}
      <EmailReaderDialog
        emailItem={selectedEmail}
        open={readerOpen}
        onOpenChange={setReaderOpen}
      />
    </div>
  )
}
