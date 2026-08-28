import { useState, useEffect, useMemo } from 'react'
import {
  BrainCircuit,
  Calculator,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  FileText,
  HelpCircle,
  RotateCcw,
  Save,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface EvaluatorScratchpadProps {
  jobId: string
  candidateEmail: string
  technicalScore?: number
  keywordMatchRatio?: number
  integrityTrustScore?: number
  className?: string
}

interface VerdictTemplate {
  id: string
  label: string
  icon: typeof ThumbsUp
  color: string
  bg: string
  border: string
  textSnippet: string
}

const VERDICT_TEMPLATES: VerdictTemplate[] = [
  {
    id: 'strong-hire',
    label: 'Strong Hire',
    icon: ThumbsUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    border: 'border-emerald-500/30',
    textSnippet:
      '### Recommendation: Strong Hire\n- **Technical Depth:** Demonstrated exceptional understanding of core systems.\n- **Strengths:** Clear communication, solid architectural reasoning, strong keyword alignment.\n- **Action:** Fast-track to final offer.',
  },
  {
    id: 'inclined',
    label: 'Hire / Inclined',
    icon: CheckCircle2,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
    border: 'border-blue-500/30',
    textSnippet:
      '### Recommendation: Hire (Inclined)\n- **Overview:** Solid domain competencies matching job requirements.\n- **Areas to Note:** Could benefit from minor ramp-up in secondary frameworks.\n- **Action:** Proceed with team matching.',
  },
  {
    id: 'followup',
    label: 'Follow-up Needed',
    icon: HelpCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10 hover:bg-amber-500/20',
    border: 'border-amber-500/30',
    textSnippet:
      '### Recommendation: Follow-up Round Needed\n- **Rationale:** Mixed signals on depth vs breadth. Answers were brief on distributed concepts.\n- **Action:** Schedule 20-minute targeted technical follow-up.',
  },
  {
    id: 'no-hire',
    label: 'No Hire',
    icon: ThumbsDown,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10 hover:bg-rose-500/20',
    border: 'border-rose-500/30',
    textSnippet:
      '### Recommendation: No Hire\n- **Reasoning:** Significant gap between role seniority requirements and demonstrated depth.\n- **Action:** Archive profile with respectful feedback.',
  },
]

export function EvaluatorScratchpad({
  jobId,
  candidateEmail,
  technicalScore = 75,
  keywordMatchRatio = 70,
  integrityTrustScore = 90,
  className,
}: EvaluatorScratchpadProps) {
  const storageKey = `eazyai_scratchpad_${jobId}_${candidateEmail}`

  const [notes, setNotes] = useState<string>('')
  const [selectedVerdictId, setSelectedVerdictId] = useState<string>('')
  const [recruiterRating, setRecruiterRating] = useState<number>(8)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  // Custom Weight Adjustments
  const [techWeight, setTechWeight] = useState<number>(40)
  const [keywordWeight, setKeywordWeight] = useState<number>(25)
  const [trustWeight, setTrustWeight] = useState<number>(20)
  const [recruiterWeight, setRecruiterWeight] = useState<number>(15)

  // Load saved notes on mount or when candidate changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setNotes(parsed.notes || '')
        setSelectedVerdictId(parsed.verdictId || '')
        if (parsed.recruiterRating) setRecruiterRating(parsed.recruiterRating)
        if (parsed.updatedAt) setLastSaved(new Date(parsed.updatedAt).toLocaleTimeString())
      } else {
        setNotes('')
        setSelectedVerdictId('')
        setLastSaved(null)
      }
    } catch (err) {
      console.error('Failed to load notes from localStorage', err)
    }
  }, [storageKey])

  // Save notes to localStorage
  const handleSave = (newNotes: string, verdictId: string, rating: number) => {
    try {
      const now = new Date()
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          notes: newNotes,
          verdictId,
          recruiterRating: rating,
          updatedAt: now.toISOString(),
        })
      )
      setLastSaved(now.toLocaleTimeString())
    } catch (err) {
      console.error('Failed to save notes', err)
    }
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    handleSave(value, selectedVerdictId, recruiterRating)
  }

  const handleApplyTemplate = (tpl: VerdictTemplate) => {
    setSelectedVerdictId(tpl.id)
    const updated = notes.trim()
      ? `${notes}\n\n${tpl.textSnippet}`
      : tpl.textSnippet
    setNotes(updated)
    handleSave(updated, tpl.id, recruiterRating)
    toast.success(`Applied "${tpl.label}" template`)
  }

  const handleClear = () => {
    if (confirm('Clear all scratchpad notes for this candidate?')) {
      setNotes('')
      setSelectedVerdictId('')
      localStorage.removeItem(storageKey)
      setLastSaved(null)
      toast.info('Scratchpad cleared')
    }
  }

  // Calculate Weighted Composite Score
  const compositeScore = useMemo(() => {
    const totalWeight = techWeight + keywordWeight + trustWeight + recruiterWeight || 100
    const weightedSum =
      (technicalScore * techWeight) +
      (keywordMatchRatio * keywordWeight) +
      (integrityTrustScore * trustWeight) +
      (recruiterRating * 10 * recruiterWeight)
    return Math.round(weightedSum / totalWeight)
  }, [
    technicalScore,
    keywordMatchRatio,
    integrityTrustScore,
    recruiterRating,
    techWeight,
    keywordWeight,
    trustWeight,
    recruiterWeight,
  ])

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Exceptional Match', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' }
    if (score >= 70) return { label: 'Strong Fit', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' }
    if (score >= 55) return { label: 'Moderate Fit', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' }
    return { label: 'Low Alignment', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' }
  }

  const badge = getScoreBadge(compositeScore)

  const handleCopySummary = async () => {
    const summaryText = `# Candidate Evaluation Summary
**Candidate:** ${candidateEmail}
**Position ID:** ${jobId}
**Composite Fit Score:** ${compositeScore}/100 (${badge.label})

### Score Breakdown:
- **Technical AI Score:** ${technicalScore}/100 (Weight: ${techWeight}%)
- **Keyword Rubric Match:** ${keywordMatchRatio}% (Weight: ${keywordWeight}%)
- **Integrity & Trust Index:** ${integrityTrustScore}% (Weight: ${trustWeight}%)
- **Recruiter Rating:** ${recruiterRating}/10 (Weight: ${recruiterWeight}%)

### Evaluator Notes & Verdict:
${notes || 'No notes entered.'}

---
*Generated via EazyAI Evaluator Workbench Copilot*`

    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      toast.success('Executive briefing copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <Card className={cn(
      'relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 space-y-6',
      className
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/40">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-heading font-black text-foreground">
                Evaluator Workbench Copilot
              </h3>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                Live Scratchpad
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Client-side notes and weighted scoring auto-saved to local browser storage.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastSaved && (
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
              <Clock className="h-3 w-3 text-emerald-500" />
              Saved {lastSaved}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="h-8.5 px-3 rounded-xl border-border/60 text-xs font-bold gap-1.5 shadow-xs cursor-pointer active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Briefing</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8.5 px-2.5 rounded-xl text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Clear Scratchpad"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Composite Score Calculator Widget */}
      <div className="p-5 rounded-2xl bg-muted/30 dark:bg-zinc-900/40 border border-border/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Composite Fit Score
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-heading font-black tracking-tight text-foreground">
              {compositeScore}<span className="text-sm font-normal text-muted-foreground">/100</span>
            </span>
            <Badge variant="outline" className={cn('text-[11px] font-bold px-2.5 py-0.5', badge.color)}>
              {badge.label}
            </Badge>
          </div>
        </div>

        {/* Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-center">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">AI Technical</span>
            <span className="text-sm font-bold font-heading text-indigo-600 dark:text-indigo-400">{technicalScore}%</span>
            <span className="text-[9px] text-muted-foreground/70 block">({techWeight}% wt)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-center">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Keywords</span>
            <span className="text-sm font-bold font-heading text-purple-600 dark:text-purple-400">{keywordMatchRatio}%</span>
            <span className="text-[9px] text-muted-foreground/70 block">({keywordWeight}% wt)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-center">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Integrity Trust</span>
            <span className="text-sm font-bold font-heading text-emerald-600 dark:text-emerald-400">{integrityTrustScore}%</span>
            <span className="text-[9px] text-muted-foreground/70 block">({trustWeight}% wt)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-background/60 border border-border/40 text-center">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Your Rating</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              {[6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setRecruiterRating(num)
                    handleSave(notes, selectedVerdictId, num)
                  }}
                  className={cn(
                    'h-5 w-5 rounded text-[10px] font-bold transition-all cursor-pointer',
                    recruiterRating === num
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground/70 block">({recruiterWeight}% wt)</span>
          </div>
        </div>
      </div>

      {/* Quick Verdict Template Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Edit3 className="h-3.5 w-3.5" />
          Insert Structured Verdict Template:
        </span>
        <div className="flex flex-wrap gap-2">
          {VERDICT_TEMPLATES.map((tpl) => {
            const Icon = tpl.icon
            const isSelected = selectedVerdictId === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer active:scale-[0.98]',
                  tpl.bg,
                  tpl.border,
                  isSelected ? 'ring-2 ring-indigo-500/40 font-bold' : ''
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', tpl.color)} />
                <span className="text-foreground">{tpl.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Evaluator Notes & Observations</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{notes.length} characters</span>
        </label>
        <Textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Type interview observations, key answers, follow-up questions, or click a template above to generate structured feedback..."
          rows={5}
          className="rounded-2xl border-border/60 bg-background/50 focus:bg-background transition-all resize-y text-xs sm:text-sm font-normal p-4 leading-relaxed shadow-inner"
        />
      </div>
    </Card>
  )
}
