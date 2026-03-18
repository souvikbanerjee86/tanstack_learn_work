

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CandidateRecord } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { Badge } from "../ui/badge"


export const candidateInterviewEmailColumns: ColumnDef<CandidateRecord>[] = [
    {
        accessorKey: "job_id",
        header: "JobId",
    },
    {
        accessorKey: "candidate_email",
        header: "Candidate Email",
    },

    {
        accessorKey: "processed_at",
        header: "Processed Date",
        cell: ({ row }) => {
            if (row.getValue("processed_at") === null || row.getValue("processed_at") === undefined) return <div className="font-medium">Not Processed</div>
            const formatted = format(row.getValue("processed_at"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "sent_at",
        header: "Email Sent Date",
        cell: ({ row }) => {
            if (row.getValue("sent_at") === null || row.getValue("sent_at") === undefined) return <div className="font-medium">Not Sent</div>
            const formatted = format(row.getValue("sent_at"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "message_id",
        header: "Message Id",
        cell: ({ row }) => {
            if (row.getValue("message_id") === null || row.getValue("message_id") === undefined) return <div className="font-medium">Not Sent Yet</div>

            return <div className="font-medium">{row.getValue("message_id")}</div>
        },
    },

    {
        accessorKey: "email_sent",
        header: "Email Status",
        cell: ({ row }) => {
            const status = row.getValue("email_sent") as boolean

            return <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium w-fit",
                status === true && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                status === false && "bg-gray-100 text-gray-700"
            )}>
                {status ? "Sent" : "Not Sent"}
            </div>
        },
    },
    {
        accessorKey: "interview_status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("interview_status") as string
            if (status) {
                return <Badge variant="secondary">{status}</Badge>
            }
            return <Badge variant="secondary">Not Evaluated</Badge>

        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const navigate = useNavigate()
            const extraData = {
                interview_status: row.original.interview_status,
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() =>
                            navigate({
                                to: '/dashboard/interview/$id',
                                params: { id: row.original.job_id },
                                search: {
                                    email: row.original.candidate_email
                                },
                                state: extraData as any,
                            })
                        }>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]