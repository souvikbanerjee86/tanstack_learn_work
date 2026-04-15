import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatSkeletonProps {
    count?: number
}

export function DashboardStatsSkeleton({ count = 4 }: StatSkeletonProps) {
    return (
        <div className="w-full">
            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 gap-4 md:gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Card
                        key={i}
                        className="border-muted-foreground/10 bg-card/40 backdrop-blur-xl shadow-sm rounded-[2rem] md:rounded-[2.5rem] overflow-hidden"
                    >
                        <CardContent className="flex items-center justify-between p-6 md:p-10">
                            {/* Group A: Text Stack (Label + Main Stat) */}
                            <div className="space-y-3 md:space-y-5">
                                {/* Small Label (e.g., Active Jobs) */}
                                <Skeleton className="h-3 w-20 md:w-24 opacity-20" />

                                {/* Large Number (e.g., 1,429) */}
                                <Skeleton className="h-10 md:h-12 w-16 md:w-20 opacity-30" />
                                
                                {/* Info Pill (Optional for some designs) */}
                                <div className="h-4" />
                            </div>

                            {/* Group B: Inset Icon Box */}
                            <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[1.5rem] md:rounded-[2rem] bg-muted/40 border border-muted-foreground/5 shadow-inner">
                                {/* The Icon Placeholder */}
                                <Skeleton className="h-8 w-8 rounded-md opacity-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}