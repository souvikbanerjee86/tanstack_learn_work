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
        <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-teal-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* Header skeleton */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 md:h-8 w-[160px] md:w-[240px]" />
                        <Skeleton className="h-3 md:h-4 w-[120px] md:w-[180px] opacity-60" />
                    </div>
                </div>
                <Skeleton className="hidden sm:block h-10 w-28 rounded-xl" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
                {/* Mobile/Tablet Skeleton View */}
                <div className="lg:hidden space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5 rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32 opacity-60" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-20 rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <Skeleton className="h-8 w-full rounded-lg" />
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Skeleton View */}
                <div className="hidden lg:block overflow-hidden p-8 rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/40">
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
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-b border-border/40">
                                    <TableCell className="py-5 px-6"><Skeleton className="h-8 w-32 rounded-lg" /></TableCell>
                                    <TableCell className="py-5 px-6">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-5 px-6"><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell className="py-5 px-6"><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="py-5 px-6"><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell className="py-5 px-6"><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell className="py-5 px-6"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}