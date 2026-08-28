import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Download,
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Waves,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface AudioWaveformPlayerProps {
  src: string
  title?: string
  candidateName?: string
  className?: string
}

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 2]

export function AudioWaveformPlayer({
  src,
  title,
  candidateName,
  className,
}: AudioWaveformPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Real-time Canvas Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const bars = 36
      const spacing = 3
      const barWidth = (canvas.width - bars * spacing) / bars

      for (let i = 0; i < bars; i++) {
        // Compute wave amplitude: higher movement when playing, calm baseline when paused
        let barHeight = 6
        if (isPlaying) {
          const t = Date.now() / 120
          barHeight =
            Math.sin(t + i * 0.4) * 14 +
            Math.cos(t * 0.8 + i * 0.2) * 8 +
            18
        } else {
          barHeight = Math.sin(i * 0.3) * 6 + 10
        }

        const x = i * (barWidth + spacing)
        const y = (canvas.height - barHeight) / 2

        // Gradient styling
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        if (isPlaying) {
          gradient.addColorStop(0, '#818cf8') // indigo-400
          gradient.addColorStop(1, '#6366f1') // indigo-500
        } else {
          gradient.addColorStop(0, 'rgba(161, 161, 170, 0.4)') // zinc-400
          gradient.addColorStop(1, 'rgba(113, 113, 122, 0.4)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, Math.max(4, barHeight), 2)
        ctx.fill()
      }

      if (isPlaying) {
        animationId = requestAnimationFrame(render)
      }
    }

    render()

    if (isPlaying) {
      animationId = requestAnimationFrame(render)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isPlaying])

  // Audio Event Listeners
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => console.error('Audio playback error:', err))
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = newProgress * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds))
    setCurrentTime(audio.currentTime)
  }

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = rate
    setPlaybackRate(rate)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        'p-4 sm:p-5 rounded-2xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg space-y-3.5',
        className
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Waves className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-foreground truncate block">
              {title || 'Interview Audio Answer'}
            </span>
            {candidateName && (
              <span className="text-[10px] text-muted-foreground truncate block">
                {candidateName}
              </span>
            )}
          </div>
        </div>

        {/* Speed Pills */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/40 shrink-0">
          {PLAYBACK_SPEEDS.map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => changePlaybackRate(rate)}
              className={cn(
                'px-1.5 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer',
                playbackRate === rate
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Waveform Canvas Visualization */}
      <div className="relative w-full h-12 flex items-center justify-center bg-zinc-950/5 dark:bg-zinc-950/40 rounded-xl overflow-hidden px-2">
        <canvas
          ref={canvasRef}
          width={360}
          height={48}
          className="w-full h-full"
        />
      </div>

      {/* Interactive Progress Bar */}
      <div
        onClick={handleSeek}
        className="relative w-full h-2 bg-muted/60 dark:bg-zinc-800 rounded-full cursor-pointer overflow-hidden group"
      >
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Left: Time display */}
        <div className="text-[11px] font-mono font-medium text-muted-foreground">
          <span className="text-foreground font-bold">{formatTime(currentTime)}</span>
          <span className="opacity-40"> / </span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Center: Playback buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipTime(-5)}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={togglePlay}
            size="icon"
            className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-[0.96] transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 fill-white translate-x-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => skipTime(5)}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            title="Skip forward 5 seconds"
          >
            <FastForward className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Right: Mute & Download */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </Button>

          <a
            href={src}
            download
            className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Download Audio"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
