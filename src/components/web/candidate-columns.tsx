

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
import { candidate } from "@/lib/types"
import { useNavigate } from "@tanstack/react-router"



export const candidateColumns: ColumnDef<candidate>[] = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Candidate Name",
    },
    {
        accessorKey: "job_name",
        header: "Job Name",
    },
    {
        accessorKey: "job_id",
        header: "Job ID",
    },
    {
        accessorKey: "uploaded_at",
        header: "Upload Date",
        cell: ({ row }) => {
            const formatted = format(row.getValue("uploaded_at"), "PPP")

            return <div className="font-medium">{formatted}</div>
        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const extraData = {
                id: row.original.id,
                email: row.original.email,
                name: row.original.name,
                job_name: row.original.job_name,
                uploaded_at: format(row.original.uploaded_at, "PPP"),
                resume_url: row.original.resume_url,
                job_id: row.original.job_id,


            };
            const navigate = useNavigate()
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
                                to: '/dashboard/candidates/$id',
                                params: { id: row.original.id },
                                state: extraData as any,
                            })
                        }>View details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]