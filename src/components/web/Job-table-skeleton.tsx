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
        <div className="relative min-h-screen flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-[240px]" />
                        <Skeleton className="h-4 w-[180px] opacity-60" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-xl border border-indigo-200/50" />
            </div>

            {/* Mobile Cards Skeleton - Visible only on small screens */}
            <div className="flex flex-col gap-6 lg:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-3xl border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl p-6 space-y-6 shadow-xl shadow-black/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-40 opacity-40" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16 opacity-40" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="space-y-2 text-right">
                                <Skeleton className="h-3 w-16 opacity-40 ml-auto" />
                                <Skeleton className="h-4 w-24 ml-auto" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table skeleton - Hidden on small screens */}
            <div className="hidden lg:block overflow-hidden rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 border-b border-border/40">
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-10" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-28" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-20" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-20" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-24" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-16" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-16" /></TableHead>
                            <TableHead className="h-14" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i} className="group hover:bg-muted/20 border-b border-border/40 transition-colors">
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-6 w-24 rounded-lg opacity-40" />
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                        <Skeleton className="h-4 w-[140px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3.5 w-3.5 rounded-full opacity-40" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3.5 w-3.5 rounded-full opacity-40" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-3.5 w-3.5 rounded-full opacity-40" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </TableCell>
                                <TableCell className="py-6 px-6 text-right">
                                    <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}