import { useState } from 'react'
import {
  Loader2,
  Mail,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { jobInterviewCandidates } from '@/lib/server-function'

export interface SecondChanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidateEmail: string
  jobId: string
  candidateName?: string
  currentVerdict?: string
  onRetakeAuthorized?: () => void
}

export const RETAKE_REASONS = [
  {
    id: 'glitch',
    label: 'Acoustic / Network Glitch during recording',
    desc: 'Audio dropouts, microphone disconnects, or unexpected network disruptions.',
  },
  {
    id: 'borderline',
    label: 'Borderline Evaluation Score (50% – 65%)',
    desc: 'Candidate was close to the threshold; give a second chance to prove depth.',
  },
  {
    id: 'anxiety',
    label: 'Candidate Self-Reported Technical Issue / Anxiety',
    desc: 'Candidate filed an appeal or experienced initial onboarding hurdles.',
  },
  {
    id: 'dispute',
    label: 'Anti-Fraud False Positive Dispute',
    desc: 'Gaze/movement flags occurred due to dual monitors or room lighting.',
  },
  {
    id: 'discretion',
    label: 'Recruiter Discretionary Second Chance',
    desc: 'Exceptional resume credentials warrant a clean second attempt.',
  },
]

export function SecondChanceDialog({
  open,
  onOpenChange,
  candidateEmail,
  jobId,
  candidateName,
  currentVerdict,
  onRetakeAuthorized,
}: SecondChanceDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('glitch')
  const [validityWindow, setValidityWindow] = useState<string>('48h')
  const [recruiterNotes, setRecruiterNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleAuthorize = async () => {
    if (!candidateEmail || !jobId) {
      toast.error('Missing candidate or job details')
      return
    }

    try {
      setIsSubmitting(true)
      // Call the candidate interview dispatch API to send a fresh invitation
      await jobInterviewCandidates({
        data: {
          job_id: jobId,
          candidates: [candidateEmail],
        },
      })

      // Store retake authorization record in browser storage for instant status persistence
      const storageKey = `eazyai_retake_${jobId}_${candidateEmail}`
      const record = {
        candidateEmail,
        jobId,
        reason:
          RETAKE_REASONS.find((r) => r.id === selectedReason)?.label ||
          selectedReason,
        validity: validityWindow,
        notes: recruiterNotes.trim(),
        authorizedAt: new Date().toISOString(),
        status: 'DISPATCHED',
      }
      localStorage.setItem(storageKey, JSON.stringify(record))

      toast.success(
        `Second-chance interview link dispatched to ${candidateName || candidateEmail}!`,
      )
      onRetakeAuthorized?.()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to authorize retake:', err)
      toast.error('Failed to dispatch retake interview invitation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl p-0 gap-0 rounded-2xl md:rounded-[2rem] border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 pr-14 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 shadow-sm">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                  Authorize Second-Chance Interview
                </DialogTitle>
                <Badge
                  variant="outline"
                  className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                >
                  Karat Redo Style
                </Badge>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Grant a clean retake for candidates with technical glitches,
                anxiety, or borderline scores.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Candidate Card Summary */}
          <div className="p-3.5 rounded-xl sm:rounded-2xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground truncate">
                <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{candidateEmail}</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                Requisition ID: {jobId}
              </div>
            </div>

            {currentVerdict && (
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 self-start sm:self-auto border-border/60"
              >
                Current Status: {currentVerdict}
              </Badge>
            )}
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1">
              <span>Retake Authorization Reason</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={selectedReason}
              onValueChange={(val) => setSelectedReason(val)}
            >
              <SelectTrigger className="h-10 rounded-xl bg-background/80 border-border/60 text-xs font-medium focus:ring-amber-500/20">
                <SelectValue placeholder="Select a reason for retake" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60">
                {RETAKE_REASONS.map((reason) => (
                  <SelectItem
                    key={reason.id}
                    value={reason.id}
                    className="text-xs py-2 focus:bg-amber-500/10 focus:text-foreground cursor-pointer"
                  >
                    <div className="font-semibold">{reason.label}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {RETAKE_REASONS.find((r) => r.id === selectedReason)?.desc}
            </p>
          </div>

          {/* Validity Window */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1">
              <span>New Interview Link Validity Window</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '24h', label: '24 Hours', sub: 'Urgent' },
                { id: '48h', label: '48 Hours', sub: 'Standard' },
                { id: '7d', label: '7 Days', sub: 'Extended' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setValidityWindow(item.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    validityWindow === item.id
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold shadow-xs'
                      : 'bg-card/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground/80">
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Internal Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Audit Note (Internal Record)</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                Optional
              </span>
            </Label>
            <Textarea
              placeholder="e.g. Candidate reported audio crackle on Question 2. Approved clean retake."
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              className="min-h-[70px] resize-none text-xs rounded-xl bg-background/80 border-border/60 p-3"
            />
          </div>

          {/* Informational Notice */}
          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-[11px] text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <span>
              Authorizing a retake will generate a fresh single-use interview
              session and dispatch an updated link to the candidate's email.
            </span>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 sm:p-5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 sm:h-10 rounded-xl text-xs font-semibold border-border/60 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAuthorize}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 sm:h-10 rounded-xl px-4 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                <span>Dispatching Retake...</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                <span>Authorize & Dispatch Retake</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
