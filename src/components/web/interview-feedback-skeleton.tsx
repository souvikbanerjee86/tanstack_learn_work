import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function InterviewFeedbackSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 space-y-6">
            {/* Header Button Skeleton */}
            <div className="flex justify-end mb-6">
                <Skeleton className="h-10 w-44 bg-zinc-800/50 rounded-lg" />
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Area Skeleton */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-zinc-900/40 border-zinc-800 overflow-hidden">
                        <CardContent className="p-0">

                            {/* Question Header Skeleton */}
                            <div className="p-8 flex justify-between items-start border-b border-zinc-800/50">
                                <div className="space-y-3 w-full">
                                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                                    <Skeleton className="h-8 w-3/4 bg-zinc-800" />
                                </div>
                                <Skeleton className="h-20 w-20 bg-zinc-800 rounded-xl ml-4" />
                            </div>

                            {/* Transcript Box Skeleton */}
                            <div className="p-8">
                                <Skeleton className="h-32 w-full bg-zinc-950/50 rounded-2xl border border-zinc-800/30" />
                            </div>

                            {/* Reasoning Section Skeleton */}
                            <div className="p-8 space-y-4 bg-zinc-900/20">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-6 bg-zinc-800 rounded" />
                                    <Skeleton className="h-4 w-40 bg-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full bg-zinc-800/60" />
                                    <Skeleton className="h-4 w-full bg-zinc-800/60" />
                                    <Skeleton className="h-4 w-2/3 bg-zinc-800/60" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-4">
                    <Card className="bg-zinc-900/40 border-zinc-800 h-full">
                        <CardContent className="p-8 space-y-8">
                            <Skeleton className="h-4 w-32 bg-zinc-800" />

                            {/* Candidate Info Skeletons */}
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-10 bg-zinc-800 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-16 bg-zinc-800" />
                                            <Skeleton className="h-4 w-48 bg-zinc-800" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-zinc-800 w-full" />

                            {/* Status Row Skeletons */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <Skeleton className="h-3 w-24 bg-zinc-800" />
                                        <Skeleton className="h-5 w-5 rounded-full bg-zinc-800" />
                                    </div>
                                ))}
                            </div>

                            {/* Timestamp Skeleton */}
                            <div className="pt-8">
                                <Skeleton className="h-3 w-56 bg-zinc-800" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}