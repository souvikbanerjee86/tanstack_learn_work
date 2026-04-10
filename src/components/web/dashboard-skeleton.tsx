import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function DashboardSkeleton() {

    return (
        <div className="flex flex-col gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden">
            <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[240px]" />
                    <Skeleton className="h-4 w-[180px] opacity-60" />
                </div>
            </div>
            {/* 1. Statistics Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-muted-foreground/10 bg-card/40 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="space-y-4 pb-6 p-6">
                            <Skeleton className="h-3 w-32 opacity-20" /> {/* Title */}
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-24 opacity-30" /> {/* Value */}
                                <Skeleton className="h-4 w-40 rounded-full opacity-10" /> {/* Pill */}
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* 2. Job File Breakdown Section */}
            <div className="space-y-10">
                {Array.from({ length: 2 }).map((_, jobIdx) => (
                    <div key={jobIdx} className="rounded-[2rem] border border-muted-foreground/10 p-8 bg-card/50 backdrop-blur-sm shadow-sm space-y-8">
                        {/* Folder Header Row */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-xl opacity-20" /> {/* Folder Icon Box */}
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-56 opacity-30" /> {/* Job Title */}
                                    <Skeleton className="h-3 w-24 opacity-10" /> {/* Subtext */}
                                </div>
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl opacity-10" /> {/* Caret/Action Icon */}
                        </div>

                        {/* Resume File Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2">
                            {Array.from({ length: 3 }).map((_, fileIdx) => (
                                <div key={fileIdx} className="rounded-2xl border border-muted-foreground/5 p-4 space-y-4 bg-background/40">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-lg opacity-20" /> {/* File Icon */}
                                        <Skeleton className="h-4 w-3/4 opacity-30" /> {/* File Name */}
                                    </div>
                                    <Skeleton className="h-3 w-full rounded-md opacity-10" /> {/* Path */}
                                    <div className="flex items-center justify-between pt-2">
                                        <Skeleton className="h-3 w-12 opacity-20" /> {/* File Size */}
                                        <Skeleton className="h-8 w-24 rounded-lg opacity-20" /> {/* Download Button */}
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