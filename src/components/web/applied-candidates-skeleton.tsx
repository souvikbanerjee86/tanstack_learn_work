import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function AppliedCandidatesSkeleton() {
    return (
        <div className="w-full space-y-4">
            {/* 1. Header Area Skeleton (Applied Candidates & Add Candidate Button) */}
            <div className="flex items-center justify-between py-4">
                <Skeleton className="h-8 w-[200px]" /> {/* Page Title */}
                <Skeleton className="h-10 w-[140px] rounded-md" /> {/* Add Button */}
            </div>

            {/* 2. Table Structure Skeleton */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* Setting explicit widths on headers for consistency */}
                            <TableHead className="w-[30%]">Email</TableHead>
                            <TableHead className="w-[20%]">Candidate Name</TableHead>
                            <TableHead className="w-[20%]">Job Name</TableHead>
                            <TableHead className="w-[20%]">Upload Date</TableHead>
                            <TableHead className="w-[10%] text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Generate 5 identical skeleton rows */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {/* Email (Longer string, usually) */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[85%]" />
                                </TableCell>
                                {/* Candidate Name */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[75%]" />
                                </TableCell>
                                {/* Job Name */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[70%]" />
                                </TableCell>
                                {/* Upload Date (A consistent, medium width) */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[110px]" />
                                </TableCell>
                                {/* Actions (Three dots on the right) */}
                                <TableCell className="text-right">
                                    <Skeleton className="ml-auto h-4 w-4 rounded-full" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* 3. Pagination Area Skeleton (Previous/Next buttons) */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-10 w-[80px] rounded-md" />
                <Skeleton className="h-10 w-[60px] rounded-md" />
            </div>
        </div>
    )
}