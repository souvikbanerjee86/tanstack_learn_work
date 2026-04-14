import { Skeleton } from "@/components/ui/skeleton"

export function QuestionsSkeleton() {
    return (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
            <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="flex flex-col gap-4 p-8 rounded-[2rem] bg-card/50 border border-muted/40 shadow-xl shadow-black/5"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-none pt-1">
                                <Skeleton className="h-10 w-10 rounded-full opacity-20" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-3 w-3 rounded-full opacity-40 bg-primary" />
                                    <Skeleton className="h-4 w-24 opacity-30" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-[95%] opacity-40" />
                                    <Skeleton className="h-5 w-[70%] opacity-20" />
                                </div>
                            </div>
                            <div className="flex-none flex flex-col gap-2">
                                <Skeleton className="h-10 w-10 rounded-xl opacity-10" />
                                <Skeleton className="h-10 w-10 rounded-xl opacity-10" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}