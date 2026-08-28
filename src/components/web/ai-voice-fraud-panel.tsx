import React, { useState } from 'react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileAudio,
  Fingerprint,
  Mic,
  ShieldAlert,
  UserCheck,
  Volume2,
} from 'lucide-react'
import { getAudioAnalysisResultFn } from '@/lib/server-function'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const audioAnalysisQueryOptions = (
  candidateEmail: string,
  jobId: string,
) =>
  queryOptions({
    queryKey: ['audio-analysis', candidateEmail, jobId],
    queryFn: () =>
      getAudioAnalysisResultFn({
        data: {
          candidateEmail,
          jobId,
        },
      }),
    enabled: Boolean(candidateEmail && jobId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

interface AiVoiceFraudPanelProps {
  candidateEmail: string
  jobId: string
  className?: string
}

export const AiVoiceFraudPanel: React.FC<AiVoiceFraudPanelProps> = ({
  candidateEmail,
  jobId,
  className,
}) => {
  const [expandedRecords, setExpandedRecords] = useState(false)
  const {
    data: analysis,
    isLoading,
    isError,
  } = useQuery(audioAnalysisQueryOptions(candidateEmail, jobId))

  if (isLoading) {
    return (
      <Card
        className={cn(
          'p-6 rounded-3xl border border-border/60 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl shadow-lg animate-pulse',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Bot className="h-5 w-5 animate-spin" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-48 bg-muted rounded-md" />
            <div className="h-3 w-72 bg-muted/60 rounded-md" />
          </div>
        </div>
      </Card>
    )
  }

  if (isError || !analysis || !analysis.total_audios_analyzed) {
    return null // Don't render empty box if no speech analysis was done
  }

  const {
    overall_conclusion = 'Unknown',
    total_audios_analyzed = 0,
    average_confidence = 0,
    ai_generated_count = 0,
    human_count = 0,
    records = [],
  } = analysis

  const avgConfidencePercent = Math.round(average_confidence * 100)
  const conclusionLower = overall_conclusion.toLowerCase()

  const isAiGenerated = conclusionLower.includes('ai')
  const isSuspicious = conclusionLower.includes('suspicious')

  return (
    <Card
      className={cn(
        'relative overflow-hidden rounded-3xl border backdrop-blur-2xl shadow-xl transition-all duration-500 p-6 md:p-8 space-y-6',
        isAiGenerated
          ? 'bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-background border-rose-500/30 dark:border-rose-500/30 shadow-rose-500/5'
          : isSuspicious
            ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background border-amber-500/30 dark:border-amber-500/30 shadow-amber-500/5'
            : 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border-emerald-500/30 dark:border-emerald-500/30 shadow-emerald-500/5',
        className,
      )}
    >
      {/* Ambient Background Glow */}
      <div
        className={cn(
          'absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-60',
          isAiGenerated
            ? 'bg-rose-500/20'
            : isSuspicious
              ? 'bg-amber-500/20'
              : 'bg-emerald-500/20',
        )}
      />

      {/* Header & Overall Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-12 w-12 rounded-2xl flex items-center justify-center border shadow-md shrink-0',
              isAiGenerated
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-rose-500/10'
                : isSuspicious
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-amber-500/10'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-emerald-500/10',
            )}
          >
            {isAiGenerated ? (
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            ) : isSuspicious ? (
              <AlertTriangle className="h-6 w-6 text-amber-500 animate-bounce" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                Voice Authenticity & Speech Synthesis Audit
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 border gap-1.5',
                  isAiGenerated
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : isSuspicious
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                )}
              >
                <Cpu className="w-3 h-3" />
                {overall_conclusion}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              {isAiGenerated
                ? 'Synthetic Text-to-Speech (TTS) cadence and synthetic voice markers identified.'
                : isSuspicious
                  ? `Mixed vocal patterns detected: ${ai_generated_count} synthetic audio segment(s) vs ${human_count} natural response(s).`
                  : 'Natural vocal dynamics, organic breathing cadences, and acoustic consistency verified across all questions.'}
            </p>
          </div>
        </div>

        {/* Score Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-border/60 shadow-sm shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Avg Confidence
            </div>
            <div
              className={cn(
                'text-lg font-black font-mono leading-none mt-0.5',
                isAiGenerated
                  ? 'text-rose-600 dark:text-rose-400'
                  : isSuspicious
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400',
              )}
            >
              {avgConfidencePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60 text-center shadow-xs">
          <Mic className="h-4 w-4 text-indigo-500 mb-1" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Audios Analyzed
          </span>
          <span className="text-base font-black font-mono text-foreground mt-0.5">
            {total_audios_analyzed}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60 text-center shadow-xs">
          <Bot className="h-4 w-4 text-rose-500 mb-1" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            AI TTS Flagged
          </span>
          <span
            className={cn(
              'text-base font-black font-mono mt-0.5',
              ai_generated_count > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-foreground',
            )}
          >
            {ai_generated_count}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60 text-center shadow-xs">
          <UserCheck className="h-4 w-4 text-emerald-500 mb-1" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Human Voice
          </span>
          <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {human_count}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60 text-center shadow-xs">
          <Fingerprint className="h-4 w-4 text-purple-500 mb-1" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Model Certainty
          </span>
          <span className="text-base font-black font-mono text-foreground mt-0.5">
            {avgConfidencePercent}%
          </span>
        </div>
      </div>

      {/* Confidence Progress Meter */}
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
            Spectral Model Confidence
          </span>
          <span className="font-mono">
            {avgConfidencePercent}% Average Certainty
          </span>
        </div>
        <div className="w-full h-3 bg-muted/40 dark:bg-zinc-800/60 rounded-full overflow-hidden p-0.5 border border-border/40">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-out',
              isAiGenerated
                ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-sm shadow-rose-500/50'
                : isSuspicious
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-sm shadow-amber-500/50'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/50',
            )}
            style={{ width: `${Math.max(8, avgConfidencePercent)}%` }}
          />
        </div>
      </div>

      {/* Collapsible Individual Question Audio Records */}
      {records.length > 0 && (
        <div className="space-y-3 relative z-10 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground">
              <Volume2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                Question-by-Question Speech Forensics ({records.length}{' '}
                recordings)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedRecords(!expandedRecords)}
              className="text-xs font-bold gap-1.5 h-8 px-3 rounded-xl hover:bg-muted/60"
            >
              <span>
                {expandedRecords
                  ? 'Hide Audio Breakdown'
                  : 'View Audio Breakdown'}
              </span>
              {expandedRecords ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>

          {/* Show primary/first record reasoning preview if collapsed */}
          {!expandedRecords && records[0]?.reasoning && (
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-border/60 text-xs font-mono text-muted-foreground leading-relaxed pl-5 border-l-2 border-indigo-500/40">
              <span className="font-bold text-foreground mr-1">
                Primary Finding:
              </span>
              {records[0].reasoning}
            </div>
          )}

          {/* Expanded list of each question's audio analysis */}
          {expandedRecords && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {records.map((record, index) => {
                const recordIsAi = record.conclusion
                  .toLowerCase()
                  .includes('ai')
                const recordConf = Math.round(record.confidence_score * 100)

                return (
                  <div
                    key={record.id || index}
                    className={cn(
                      'p-4.5 rounded-2xl border transition-all text-xs space-y-2.5',
                      recordIsAi
                        ? 'bg-rose-500/5 border-rose-500/25'
                        : 'bg-white/60 dark:bg-zinc-900/60 border-border/60',
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[9px] font-black uppercase tracking-wider px-2 py-0.5',
                            recordIsAi
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
                          )}
                        >
                          {record.conclusion} ({recordConf}%)
                        </Badge>
                      </div>

                      {record.timestamp && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {record.timestamp}
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-muted-foreground leading-relaxed pl-3 border-l-2 border-indigo-500/30">
                      {record.reasoning}
                    </p>

                    {record.gcs_uri && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/70 truncate pt-1">
                        <FileAudio className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span className="truncate" title={record.gcs_uri}>
                          {record.gcs_uri}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
