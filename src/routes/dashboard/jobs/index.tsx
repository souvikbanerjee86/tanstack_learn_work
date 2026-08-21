import { createFileRoute, Link } from '@tanstack/react-router'
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Suspense, useMemo, useState } from 'react'

import { columns, JobIdBadge, JobTitleItem, JobStatusBadge, JobTypeBadge, JobActionsMenu, FacilityLocationItem } from "@/components/web/columns"
import { DataTable } from "@/components/web/data-table"
import { getJobDetails } from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { JobTableSkeleton } from '@/components/web/Job-table-skeleton'
import {
  Briefcase,
  Plus,
  Sparkles,
  Calendar,
  Clock,
  Loader2,
  ChevronsRight,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Inbox
} from 'lucide-react'
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { JobDetail } from "@/lib/types"
import { cn } from "@/lib/utils"
import { KanbanBoard } from "@/components/web/kanban-board"
import { JobShareDialog } from "@/components/web/job-share-dialog"
import { exportToCSV } from "@/lib/export-utils"
import { LayoutGrid, Table, Download } from "lucide-react"
import { toast } from "sonner"

const JOBS_PAGE_SIZE = 10

export const jobsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ['jobs', 'list'],
  queryFn: ({ pageParam }) =>
    getJobDetails({
      data: { limit: JOBS_PAGE_SIZE, status: null, last_doc_id: pageParam },
    }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
})

export const Route = createFileRoute('/dashboard/jobs/')({
  beforeLoad: ({ context }) => {
    return { role: context.role.role }
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchInfiniteQuery(jobsInfiniteQueryOptions)
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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(jobsInfiniteQueryOptions)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive' | 'Archived'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [selectedJobForShare, setSelectedJobForShare] = useState<JobDetail | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const allJobs = useMemo(
    () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  )

  const totalCount = data?.pages?.[0]?.count ?? allJobs.length

  // Universal text search across all job properties & metadata
  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const tokens = query.split(/\s+/).filter(Boolean)

    return allJobs.filter((job) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && job.status !== statusFilter) {
        return false
      }

      // If no search query, return true
      if (tokens.length === 0) {
        return true
      }

      // 2. Build comprehensive searchable text string from all job fields
      const formattedStartDate = job.start_date ? format(new Date(job.start_date), "MMM dd yyyy MMM d") : ""
      const formattedEndDate = job.end_date ? format(new Date(job.end_date), "MMM dd yyyy MMM d") : ""

      const searchableBlob = [
        job.job_title || "",
        job.job_id || "",
        job.location || "",
        job.job_type || "",
        job.status || "",
        job.job_description || "",
        job.experience !== undefined ? `${job.experience} years ${job.experience}yr ${job.experience}y` : "",
        formattedStartDate,
        formattedEndDate,
      ].join(" ").toLowerCase()

      // Ensure all search tokens match (multi-keyword search)
      return tokens.every((token) => searchableBlob.includes(token))
    })
  }, [allJobs, searchQuery, statusFilter])

  const hasFiltersApplied = searchQuery.trim().length > 0 || statusFilter !== 'all'

  const handleOpenShare = (job: JobDetail) => {
    setSelectedJobForShare(job)
    setShareDialogOpen(true)
  }

  const handleExportCSV = () => {
    if (filteredJobs.length === 0) {
      toast.error("No job records available to export")
      return
    }

    const exportRows = filteredJobs.map((job) => ({
      "Job ID": job.job_id,
      "Position Title": job.job_title,
      "Status": job.status || "Active",
      "Type": job.job_type || "Full-time",
      "Location": job.location || "Remote",
      "Experience (Years)": job.experience ?? "N/A",
      "Salary": (job as any).salary || "Not Specified",
      "Start Date": job.start_date ? format(new Date(job.start_date), "yyyy-MM-dd") : "",
      "End Date": job.end_date ? format(new Date(job.end_date), "yyyy-MM-dd") : "",
      "Job Description": job.job_description?.slice(0, 300) || "",
    }))

    exportToCSV(exportRows, `eazyai-job-pipeline-${format(new Date(), "yyyyMMdd-HHmm")}`)
    toast.success(`Exported ${exportRows.length} jobs to CSV`)
  }

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 dark:bg-violet-500/5 blur-[80px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
            <Briefcase className="h-7 w-7 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400 relative z-10 transition-transform group-hover:scale-110 duration-300" />
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">Job Pipeline</h1>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-2 py-0.5">
                {totalCount} Total
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              {allJobs.length > 0
                ? `Overseeing ${totalCount} active position${totalCount !== 1 ? 's' : ''} in the requisition network.`
                : 'Awaiting new position deployments.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Export CSV Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-10 md:h-11 rounded-xl px-3.5 border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-muted/80 text-xs font-bold gap-2 shadow-xs transition-all active:scale-[0.98]"
            title="Export to CSV"
          >
            <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>

          {/* View Mode Switcher (Table / Kanban) */}
          <div className="flex items-center p-1 rounded-xl bg-muted/40 border border-border/60 shadow-inner">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={cn(
                "h-8 sm:h-9 px-3 rounded-lg text-xs font-bold gap-1.5 transition-all",
                viewMode === 'table'
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              title="Table Grid View"
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Table</span>
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className={cn(
                "h-8 sm:h-9 px-3 rounded-lg text-xs font-bold gap-1.5 transition-all",
                viewMode === 'kanban'
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              title="Kanban Board View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Kanban</span>
            </Button>
          </div>

          {role === "admin" && (
            <Link to='/dashboard/jobs/add' className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-10 md:h-11 rounded-xl gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider">
                <Plus className="h-4 w-4" />
                <span className="px-1">Add Position</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* --- Main Section: Search, Filters & Content --- */}
      <div className="relative group p-4 sm:p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5 space-y-6">
        {/* Search and Filters Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Universal Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, job ID, location, skills, type..."
              className="pl-10 pr-9 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all",
                  statusFilter === 'all'
                    ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'Active' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('Active')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5",
                  statusFilter === 'Active'
                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Active
              </Button>
              <Button
                variant={statusFilter === 'Inactive' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('Inactive')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5",
                  statusFilter === 'Inactive'
                    ? "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <AlertCircle className="h-3 w-3 text-rose-400" />
                Inactive
              </Button>
              <Button
                variant={statusFilter === 'Archived' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('Archived')}
                className={cn(
                  "h-8 rounded-lg text-xs font-bold px-3 transition-all",
                  statusFilter === 'Archived'
                    ? "bg-zinc-700 text-white shadow-sm hover:bg-zinc-800"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                Archived
              </Button>
            </div>

            <span className="text-xs font-medium text-muted-foreground/70 ml-2">
              Showing <strong className="text-foreground">{filteredJobs.length}</strong> of {allJobs.length} positions
            </span>
          </div>
        </div>

        {/* View Mode Switching Content */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            jobs={filteredJobs}
            role={role || ""}
            onShareJob={handleOpenShare}
          />
        ) : (
          <>
            {/* Desktop View: Table */}
            <div className="hidden lg:block">
              {filteredJobs.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={filteredJobs}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={() => fetchNextPage()}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/40 shadow-inner">
                    <Inbox className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {hasFiltersApplied ? "No matching positions found" : "No active deployments found"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {hasFiltersApplied
                        ? "Try adjusting your search keywords or filter options."
                        : "Create your first job listing to get started."}
                    </p>
                  </div>
                  {hasFiltersApplied && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                      }}
                      className="h-8 rounded-xl text-xs font-bold border-border/60"
                    >
                      Clear Search & Filters
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile View: Protocol Cards */}
            <div className="flex flex-col gap-6 lg:hidden">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobProtocolCard key={job.job_id} job={job} />
                ))
              ) : (
                <div className="text-center py-16 bg-white/30 dark:bg-zinc-950/30 rounded-[2rem] border border-dashed border-border/40 p-6 space-y-3">
                  <Inbox className="h-8 w-8 mx-auto text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground font-medium">
                    {hasFiltersApplied ? "No positions match your search criteria." : "No active deployments found."}
                  </p>
                  {hasFiltersApplied && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                      }}
                      className="h-8 rounded-xl text-xs font-bold border-border/60"
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              )}

              {/* Load More Button for Mobile */}
              {hasNextPage && !hasFiltersApplied && (
                <Button
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full h-14 rounded-2xl border-dashed border-border/60 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-xl font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Syncing Data...
                    </>
                  ) : (
                    <>
                      <ChevronsRight className="h-4 w-4" />
                      Load More Positions
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Dynamic Job Share & QR Code Dialog */}
      <JobShareDialog
        job={selectedJobForShare}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  )
}

const JobProtocolCard = ({ job }: { job: JobDetail }) => (
  <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-6 space-y-6">
    <div className="flex items-start justify-between gap-4">
      <JobTitleItem job={job} />
      <JobActionsMenu rowData={job} />
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <JobIdBadge jobId={job.job_id} />
      <JobStatusBadge status={job.status} />
      <JobTypeBadge type={job.job_type} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-border/20">
      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Deployment Site</span>
        <FacilityLocationItem
          location={job.location}
          jobTitle={job.job_title}
          jobId={job.job_id}
        />
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Timeline Protocol</span>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium opacity-60">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{job.start_date ? format(new Date(job.start_date), "MMM dd") : "TBD"}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-border/40" />
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium opacity-60">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{job.end_date ? format(new Date(job.end_date), "MMM dd") : "TBD"}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
)
