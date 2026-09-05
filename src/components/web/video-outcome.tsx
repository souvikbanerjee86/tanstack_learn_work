import { useState, useRef, useEffect } from 'react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  Video,
  Download,
  Calendar,
  HardDrive,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Film,
  RotateCcw,
  Gauge,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInterviewVideoList } from '@/lib/server-function'
import type { InterviewVideoRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

export const interviewVideoQueryOptions = (
  email: string,
  job_id: string,
  session_id?: string,
) =>
  queryOptions({
    queryKey: ['interview-video', email, job_id, session_id ?? 'all'],
    queryFn: () =>
      getInterviewVideoList({
        data: { candidate: email, job_id: job_id, session_id },
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 15,
  })

export function VideoRecordingOutcome({
  email,
  id,
  sessionId,
}: {
  email: string
  id: string
  sessionId?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    ...interviewVideoQueryOptions(email, id, sessionId),
    enabled: isOpen, // Fetch on modal open or prefetch
  })

  const videos: Array<InterviewVideoRecord> = data?.data || []
  const activeVideo = videos[selectedVideoIndex] || null

  const handlePlaybackRateChange = (speed: number) => {
    setPlaybackRate(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  // Reset video state when switching recordings
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate
    }
  }, [selectedVideoIndex, playbackRate])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 border-border/60 bg-muted/30 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-500/30 transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Watch Candidate Interview Recording"
        >
          <Film className="w-3.5 h-3.5 text-violet-500 group-hover:scale-110 transition-transform" />
          <span>Interview Video</span>
          {videos.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[10px] font-black">
              {videos.length}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-border/60 shadow-2xl rounded-3xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20 shadow-sm shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                  <span>Candidate Interview Video</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
                  >
                    Cloud Recording
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                  Full session audiovisual recording for {email} • Job: {id}
                </DialogDescription>
              </div>
            </div>

            {/* Quick Refetch / Video Switcher */}
            <div className="flex items-center gap-2">
              {isFetching && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mr-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                  <span>Syncing...</span>
                </div>
              )}
              {videos.length > 1 && (
                <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
                  {videos.map((vid, idx) => (
                    <button
                      key={vid.full_path || idx}
                      onClick={() => setSelectedVideoIndex(idx)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                        selectedVideoIndex === idx
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      Take {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="h-80 sm:h-96 rounded-2xl bg-muted/30 border border-border/60 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <p className="text-xs font-semibold text-muted-foreground">
                Connecting to Cloud Storage archive...
              </p>
            </div>
          ) : isError || !activeVideo ? (
            <div className="p-8 rounded-2xl bg-muted/20 border border-border/60 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="text-sm font-bold text-foreground">
                  No Interview Video Recording Found
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No video was found under{' '}
                  <code className="px-1 py-0.5 rounded bg-muted text-[11px] font-mono text-foreground">
                    interviews/{id}/{email.replace('@', '_at_').replace('.', '_')}
                  </code>
                  . This occurs if the candidate completed an audio-only session
                  or the video is currently synchronizing.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="text-xs font-bold gap-1.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Again</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* HTML5 Video Player */}
              <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video shadow-2xl border border-border/40 group">
                <video
                  ref={videoRef}
                  src={activeVideo.video_url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />

                {/* Floating Fast-Speed Controls Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Gauge className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider mr-1">
                    Speed:
                  </span>
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={cn(
                        'px-1.5 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer',
                        playbackRate === rate
                          ? 'bg-violet-600 text-white'
                          : 'text-zinc-400 hover:text-white',
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Forensic Details & Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <HardDrive className="w-3 h-3 text-violet-500" />
                    <span>File Size</span>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {activeVideo.size_formatted || `${(activeVideo.size_bytes / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <Calendar className="w-3 h-3 text-violet-500" />
                    <span>Recorded Date</span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">
                    {activeVideo.created_at
                      ? new Date(activeVideo.created_at).toLocaleDateString(
                          undefined,
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )
                      : 'Recently captured'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <Film className="w-3 h-3 text-violet-500" />
                    <span>Format</span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate">
                    {activeVideo.content_type || 'video/webm'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Integrity</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Archived & Verified
                  </p>
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <span className="text-[11px] font-mono truncate max-w-xs sm:max-w-md">
                    {activeVideo.file_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeVideo.video_url}
                    download={activeVideo.file_name}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Video</span>
                    </Button>
                  </a>

                  <a
                    href={activeVideo.video_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2.5 rounded-xl text-xs font-bold gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Tab</span>
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
