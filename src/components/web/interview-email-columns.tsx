import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Mail,
  MoreHorizontal,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { CandidateRecord } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export const InterviewActions = ({ rowData }: { rowData: CandidateRecord }) => {
  const navigate = useNavigate()
  const extraData = {
    interview_status: rowData.interview_status,
    feedback: rowData.feedback,
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-muted/80 data-[state=open]:bg-muted"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/dashboard/interview/$id"
            params={{ id: rowData.job_id }}
            search={{ email: rowData.candidate_email }}
            state={extraData as any}
            preload="intent"
            className="flex items-center gap-2 cursor-pointer w-full"
          >
            <Eye className="h-4 w-4" />
            <span>View details</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const candidateInterviewEmailColumns: Array<ColumnDef<CandidateRecord>> = [
  {
    accessorKey: 'job_id',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Job ID
      </span>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
        {row.getValue('job_id')}
      </span>
    ),
  },
  {
    accessorKey: 'candidate_email',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Candidate
      </span>
    ),
    cell: ({ row }) => {
      const email = (row.getValue('candidate_email') as string) || ''
      const jobId = row.original.job_id
      const extraData = {
        interview_status: row.original.interview_status,
        feedback: row.original.feedback,
      }
      return (
        <Link
          to="/dashboard/interview/$id"
          params={{ id: jobId }}
          search={{ email }}
          state={extraData as any}
          preload="intent"
          className="flex items-center gap-2 text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors font-medium"
        >
          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm truncate max-w-[220px]">{email}</span>
        </Link>
      )
    },
  },

  {
    accessorKey: 'processed_at',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Processed
      </span>
    ),
    cell: ({ row }) => {
      const value = row.getValue('processed_at') as string | undefined
      if (!value) {
        return (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      }
      try {
        const formatted = format(new Date(value), 'MMM dd, yyyy')
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatted}</span>
          </div>
        )
      } catch {
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{String(value)}</span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: 'sent_at',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sent At
      </span>
    ),
    cell: ({ row }) => {
      const value = row.getValue('sent_at') as string | undefined
      if (!value) {
        return (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic">
            <Clock className="h-3 w-3" />
            Not sent
          </span>
        )
      }
      try {
        const formatted = format(new Date(value), 'MMM dd, yyyy')
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatted}</span>
          </div>
        )
      } catch {
        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{String(value)}</span>
          </div>
        )
      }
    },
  },

  {
    accessorKey: 'email_sent',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Email
      </span>
    ),
    cell: ({ row }) => {
      const status = Boolean(row.getValue('email_sent'))
      return (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              status ? 'bg-emerald-500' : 'bg-gray-400',
            )}
          />
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-md text-xs font-medium',
              status
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30'
                : 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-100 dark:border-gray-800/30',
            )}
          >
            {status ? 'Sent' : 'Not Sent'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'interview_status',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Evaluation
      </span>
    ),
    cell: ({ row }) => {
      const status = (row.getValue('interview_status') as string | undefined) || ''
      const isEvaluated = status.toUpperCase() === 'EVALUATED'
      const isPending = status.toUpperCase() === 'PENDING'
      return (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
            isEvaluated &&
              'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30',
            isPending &&
              'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30',
            !isEvaluated &&
              !isPending &&
              'bg-gray-50 text-gray-500 dark:bg-gray-900/20 dark:text-gray-400 border-gray-100 dark:border-gray-800/30',
          )}
        >
          {status || 'Not Evaluated'}
        </span>
      )
    },
  },
  {
    accessorKey: 'verdict',
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Verdict
      </span>
    ),
    cell: ({ row }) => {
      const verdict = (row.getValue('verdict') as string | undefined) || ''
      if (!verdict) {
        return <span className="text-xs text-muted-foreground italic">—</span>
      }
      const isAccept = verdict.toUpperCase() === 'ACCEPT'
      const isReject = verdict.toUpperCase() === 'REJECT'
      return (
        <div className="flex items-center gap-1.5">
          {isAccept ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : isReject ? (
            <XCircle className="h-3.5 w-3.5 text-red-500" />
          ) : null}
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-md text-xs font-medium',
              isAccept &&
                'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30',
              isReject &&
                'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30',
              !isAccept &&
                !isReject &&
                'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-100 dark:border-gray-800/30',
            )}
          >
            {verdict}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <InterviewActions rowData={row.original} />,
  },
]
