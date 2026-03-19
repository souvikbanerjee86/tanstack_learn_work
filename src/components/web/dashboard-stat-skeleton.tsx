import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatSkeletonProps {
    count?: number
}

export function DashboardStatsSkeleton({ count = 4 }: StatSkeletonProps) {
    return (
        <div className="w-full">
            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Card
                        key={i}
                        className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            {/* Group A: Text Stack (Label + Main Stat) */}
                            <div className="space-y-3">
                                {/* Small Label (e.g., Active Jobs) */}
                                <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />

                                {/* Large Number (e.g., 1,429) */}
                                <Skeleton className="h-9 w-16 bg-slate-300 dark:bg-slate-700" />
                            </div>

                            {/* Group B: Inset Icon Box */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                {/* The Icon Placeholder */}
                                <Skeleton className="h-6 w-6 rounded-md bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}