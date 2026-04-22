import { JobContentSkeleton } from "./job-content-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { HelpCircle, LayoutGrid, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function QuestionsLayoutSkeleton() {
    return (
        <div className="relative min-h-screen flex flex-col md:flex-row h-full max-w-full gap-8 p-4 md:p-10 lg:p-14 overflow-hidden bg-transparent">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* Sidebar Skeleton */}
            <JobContentSkeleton />

            {/* Main Area Skeleton */}
            <div className="flex-1 flex flex-col gap-6 h-full min-h-0">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-10 w-[300px]" />
                            <Skeleton className="h-4 w-[240px] opacity-60" />
                        </div>
                        <Skeleton className="h-10 w-28 rounded-xl opacity-40 ml-auto" />
                    </div>
                    {/* Add Question Area Skeleton */}
                    <Skeleton className="h-[84px] w-full rounded-2xl opacity-10" />
                </div>

                {/* Questions List Skeleton */}
                <Card className="flex-1 flex flex-col shadow-xl border-muted/60 overflow-hidden rounded-3xl bg-background/40 backdrop-blur-xl">
                    <CardHeader className="bg-muted/10 border-b px-6 py-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary/80 opacity-40 uppercase tracking-widest">
                                <HelpCircle className="h-4 w-4" />
                                Bank of Questions
                            </CardTitle>
                            <div className="flex items-center gap-1.5 opacity-20">
                                <LayoutGrid className="h-4 w-4" />
                                <Separator orientation="vertical" className="h-3" />
                                <MessageSquare className="h-4 w-4" />
                            </div>
                        </div>
                    </CardHeader>
                    <div className="flex-1 p-8 space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-card/30 border border-muted/20">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full opacity-10" />
                                    <div className="flex-1 space-y-4">
                                        <Skeleton className="h-3 w-24 opacity-20" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[90%] opacity-20" />
                                            <Skeleton className="h-4 w-[60%] opacity-10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
