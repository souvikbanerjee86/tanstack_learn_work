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
    return (
        <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[240px]" />
                    <Skeleton className="h-4 w-[180px] opacity-60" />
                </div>
            </div>

            {/* Table skeleton */}
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-6" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-18" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-10" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-12" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-6" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-14" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-12" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i} className="group hover:bg-muted/20 border-b border-border/40 transition-colors">
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-8 w-[140px] rounded-xl" />
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-xl" />
                                        <Skeleton className="h-5 w-[120px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[180px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[100px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[140px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[110px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-8 w-24 rounded-2xl" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}