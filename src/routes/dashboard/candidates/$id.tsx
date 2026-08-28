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
import { Suspense, useEffect, useState } from 'react'
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
import { getResumePreviewData } from '@/lib/server-function'
import { CandidateDetailSkeleton } from '@/components/web/candidate-detail-skeleton'
import { CandidateSkillRadar } from '@/components/web/candidate-skill-radar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export const candidatesCVQueryOptions = (url: string) =>
  queryOptions({
    queryKey: ['candidates-cv-preview', url],
    queryFn: async () => {
      if (!url) return { download_url: null, data_url: null }
      return getResumePreviewData({
        data: {
          bucket_name: 'cv_bucket_project-project-e7c52c57-c7d4-407d-b4b',
          file_path: url,
        },
      })
    },
    staleTime: 1000 * 60 * 10,
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
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 lg:p-14 pb-24 relative overflow-hidden transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/dashboard/candidates"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="p-1.5 rounded-lg bg-muted border border-border/60 group-hover:bg-muted/80 transition-colors">
              <ChevronLeft className="h-3.5 w-3.5" />
            </div>
            <span>Back to Candidates</span>
          </Link>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-black uppercase tracking-wider px-2.5 py-1"
            >
              <Sparkles className="w-3 h-3 mr-1" /> Verified Candidate
            </Badge>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Candidate Profile Card */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
              {/* Header Gradient */}
              <div className="h-32 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>

              <CardContent className="p-6 sm:p-8 pt-0 relative space-y-6">
                {/* Avatar */}
                <div className="-mt-14 mb-4 flex justify-between items-end">
                  <Avatar className="h-24 w-24 rounded-3xl border-4 border-background shadow-xl ring-2 ring-border/40">
                    <AvatarImage
                      src={candidateData.candidate_image}
                      alt={candidateData.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-3xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-2xl font-black">
                      {candidateData.name
                        ? candidateData.name.substring(0, 2).toUpperCase()
                        : 'CD'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Candidate Info */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-foreground">
                    {candidateData.name || 'Anonymous Candidate'}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {candidateData.email}
                  </p>
                </div>

                <Separator className="opacity-40" />

                {/* Meta Attributes */}
                <div className="space-y-4">
                  <ProfileMetricItem
                    icon={Briefcase}
                    label="Position Applied"
                    value={candidateData.job_name || 'Generic Application'}
                  />
                  <ProfileMetricItem
                    icon={Hash}
                    label="Job Reference ID"
                    value={candidateData.job_id || 'N/A'}
                  />
                  <ProfileMetricItem
                    icon={Calendar}
                    label="Application Date"
                    value={candidateData.uploaded_at || 'Recently added'}
                  />
                  <ProfileMetricItem
                    icon={Compass}
                    label="Application Status"
                    value="Under Active Review"
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

            {/* Candidate Competency Radar */}
            <CandidateSkillRadar candidateName={candidateData.name} />
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
  const resumePath = candidate.resume_url || ''
  let cleanedPath = resumePath
  const uploadIndex = resumePath.indexOf('uploads')
  if (uploadIndex !== -1) {
    cleanedPath = resumePath.substring(uploadIndex)
  } else if (resumePath.startsWith('/')) {
    cleanedPath = resumePath.substring(1)
  }

  const isDirectWebUrl =
    resumePath.startsWith('http://') || resumePath.startsWith('https://')

  const { data } = useSuspenseQuery(
    candidatesCVQueryOptions(isDirectWebUrl ? resumePath : cleanedPath),
  )

  const downloadUrl = data?.download_url || (isDirectWebUrl ? resumePath : '')
  const dataUrl = data?.data_url || ''
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [viewMode, setViewMode] = useState<'native' | 'gview'>('native')

  // Generate an in-memory Blob URL from server base64 data to eliminate Content-Disposition: attachment auto-download prompts
  useEffect(() => {
    if (!dataUrl) return
    if (dataUrl.startsWith('data:')) {
      try {
        const parts = dataUrl.split(',')
        const mimeMatch = parts[0].match(/:(.*?);/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf'
        const base64Data = parts[1]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Uint8Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const blob = new Blob([byteNumbers], { type: mimeType })
        const createdUrl = URL.createObjectURL(blob)
        setBlobUrl(createdUrl)
        return () => {
          URL.revokeObjectURL(createdUrl)
        }
      } catch (e) {
        console.error('Blob URL creation error:', e)
      }
    }
  }, [dataUrl])

  // Active display URL for preview (blobUrl > dataUrl > downloadUrl)
  const displaySrc = blobUrl || dataUrl || downloadUrl

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden flex flex-col h-full">
        <CardHeader className="p-6 sm:p-8 pb-4 border-b border-border/40 bg-muted/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

            <div className="flex items-center gap-2">
              {downloadUrl && (
                <>
                  <div className="flex items-center bg-muted/60 p-0.5 rounded-xl border border-border/60 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('native')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer',
                        viewMode === 'native'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Native PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('gview')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer',
                        viewMode === 'gview'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Google Docs
                    </button>
                  </div>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-sm transition-colors"
                  >
                    <span>Open Fullscreen</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 flex-1 flex flex-col min-h-[700px]">
          <div className="relative flex-1 rounded-2xl bg-muted/30 border border-border/40 overflow-hidden shadow-inner flex flex-col min-h-[650px]">
            {displaySrc ? (
              viewMode === 'native' ? (
                <iframe
                  src={displaySrc}
                  className="w-full flex-1 min-h-[650px] border-none rounded-2xl"
                  title="Candidate Resume Document"
                />
              ) : (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(downloadUrl)}&embedded=true`}
                  className="w-full flex-1 min-h-[650px] border-none rounded-2xl"
                  title="Candidate Resume Document"
                />
              )
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
                    The resume path could not be resolved from cloud storage. Use
                    the fullscreen action above if available.
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
