

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
import { JobDetail } from "@/lib/types"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"


export const columns: ColumnDef<JobDetail>[] = [
    {
        accessorKey: "job_id",
        header: "Id",
    },
    {
        accessorKey: "job_title",
        header: "Job Title",
    },

    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
            const formatted = format(row.getValue("start_date"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
            const formatted = format(row.getValue("start_date"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "job_type",
        header: "Job Type",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium w-fit",
                status === "Active" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                status === "Inactive" && "bg-gray-100 text-gray-700",
                status === "Archived" && "bg-red-100 text-red-700"
            )}>
                {status}
            </div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {

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
                        <DropdownMenuItem>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]