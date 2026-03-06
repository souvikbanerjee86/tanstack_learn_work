import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function CandidateTableSkeleton() {
    return (
        <div className="w-full rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">JobId</TableHead>
                        <TableHead className="w-[250px]">Candidate Email</TableHead>
                        <TableHead>Processed Date</TableHead>
                        <TableHead>Email Sent Date</TableHead>
                        <TableHead className="w-[220px]">Message Id</TableHead>
                        <TableHead>Email Sent Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            {/* JobId */}
                            <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>

                            {/* Candidate Email */}
                            <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>

                            {/* Dates */}
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>

                            {/* Message Id - usually a long string */}
                            <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>

                            {/* Sent Status Pill */}
                            <TableCell>
                                <Skeleton className="h-6 w-[50px] rounded-full" />
                            </TableCell>

                            {/* Actions */}
                            <TableCell>
                                <Skeleton className="h-4 w-4 rounded-full ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}