import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "../ui/scroll-area"

export function JobContentSkeleton() {
    return (
        <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-3 w-48 opacity-60" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full opacity-40" />
            </div>
            <ScrollArea className="flex-1 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="p-3 space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-full flex items-center justify-between p-4 rounded-xl border border-transparent">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg opacity-20" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20 opacity-40" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-6 rounded-full opacity-10" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
