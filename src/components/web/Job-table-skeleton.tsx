import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function JobTableSkeleton() {
    return (
        <div className="w-full space-y-4">
            {/* Mimic the Header area (Job Details & Add Job button) */}
            <div className="flex items-center justify-between py-4">
                <Skeleton className="h-8 w-[150px]" />
                <Skeleton className="h-10 w-[100px] rounded-md" />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Id</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Job Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Generating 5 rows of skeleton data */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[140px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[160px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                {/* Status Pill Skeleton */}
                                <TableCell>
                                    <Skeleton className="h-6 w-[60px] rounded-full" />
                                </TableCell>
                                {/* Action menu skeleton */}
                                <TableCell className="text-right">
                                    <Skeleton className="ml-auto h-4 w-4 rounded-full" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-10 w-[80px]" />
                <Skeleton className="h-10 w-[80px]" />
            </div>
        </div>
    )
}