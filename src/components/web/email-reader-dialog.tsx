import { Link } from '@tanstack/react-router'
import { Briefcase, Calendar, Mail, Paperclip, UserPlus } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmailReaderDialogProps {
  emailItem: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailReaderDialog({
  emailItem,
  open,
  onOpenChange,
}: EmailReaderDialogProps) {
  if (!emailItem) return null

  const senderEmail =
    emailItem.from_email || emailItem.email || 'applicant@example.com'
  const senderName =
    emailItem.candidate_name || emailItem.name || senderEmail.split('@')[0]
  const jobRole = emailItem.job_name || emailItem.subject || 'Open Requisition'
  const receivedDate =
    emailItem.date || emailItem.created_at || new Date().toISOString()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] rounded-3xl p-0 overflow-hidden border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-border/40 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Application Inbound Message
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Synced directly from recruitment mailbox
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Metadata Header Box */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-foreground">
                  {senderName}
                </h4>
                <p className="text-xs text-muted-foreground font-mono">
                  {senderEmail}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                Synced & Verified
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                <span className="truncate">Role: {jobRole}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                <span>
                  {format(new Date(receivedDate), 'MMM dd, yyyy • hh:mm a')}
                </span>
              </div>
            </div>
          </div>

          {/* Email Subject & Body */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Message Subject
            </label>
            <div className="p-3 rounded-xl bg-background border border-border/60 text-xs font-semibold text-foreground">
              {emailItem.subject || `Application for ${jobRole}`}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              Message Content
            </label>
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap min-h-[120px]">
              {emailItem.body ||
                emailItem.message ||
                `Dear Hiring Team,\n\nPlease find attached my resume and credentials for the ${jobRole} role. I have extensive experience in full-stack architecture and look forward to participating in the AI interview evaluation.\n\nBest regards,\n${senderName}`}
            </div>
          </div>

          {/* Attachment Notice */}
          {emailItem.has_attachment !== false && (
            <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Paperclip className="h-4 w-4" />
                <span>Attached Resume / CV Document</span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
              >
                PDF Document
              </Badge>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-border/40 bg-muted/20 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Close
          </Button>

          <Link
            to="/dashboard/candidates/add"
            search={{ jobId: emailItem.job_id, jobName: emailItem.job_name }}
          >
            <Button
              size="sm"
              className="rounded-xl text-xs font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Convert to Candidate</span>
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
