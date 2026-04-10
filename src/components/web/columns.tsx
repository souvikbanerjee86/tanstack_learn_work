

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, MapPin, Calendar, Briefcase, Eye, Pencil } from "lucide-react"
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
import { JobDetail } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"



export const columns: ColumnDef<JobDetail>[] = [
    {
        accessorKey: "job_id",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</span>,
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                {row.getValue("job_id")}
            </span>
        ),
    },
    {
        accessorKey: "job_title",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Title</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-semibold text-sm">{row.getValue("job_title")}</span>
            </div>
        ),
    },

    {
        accessorKey: "start_date",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</span>,
        cell: ({ row }) => {
            const formatted = format(row.getValue("start_date"), "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "end_date",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Date</span>,
        cell: ({ row }) => {
            const formatted = format(row.getValue("end_date"), "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatted}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "location",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{row.getValue("location")}</span>
            </div>
        ),
    },
    {
        accessorKey: "job_type",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span>,
        cell: ({ row }) => {
            const jobType = row.getValue("job_type") as string
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                    {jobType}
                </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <div className="flex items-center gap-1.5">
                    <span className={cn(
                        "h-2 w-2 rounded-full",
                        status === "Active" && "bg-emerald-500",
                        status === "Inactive" && "bg-gray-400",
                        status === "Archived" && "bg-red-500"
                    )} />
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-md text-xs font-medium",
                        status === "Active" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30",
                        status === "Inactive" && "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-100 dark:border-gray-800/30",
                        status === "Archived" && "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/30"
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
        cell: ({ row }) => {
            const extraData = {
                id: row.original.id,
                job_id: row.original.job_id,
                job_description: row.original.job_description,
                job_title: row.original.job_title,
                start_date: format(row.original.start_date, "yyyy-MM-dd"),
                end_date: format(row.original.end_date, "yyyy-MM-dd"),
                location: row.original.location,
                job_type: row.original.job_type,
                status: row.original.status,
                experience: row.original.experience

            };
            const navigate = useNavigate()
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
                                    to: '/dashboard/jobs/$id',
                                    params: { id: row.original.job_id },
                                    state: extraData as any,
                                })
                            }
                        >
                            <Eye className="h-4 w-4" />
                            View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() =>
                                navigate({
                                    to: '/dashboard/jobs/$id/edit',
                                    params: { id: row.original.job_id },
                                    state: extraData as any,
                                })
                            }
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]