import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatSkeletonProps {
    count?: number
}

export function DashboardStatsSkeleton({ count = 4 }: StatSkeletonProps) {
    return (
        <div className="w-full mb-8">
            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Card
                        key={i}
                        className="border-muted-foreground/10 bg-card/40 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden"
                    >
                        <CardContent className="flex items-center justify-between p-6">
                            {/* Group A: Text Stack (Label + Main Stat) */}
                            <div className="space-y-3">
                                {/* Small Label (e.g., Active Jobs) */}
                                <Skeleton className="h-3 w-20 opacity-20" />

                                {/* Large Number (e.g., 1,429) */}
                                <Skeleton className="h-10 w-16 opacity-30" />
                                
                                {/* Info Pill */}
                                <Skeleton className="h-4 w-24 rounded-full opacity-10" />
                            </div>

                            {/* Group B: Inset Icon Box */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-muted-foreground/5 shadow-inner">
                                {/* The Icon Placeholder */}
                                <Skeleton className="h-6 w-6 rounded-md opacity-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}