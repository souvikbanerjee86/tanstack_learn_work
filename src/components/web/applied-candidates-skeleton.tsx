import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

export function AppliedCandidatesSkeleton() {
    return (
        <div className="flex flex-col gap-8 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* Header skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-muted-foreground/10">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-[180px] md:h-8 md:w-[240px]" />
                        <Skeleton className="h-4 w-[140px] md:w-[180px] opacity-60" />
                    </div>
                </div>
                <Skeleton className="h-11 w-full md:h-10 md:w-32 rounded-xl" />
            </div>

            {/* Desktop Table skeleton */}
            <div className="hidden lg:block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-10" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-18" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-8" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-12" /></TableHead>
                            <TableHead className="h-14 px-6 uppercase text-[10px] font-black tracking-widest"><Skeleton className="h-3 w-16" /></TableHead>
                            <TableHead className="h-14 text-right px-6" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <TableRow key={i} className="group hover:bg-muted/20 border-b border-border/40 transition-colors">
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[180px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                        <Skeleton className="h-5 w-[100px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[70px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <Skeleton className="h-7 w-24 rounded-2xl" />
                                </TableCell>
                                <TableCell className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full opacity-40" />
                                        <Skeleton className="h-5 w-[110px]" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-6 text-right">
                                    <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card skeleton */}
            <div className="flex flex-col gap-4 lg:hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="rounded-2xl border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 p-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32 opacity-60" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/20">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-12 opacity-40" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-12 opacity-40" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}