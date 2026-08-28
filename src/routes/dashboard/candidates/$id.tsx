import { Link, createFileRoute, useLocation } from '@tanstack/react-router'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Compass,
  ExternalLink,
  FileText,
  Hash,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import type { candidate } from '@/lib/types'
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
import { getDownloadURL } from '@/lib/server-function'
import { CandidateDetailSkeleton } from '@/components/web/candidate-detail-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const candidatesCVQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ['candidates', url],
    queryFn: () =>
      getDownloadURL({
        data: {
          bucket_name: 'cv_bucket_project-project-e7c52c57-c7d4-407d-b4b',
          file_path: url,
        },
      }),
  })

export const Route = createFileRoute('/dashboard/candidates/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()
  const candidateData = location.state as any

  if (!candidateData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-5 animate-in fade-in duration-500">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-center text-muted-foreground shadow-sm">
          <User className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-xl font-bold text-foreground">
            Candidate Profile Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The candidate record is no longer available in the active session
            state.
          </p>
        </div>
        <Link to="/dashboard/candidates">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-5 text-xs font-bold border-border/60"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Return to Candidate Pool
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-transparent font-sans selection:bg-indigo-500/30 overflow-hidden p-4 sm:p-6 md:p-10 lg:p-14 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Ambient Background Glow Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
        {/* Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/dashboard/candidates">
            <Button
              variant="ghost"
              size="sm"
              className="group gap-2 px-3.5 h-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Back to Candidates
              </span>
            </Button>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link to="/dashboard/discover">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 px-3.5 rounded-xl border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-xs font-bold hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                <span>Compare with Job Benchmarks</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
              <CardContent className="p-6 sm:p-8 text-center space-y-6">
                <div className="relative inline-block mt-2">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-110" />
                  {candidateData.candidate_image ? (
                    <Avatar className="h-28 w-28 rounded-3xl flex items-center justify-center mx-auto border-4 border-background shadow-2xl relative z-10 overflow-hidden">
                      <AvatarImage
                        src={candidateData.candidate_image}
                        alt={candidateData.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xl uppercase">
                        {candidateData.name?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-28 w-28 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto border-4 border-background shadow-2xl relative z-10">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-foreground">
                    {candidateData.name}
                  </h2>
                  <p className="text-xs font-semibold text-muted-foreground truncate">
                    {candidateData.email}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="px-3.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-mono text-[10px] font-bold"
                >
                  REF:{' '}
                  {candidateData.id ? candidateData.id.substring(0, 10) : 'N/A'}
                </Badge>

                <Separator className="opacity-40" />

                <div className="space-y-4 text-left">
                  <ProfileMetricItem
                    icon={Briefcase}
                    label="Application Target"
                    value={candidateData.job_name || 'General Applicant'}
                  />
                  <ProfileMetricItem
                    icon={Hash}
                    label="Position Identifier"
                    value={candidateData.job_id || 'Unassigned'}
                  />
                  <ProfileMetricItem
                    icon={Calendar}
                    label="Ingestion Timestamp"
                    value={candidateData.uploaded_at || 'N/A'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Verification Box */}
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Document Integrity
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-foreground/90 bg-muted/40 p-3 rounded-xl border border-border/40">
                <span>Vector Indexing:</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active in Pool
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: CV Preview */}
          <Suspense fallback={<CandidateDetailSkeleton />}>
            <CVContent candidate={candidateData} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CVContent({ candidate }: { candidate: candidate }) {
  let fileUrl = ''
  const resumePath = candidate.resume_url || ''
  const uploadIndex = resumePath.indexOf('uploads')
  const cleanedPath =
    uploadIndex !== -1 ? resumePath.substring(uploadIndex) : resumePath
  const { data } = useSuspenseQuery(candidatesCVQueryOptions(cleanedPath))

  if (data?.download_url) {
    fileUrl = encodeURIComponent(data.download_url)
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden flex flex-col h-full">
        <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/40 bg-muted/15">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight text-foreground">
                  Candidate Portfolio & Resume
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Live document render with embedded previewer
                </CardDescription>
              </div>
            </div>

            {data?.download_url && (
              <a
                href={data.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-bold text-foreground border border-border/60 transition-colors"
              >
                <span>Open Fullscreen</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col min-h-[700px]">
          <div className="relative flex-1 rounded-2xl bg-muted/30 border border-border/40 overflow-hidden shadow-inner flex flex-col">
            {fileUrl ? (
              <iframe
                src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                className="w-full flex-1 min-h-[620px] border-none"
                title="Candidate Resume Document"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4 my-auto">
                <div className="p-5 rounded-2xl bg-muted border border-border/60 shadow-sm">
                  <FileText className="h-10 w-10 text-muted-foreground/60" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="text-base font-bold text-foreground">
                    Document Stream Unavailable
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The preview could not be loaded directly into the frame. Use
                    the fullscreen action above.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/30">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                Database ID
              </p>
              <p className="text-xs font-mono text-foreground font-semibold truncate">
                {candidate.id}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/30 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
                  File Format
                </p>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  PDF Application Document
                </p>
              </div>
              <Sparkles className="h-4 w-4 text-indigo-500 opacity-60" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileMetricItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3.5 group min-w-0">
      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-bold text-foreground tracking-tight truncate">
          {value}
        </p>
      </div>
    </div>
  )
}
