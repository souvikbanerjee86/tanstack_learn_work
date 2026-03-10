import { Skeleton } from "@/components/ui/skeleton"

export function QuestionsSkeleton() {
    return (
        <div className="flex items-start gap-6 py-6 border-b border-zinc-800 last:border-0">
            {/* Number Skeleton */}
            <Skeleton className="h-4 w-6 rounded bg-zinc-800" />

            {/* Question Text Skeleton */}
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[85%] bg-zinc-800" />
                {/* Optional second line for longer questions */}
                <Skeleton className="h-4 w-[40%] bg-zinc-800" />
            </div>
        </div>
    )
}