import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CandidateDetailSkeleton() {
    return (
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-muted/60 shadow-sm h-full">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                        {/* Icon and Title Skeleton */}
                        <Skeleton className="h-5 w-5 rounded-sm" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    {/* Description Skeleton */}
                    <Skeleton className="h-4 w-64" />
                </CardHeader>

                <CardContent>
                    {/* Central Preview Box Skeleton */}
                    <div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center justify-center border-dashed min-h-[400px]">
                        {/* Large File Icon Placeholder */}
                        <Skeleton className="h-16 w-16 mb-4 rounded-md" />

                        {/* Header Text Placeholder */}
                        <Skeleton className="h-7 w-40 mb-2" />

                        {/* Paragraph Placeholder (Multi-line) */}
                        <div className="space-y-2 mb-6 flex flex-col items-center">
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-48" />
                        </div>

                        {/* Button Placeholder */}
                        <Skeleton className="h-10 w-44 rounded-md" />
                    </div>

                    <div className="mt-6">
                        {/* Metadata Section Header */}
                        <Skeleton className="h-5 w-40 mb-3" />

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Document ID Box */}
                            <div className="p-3 rounded-md bg-muted/30 border space-y-2">
                                <Skeleton className="h-3 w-24" /> {/* Label */}
                                <Skeleton className="h-4 w-full" /> {/* Value */}
                            </div>

                            {/* Source Box */}
                            <div className="p-3 rounded-md bg-muted/30 border space-y-2">
                                <Skeleton className="h-3 w-20" /> {/* Label */}
                                <Skeleton className="h-4 w-32" /> {/* Value */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}