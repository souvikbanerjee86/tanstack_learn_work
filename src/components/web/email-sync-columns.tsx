

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { EmailSyncRecord } from "@/lib/types"
import { cn } from "@/lib/utils"



export const emailSyncColumns: ColumnDef<EmailSyncRecord>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    {
        accessorKey: "applicant_name",
        header: "Appplicant Name",
    },
    {
        accessorKey: "applicant_email",
        header: "Appplicant Email",
    },
    {
        accessorKey: "job_id",
        header: "Job ID",
    },
    {
        accessorKey: "cv_filename",
        header: "CV Name",
    },

    {
        accessorKey: "created_at",
        header: "Created Date",
        cell: ({ row }) => {
            const formatted = format(row.getValue("created_at"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "processed",
        header: "Processed",
        cell: ({ row }) => {
            const status = row.getValue("processed") as boolean
            return <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium w-fit",
                status === true && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                status === false && "bg-gray-100 text-gray-700",
            )}>
                {status ? "Yes" : "No"}
            </div>
        },
    },

]