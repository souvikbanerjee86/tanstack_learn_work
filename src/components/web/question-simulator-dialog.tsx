import { useEffect, useState } from 'react'
import { Camera, Eye, Mic, Play, RotateCcw, Square, Timer } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface QuestionSimulatorDialogProps {
  questionText: string
  jobName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestionSimulatorDialog({
  questionText,
  jobName,
  open,
  onOpenChange,
}: QuestionSimulatorDialogProps) {
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per question default
  const [isRecording, setIsRecording] = useState(false)
  const [simulatedAnswer, setSimulatedAnswer] = useState('')
  const [recordingCompleted, setRecordingCompleted] = useState(false)

  // Reset simulator timer on open
  useEffect(() => {
    if (open) {
      setTimeLeft(120)
      setIsRecording(false)
      setSimulatedAnswer('')
      setRecordingCompleted(false)
    }
  }, [open])

  // Timer countdown effect when recording
  useEffect(() => {
    let interval: any = null
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRecording) {
      setIsRecording(false)
      setRecordingCompleted(true)
      toast.info('Simulated time limit reached')
    }
    return () => clearInterval(interval)
  }, [isRecording, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      setRecordingCompleted(true)
      toast.success('Simulated answer recorded successfully')
    } else {
      setIsRecording(true)
      setRecordingCompleted(false)
    }
  }

  const handleReset = () => {
    setTimeLeft(120)
    setIsRecording(false)
    setSimulatedAnswer('')
    setRecordingCompleted(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] rounded-3xl p-0 overflow-hidden border border-border/60 bg-zinc-950 text-white shadow-2xl">
        <DialogTitle className="sr-only">Candidate View Simulator</DialogTitle>
        {/* Simulated Interview Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-200">
                Candidate View Simulator
              </span>
              <p className="text-[10px] text-zinc-400 font-mono">
                Live Proctored Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer Pill */}
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-colors',
                timeLeft <= 30
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700',
              )}
            >
              <Timer className="h-3.5 w-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Proctoring Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              <Camera className="h-3 w-3" />
              <span>Camera Active</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Simulated Candidate Question Card */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
              >
                Question 1 of 5
              </Badge>
              {jobName && (
                <span className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px]">
                  Role: {jobName}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed">
              {questionText ||
                'Explain your experience with microservice architecture and handling distributed system failures.'}
            </h3>
          </div>

          {/* Audio Waveform & Speech Simulator */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Mic
                  className={cn(
                    'h-4 w-4',
                    isRecording
                      ? 'text-rose-400 animate-pulse'
                      : 'text-zinc-500',
                  )}
                />
                {isRecording
                  ? 'Listening & Transcribing Speech...'
                  : recordingCompleted
                    ? 'Audio Response Captured'
                    : 'Click Start to Speak Answer'}
              </span>
              {isRecording && (
                <span className="text-[10px] font-mono text-rose-400 uppercase font-black tracking-widest animate-pulse">
                  ● REC LIVE
                </span>
              )}
            </div>

            {/* Simulated Sound Wave */}
            <div className="flex items-center justify-center gap-1.5 h-12 bg-zinc-950 rounded-xl px-4 border border-zinc-800/60 overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1 rounded-full transition-all duration-150',
                    isRecording
                      ? 'bg-indigo-400 animate-pulse'
                      : recordingCompleted
                        ? 'bg-emerald-500/60 h-4'
                        : 'bg-zinc-800 h-2',
                  )}
                  style={{
                    height: isRecording
                      ? `${Math.max(6, Math.sin(i + timeLeft) * 20 + 22)}px`
                      : undefined,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>

            {/* Candidate Written Notes / Code Area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Optional Code / Working Scratchpad (Simulated)
              </label>
              <Textarea
                value={simulatedAnswer}
                onChange={(e) => setSimulatedAnswer(e.target.value)}
                placeholder="Candidate can optionally type pseudocode or architecture notes here during the response..."
                className="bg-zinc-950 border-zinc-800 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 rounded-xl resize-none h-24 focus:border-indigo-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-zinc-400 hover:text-white text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Timer</span>
              </Button>

              <Button
                onClick={handleToggleRecording}
                className={cn(
                  'font-bold text-xs gap-2 rounded-xl transition-all shadow-md',
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
                )}
              >
                {isRecording ? (
                  <>
                    <Square className="h-3.5 w-3.5 fill-white" />
                    <span>Stop & Finalize Answer</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>
                      {recordingCompleted
                        ? 'Re-record Answer'
                        : 'Start Speaking Answer'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
          <span className="text-[11px] opacity-75">
            This modal simulates the interviewee portal rendering and timing
            rules.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
          >
            Exit Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
