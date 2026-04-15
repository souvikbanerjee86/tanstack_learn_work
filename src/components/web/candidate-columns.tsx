

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Mail, User, Briefcase, Calendar, Eye } from "lucide-react"
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
import { candidate } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"



export const CandidateActions = ({ rowData }: { rowData: candidate }) => {
    const extraData = {
        id: rowData.id,
        email: rowData.email,
        name: rowData.name,
        job_name: rowData.job_name,
        uploaded_at: format(rowData.uploaded_at, "PPP"),
        resume_url: rowData.resume_url,
        job_id: rowData.job_id,
        candidate_image: rowData.candidate_image
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
                            to: '/dashboard/candidates/$id',
                            params: { id: rowData.id },
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

export const candidateColumns: ColumnDef<candidate>[] = [
    {
        accessorKey: "email",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Security Identity</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center border border-muted-foreground/5 shrink-0">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground/60" />
                </div>
                <span className="text-sm font-medium opacity-80 truncate max-w-[200px]">{row.getValue("email")}</span>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Candidate Name</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 shadow-inner">
                    <User className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="font-bold text-sm tracking-tight">{row.getValue("name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "job_name",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Position</span>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span>{row.getValue("job_name")}</span>
            </div>
        ),
    },
    {
        accessorKey: "job_id",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Job ID</span>,
        cell: ({ row }) => (
            <span className="font-black text-[10px] text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-full border border-muted-foreground/5 uppercase tracking-tighter">
                {row.getValue("job_id")}
            </span>
        ),
    },
    {
        accessorKey: "uploaded_at",
        header: () => <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Ingestion Date</span>,
        cell: ({ row }) => {
            const formatted = format(row.getValue("uploaded_at"), "MMM dd, yyyy")
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium opacity-60">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="tabular-nums">{formatted}</span>
                </div>
            )
        },
    },

    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <CandidateActions rowData={row.original} />,
    },
]