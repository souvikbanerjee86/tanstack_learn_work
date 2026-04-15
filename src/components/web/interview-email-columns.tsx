

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Calendar, Mail, Eye, CheckCircle2, XCircle, Clock, Gavel } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CandidateRecord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"


export const InterviewActions = ({ rowData }: { rowData: CandidateRecord }) => {
    const navigate = useNavigate()
    const extraData = {
        interview_status: rowData.interview_status,
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80 data-[state=open]:bg-muted">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() =>
                        navigate({
                            to: '/dashboard/interview/$id',
                            params: { id: rowData.job_id },
                            search: {
                                email: rowData.candidate_email
                            },
                            state: extraData as any,
                        })
                    }
                >
                    <Eye className="h-4 w-4" />
                    View details
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const candidateInterviewEmailColumns: ColumnDef<CandidateRecord>[] = [
    {
        accessorKey: "job_id",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job ID</span>,
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                {row.getValue("job_id")}
            </span>
        ),
    },
    {
        accessorKey: "candidate_email",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Candidate</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm truncate max-w-[220px]">{row.getValue("candidate_email")}</span>
            </div>
        ),
    },

    {
        accessorKey: "processed_at",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Processed</span>,
        cell: ({ row }) => {
            const value = row.getValue("processed_at")
            if (!value) {
                return (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                )
            }
            const formatted = format(value as string, "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "sent_at",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sent At</span>,
        cell: ({ row }) => {
            const value = row.getValue("sent_at")
            if (!value) {
                return (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground italic">
                        <Clock className="h-3 w-3" />
                        Not sent
                    </span>
                )
            }
            const formatted = format(value as string, "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },

    {
        accessorKey: "email_sent",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>,
        cell: ({ row }) => {
            const status = row.getValue("email_sent") as boolean
            return (
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "h-2 w-2 rounded-full",
                        status ? "bg-emerald-500" : "bg-gray-400"
                    )} />
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-xs font-medium",
                        status
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30"
                            : "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-100 dark:border-gray-800/30"
                    )}>
                        {status ? "Sent" : "Not Sent"}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "interview_status",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Evaluation</span>,
        cell: ({ row }) => {
            const status = row.getValue("interview_status") as string
            return (
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
                    status
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-800/30"
                        : "bg-gray-50 text-gray-500 dark:bg-gray-900/20 dark:text-gray-400 border-gray-100 dark:border-gray-800/30"
                )}>
                    {status || "Not Evaluated"}
                </span>
            )
        },
    },
    {
        accessorKey: "verdict",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verdict</span>,
        cell: ({ row }) => {
            const status = row.getValue("verdict") as string
            if (!status) return <span className="text-xs text-muted-foreground italic">—</span>
            return (
                <div className="flex items-center gap-1.5">
                    {status === "ACCEPT" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-xs font-medium",
                        status === "ACCEPT" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30",
                        status === "REJECT" && "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30"
                    )}>
                        {status}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <InterviewActions rowData={row.original} />,
    },
]