import { useState } from 'react'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Mail,
  Plus,
  Scale,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import type { candidate } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface CandidateComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Array<candidate>
  onRemoveCandidate: (email: string) => void
  onClearAll?: () => void
}

export function CandidateComparisonDialog({
  open,
  onOpenChange,
  candidates,
  onRemoveCandidate,
  onClearAll,
}: CandidateComparisonDialogProps) {
  const navigate = useNavigate()

  if (candidates.length === 0) return null

  const isSingle = candidates.length === 1

  const handleOpenCandidate = (cand: candidate) => {
    onOpenChange(false)
    const extraData = {
      id: cand.id,
      email: cand.email,
      name: cand.name,
      job_name: cand.job_name,
      uploaded_at: cand.uploaded_at
        ? format(new Date(cand.uploaded_at), 'PPP')
        : '',
      resume_url: cand.resume_url,
      job_id: cand.job_id,
      candidate_image: cand.candidate_image,
    }
    navigate({
      to: '/dashboard/candidates/$id',
      params: { id: cand.id },
      state: extraData as any,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl lg:max-w-6xl w-[96vw] rounded-[2.5rem] border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-border/40 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-sm text-indigo-600 dark:text-indigo-400 shrink-0">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    Candidate Comparison Matrix
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-2.5 py-0.5"
                  >
                    {candidates.length} Selected
                  </Badge>
                </div>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                  Side-by-side assessment of credentials, job alignment, and verification status
                </DialogDescription>
              </div>
            </div>

            {onClearAll && candidates.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-9 px-3 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 self-start sm:self-auto cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Comparison Grid */}
        <div
          className={cn(
            'grid gap-6',
            candidates.length === 1
              ? 'grid-cols-1 md:grid-cols-2'
              : candidates.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : candidates.length === 3
                  ? 'grid-cols-1 md:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {candidates.map((cand, idx) => {
            const formattedDate = cand.uploaded_at
              ? format(new Date(cand.uploaded_at), 'MMM dd, yyyy')
              : 'Recently Added'
            const initials = (cand.name || cand.email || 'CA')
              .substring(0, 2)
              .toUpperCase()

            return (
              <div
                key={cand.id || cand.email || idx}
                className="relative rounded-3xl border border-border/70 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 sm:p-6 space-y-5 shadow-lg flex flex-col justify-between group hover:border-indigo-500/40 hover:shadow-xl transition-all"
              >
                {/* Remove candidate button */}
                <button
                  type="button"
                  onClick={() => onRemoveCandidate(cand.id || cand.email)}
                  className="absolute top-4 right-4 h-7 w-7 rounded-full bg-muted/60 hover:bg-rose-500/10 hover:text-rose-600 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <div className="space-y-4">
                  {/* Candidate Identity */}
                  <div className="flex items-center gap-3.5 pr-6">
                    <Avatar className="h-12 w-12 rounded-2xl border border-indigo-500/20 shadow-sm shrink-0">
                      <AvatarFallback className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-1.5 py-0"
                        >
                          Profile #{idx + 1}
                        </Badge>
                      </div>
                      <h4 className="text-base font-bold text-foreground truncate mt-0.5">
                        {cand.name || 'Candidate Profile'}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate font-medium flex items-center gap-1.5">
                        <Mail className="h-3 w-3 shrink-0 text-indigo-500" />
                        <span className="truncate">{cand.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Attributes Details */}
                  <div className="space-y-2.5 pt-3 border-t border-border/40 text-xs">
                    <div className="p-3 rounded-2xl bg-muted/30 border border-border/30 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                        Target Position
                      </span>
                      <p className="font-bold text-foreground truncate text-sm">
                        {cand.job_name || 'Generic Application'}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground truncate">
                        ID: {cand.job_id || 'N/A'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/30">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        Applied:
                      </span>
                      <span className="font-bold text-foreground">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        Vector Verification:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Indexed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-3 border-t border-border/40">
                  <Button
                    type="button"
                    onClick={() => handleOpenCandidate(cand)}
                    className="w-full h-10 rounded-xl text-xs font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>View Full Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Placeholder Slot when only 1 candidate is selected */}
          {isSingle && (
            <div className="rounded-3xl border-2 border-dashed border-border/60 bg-muted/10 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="h-14 w-14 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center text-muted-foreground">
                <Users className="h-7 w-7" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h4 className="text-base font-bold text-foreground">
                  Add Candidate to Compare
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click the <strong>Compare</strong> button on another candidate from the list to benchmark them side-by-side.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 rounded-xl text-xs font-bold border-border/60 cursor-pointer hover:bg-muted/80"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Select from List
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
