import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function EmailSyncSkeleton() {
    // Define how many loading rows to show
    const skeletonRows = Array.from({ length: 5 });

    return (
        <div className="w-full p-4 space-y-4 rounded-md border bg-background text-foreground">
            <h2 className="text-2xl font-semibold tracking-tight">Email Sync Details</h2>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[200px]">Id</TableHead>
                            <TableHead>Applicant Name</TableHead>
                            <TableHead>Applicant Email</TableHead>
                            <TableHead>Job ID</TableHead>
                            <TableHead>CV Name</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead className="text-right">Processed</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skeletonRows.map((_, index) => (
                            <TableRow key={index}>
                                <TableCell><Skeleton className="h-4 w-[160px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-[130px]" /></TableCell>
                                <TableCell className="flex justify-end">
                                    {/* Mimics the green "Yes" badge in your image */}
                                    <Skeleton className="h-6 w-12 rounded-full" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
            </div>
        </div>
    );
}