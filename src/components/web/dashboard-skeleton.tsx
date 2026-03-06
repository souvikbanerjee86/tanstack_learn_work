import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function DashboardSkeleton() {
    return (
        <div className="w-full space-y-8 p-6">
            {/* 1. Statistics Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="shadow-sm">
                        <CardHeader className="text-center space-y-2 pb-2">
                            {/* Stat Title */}
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                            {/* Stat Value */}
                            <Skeleton className="h-12 w-20 mx-auto mt-2" />
                        </CardHeader>
                        <CardContent className="text-center pt-2">
                            {/* Last Updated Timestamp */}
                            <Skeleton className="h-3 w-3/5 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 2. Job File Breakdown Section */}
            <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, jobIdx) => (
                    <div key={jobIdx} className="rounded-md border p-6 bg-card text-card-foreground shadow-sm">
                        {/* Folder Header Row */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-sm" /> {/* Folder Icon */}
                                <Skeleton className="h-6 w-48" /> {/* Job Title */}
                                <Skeleton className="h-4 w-12" /> {/* File Count */}
                            </div>
                            <Skeleton className="h-5 w-5" /> {/* Caret Icon */}
                        </div>

                        {/* Resume File Cards Row (2 files in skeleton for variety) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 2 }).map((_, fileIdx) => (
                                <div key={fileIdx} className="rounded-md border p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-5 rounded-sm" /> {/* File Icon */}
                                        <Skeleton className="h-5 w-3/4" /> {/* File Name */}
                                    </div>
                                    <Skeleton className="h-4 w-full" /> {/* Upload Path */}
                                    <div className="flex items-center justify-between pt-2">
                                        <Skeleton className="h-4 w-16" /> {/* File Size */}
                                        <Skeleton className="h-9 w-32 rounded-sm" /> {/* Download Button */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}