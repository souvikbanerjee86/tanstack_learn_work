import { Link, createFileRoute, useLocation } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  Briefcase,
  Calendar,
  ChevronLeft,
  Clock,
  Compass,
  Edit,
  FileText,
  Layers,
  MapPin,
  Sparkles,
  TimerIcon,
  UserPlus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PDFJobDownloadButton } from '@/components/web/pdf-job-download-button'
import { FacilityMapDialog } from '@/components/web/facility-map-dialog'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard/jobs/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()
  const jobInfo = location.state as any

  if (!jobInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-5 animate-in fade-in duration-500">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground shadow-sm">
          <Briefcase className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-xl font-bold text-foreground">
            Requisition Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested job posting is no longer active in cache or was
            refreshed.
          </p>
        </div>
        <Link to="/dashboard/jobs">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-5 text-xs font-bold border-border/60"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Return to Job Pipeline
          </Button>
        </Link>
      </div>
    )
  }

  const job = jobInfo
  const isActive = job.status?.toLowerCase() === 'active' || !job.status

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans selection:bg-indigo-500/30 overflow-hidden p-4 sm:p-6 md:p-10 lg:p-14 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Ambient Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
        {/* Top Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/dashboard/jobs">
            <Button
              variant="ghost"
              size="sm"
              className="group gap-2 px-3.5 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Back to Pipeline
              </span>
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* PDF Download Button */}
            <PDFJobDownloadButton job={job} />

            <Link to="/dashboard/discover">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3.5 rounded-xl border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-xs font-bold hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                <span>AI Match Profiles</span>
              </Button>
            </Link>

            <Link
              to="/dashboard/jobs/$id/edit"
              params={{ id: job.job_id }}
              state={job}
            >
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3.5 rounded-xl border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-xs font-bold hover:bg-muted transition-all cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Requisition</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* --- HERO REQUISITION CARD --- */}
        <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
          <CardContent className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="space-y-4 max-w-3xl min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      'h-6 px-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg',
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-muted-foreground border-border/60',
                    )}
                  >
                    <div
                      className={cn(
                        'h-1.5 w-1.5 rounded-full mr-1.5',
                        isActive
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-muted-foreground',
                      )}
                    />
                    {job.status || 'Active'}
                  </Badge>

                  <Badge
                    variant="outline"
                    className="h-6 px-2.5 text-[10px] font-mono font-bold text-muted-foreground bg-muted/30 border-border/60"
                  >
                    JOB ID: {job.job_id}
                  </Badge>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15] break-words">
                  {job.job_title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-muted-foreground pt-1">
                  <FacilityMapDialog
                    locationString={job.location}
                    jobTitle={job.job_title}
                    jobId={job.job_id}
                    trigger={
                      <button
                        type="button"
                        className="group/loc flex items-start gap-1.5 max-w-full text-left hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        title="View facility deployment map"
                      >
                        <MapPin className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 group-hover/loc:scale-110 transition-transform" />
                        <span className="break-words whitespace-normal font-semibold text-foreground/90 group-hover/loc:underline underline-offset-2">
                          {job.location}
                        </span>
                      </button>
                    }
                  />
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span className="font-semibold text-foreground/80">
                      {job.job_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>
                      Posted{' '}
                      {format(
                        job.created_at ? new Date(job.created_at) : new Date(),
                        'MMM d, yyyy',
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] w-full md:w-auto shrink-0">
                <Link
                  to="/dashboard/candidates/add"
                  search={{ jobId: job.job_id, jobName: job.job_title }}
                  className="w-full"
                >
                  <Button className="w-full h-12 gap-2 text-xs font-black uppercase tracking-wider rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Candidate</span>
                  </Button>
                </Link>

                <Link to="/dashboard/discover" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full h-12 gap-2 text-xs font-bold rounded-xl border-border/60 bg-white/60 dark:bg-zinc-900/60 hover:bg-muted transition-all"
                  >
                    <Compass className="h-4 w-4 text-indigo-500" />
                    <span>Discover CVs</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: DESCRIPTION */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-[2rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
              <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/40 bg-muted/15 flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg font-black tracking-tight text-foreground">
                      Job Specification & Scope
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground font-medium truncate">
                      Complete role mandate, requirements, and responsibilities
                    </CardDescription>
                  </div>
                </div>

                <div className="shrink-0">
                  <PDFJobDownloadButton job={job} className="h-8 text-[11px]" />
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-6">
                <div className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line font-normal selection:bg-indigo-500/30 break-words">
                  {job.job_description}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: REQUISITION METRICS */}
          <div className="space-y-6">
            <Card className="rounded-[2rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden sticky top-6">
              <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/15">
                <CardTitle className="text-base font-black tracking-tight text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  <span>Requisition Parameters</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid gap-5">
                  <FacilityMapDialog
                    locationString={job.location}
                    jobTitle={job.job_title}
                    jobId={job.job_id}
                    trigger={
                      <div className="w-full cursor-pointer group/metric">
                        <MetricItem
                          icon={MapPin}
                          label="Primary Location (Click for Map)"
                          value={job.location}
                          subValue="Tap to inspect interactive facility map"
                        />
                      </div>
                    }
                  />
                  <MetricItem
                    icon={Briefcase}
                    label="Employment Classification"
                    value={job.job_type}
                  />
                  <MetricItem
                    icon={TimerIcon}
                    label="Experience Requirement"
                    value={`${job.experience} Years of Proven Track Record`}
                  />
                  <MetricItem
                    icon={Calendar}
                    label="Requisition Timeline"
                    value={`Active until ${job.end_date ? format(new Date(job.end_date), 'MMM d, yyyy') : 'Open Ongoing'}`}
                    subValue={
                      job.start_date
                        ? `Posted: ${format(new Date(job.start_date), 'MMM d, yyyy')}`
                        : undefined
                    }
                  />
                </div>

                <Separator className="opacity-40" />

                {/* Candidate Evaluation Spotlight */}
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Candidate Spotlight</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    Evaluations for this position automatically assess candidate
                    depth against the benchmark requirements specified above.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricItem({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: any
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div className="flex gap-3.5 group min-w-0">
      <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl h-fit border border-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-bold text-foreground tracking-tight leading-snug break-words whitespace-normal">
          {value}
        </p>
        {subValue && (
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5 break-words whitespace-normal">
            {subValue}
          </p>
        )}
      </div>
    </div>
  )
}
