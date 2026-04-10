

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Calendar, FileText, Mail, User, Briefcase } from "lucide-react"

import { EmailSyncRecord } from "@/lib/types"
import { cn } from "@/lib/utils"



export const emailSyncColumns: ColumnDef<EmailSyncRecord>[] = [
    {
        accessorKey: "id",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</span>,
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md truncate max-w-[140px] inline-block">
                {row.getValue("id")}
            </span>
        ),
    },
    {
        accessorKey: "applicant_name",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Applicant</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="font-semibold text-sm">{row.getValue("applicant_name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "applicant_email",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm truncate max-w-[200px]">{row.getValue("applicant_email")}</span>
            </div>
        ),
    },
    {
        accessorKey: "job_id",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job ID</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{row.getValue("job_id")}</span>
            </div>
        ),
    },
    {
        accessorKey: "cv_filename",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CV</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-sm">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate max-w-[160px]">{row.getValue("cv_filename")}</span>
            </div>
        ),
    },

    {
        accessorKey: "created_at",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</span>,
        cell: ({ row }) => {
            const formatted = format(row.getValue("created_at"), "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "processed",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>,
        cell: ({ row }) => {
            const status = row.getValue("processed") as boolean
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
                        {status ? "Processed" : "Pending"}
                    </span>
                </div>
            )
        },
    },

]