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

export const JobIdBadge = ({ jobId }: { jobId: string }) => (
    <span className="font-mono text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-muted-foreground/10 tracking-tight">
        {jobId}
    </span>
)

export const JobTitleItem = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200/50 dark:border-indigo-800/50">
            <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="font-bold text-sm tracking-tight">{title}</span>
    </div>
)

export const JobStatusBadge = ({ status }: { status: string }) => (
    <div className="flex items-center gap-1.5">
        <span className={cn(
            "h-1.5 w-1.5 rounded-full mb-0.5",
            status === "Active" && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
            status === "Inactive" && "bg-rose-500",
            status === "Archived" && "bg-rose-500"
        )} />
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
            status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
            status === "Inactive" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
            status === "Archived" && "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
        )}>
            {status}
        </span>
    </div>
)

export const JobTypeBadge = ({ type }: { type: string }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50">
        {type}
    </span>
)

export const JobActionsMenu = ({ rowData }: { rowData: JobDetail }) => {
    const navigate = useNavigate()
    const extraData = {
        id: rowData.id,
        job_id: rowData.job_id,
        job_description: rowData.job_description,
        job_title: rowData.job_title,
        start_date: format(rowData.start_date, "yyyy-MM-dd"),
        end_date: format(rowData.end_date, "yyyy-MM-dd"),
        location: rowData.location,
        job_type: rowData.job_type,
        status: rowData.status,
        experience: rowData.experience
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/80 data-[state=open]:bg-muted rounded-lg">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-muted-foreground/10">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 px-4 py-2">System Control</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="gap-2.5 px-4 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
                    onClick={() =>
                        navigate({
                            to: '/dashboard/jobs/$id',
                            params: { id: rowData.job_id },
                            state: extraData as any,
                        })
                    }
                >
                    <Eye className="h-4 w-4 opacity-70" />
                    <span className="font-bold text-sm">View details</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="gap-2.5 px-4 py-2.5 cursor-pointer focus:bg-indigo-500/5 focus:text-indigo-600 transition-colors"
                    onClick={() =>
                        navigate({
                            to: '/dashboard/jobs/$id/edit',
                            params: { id: rowData.job_id },
                            state: extraData as any,
                        })
                    }
                >
                    <Pencil className="h-4 w-4 opacity-70" />
                    <span className="font-bold text-sm">Edit Job</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns: ColumnDef<JobDetail>[] = [
    {
        accessorKey: "job_id",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Identifier</span>,
        cell: ({ row }) => <JobIdBadge jobId={row.getValue("job_id")} />,
    },
    {
        accessorKey: "job_title",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Position Title</span>,
        cell: ({ row }) => <JobTitleItem title={row.getValue("job_title")} />,
    },
    {
        accessorKey: "start_date",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Launch Date</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                <Calendar className="h-3.5 w-3.5" />
                <span className="tabular-nums whitespace-nowrap">{format(row.getValue("start_date"), "MMM dd, yyyy")}</span>
            </div>
        ),
    },
    {
        accessorKey: "end_date",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Closing Date</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                <Calendar className="h-3.5 w-3.5" />
                <span className="tabular-nums whitespace-nowrap">{format(row.getValue("end_date"), "MMM dd, yyyy")}</span>
            </div>
        ),
    },
    {
        accessorKey: "location",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Facility</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className="truncate">{row.getValue("location")}</span>
            </div>
        ),
    },
    {
        accessorKey: "job_type",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Protocol</span>,
        cell: ({ row }) => <JobTypeBadge type={row.getValue("job_type")} />,
    },
    {
        accessorKey: "status",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Status</span>,
        cell: ({ row }) => <JobStatusBadge status={row.getValue("status")} />,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <JobActionsMenu rowData={row.original} />,
    },
]