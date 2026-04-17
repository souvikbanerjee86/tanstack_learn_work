import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function CandidateAddSkeleton() {
    return (
        <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-16 pb-32 relative overflow-hidden">
            {/* --- Subtle Background Pattern --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-size-[24px_24px]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* --- Page Header / Nav --- */}
                <div className="flex flex-col gap-8 pb-4 border-b border-muted-foreground/10 relative">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <Skeleton className="h-16 w-16 rounded-[2rem]" />
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-[300px]" />
                                <Skeleton className="h-4 w-[250px] opacity-60" />
                            </div>
                        </div>
                        <Skeleton className="h-7 w-24 rounded-full" />
                    </div>
                </div>

                {/* --- Form Card Container --- */}
                <div className="bg-card border border-border rounded-3xl shadow-xl p-8 md:p-12">
                    <div className="space-y-14">
                        <div className="space-y-14">

                            {/* --- Section: Assignment Essentials --- */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-3 w-64 opacity-60" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-24 opacity-40" />
                                        <Skeleton className="h-14 w-full rounded-2xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-32 opacity-40" />
                                        <Skeleton className="h-14 w-full rounded-2xl" />
                                    </div>
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Candidate Identity --- */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-3 w-56 opacity-60" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-28 opacity-40" />
                                        <Skeleton className="h-14 w-full rounded-2xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-36 opacity-40" />
                                        <Skeleton className="h-14 w-full rounded-2xl" />
                                    </div>
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Assets --- */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-36" />
                                        <Skeleton className="h-3 w-48 opacity-60" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-20 opacity-40" />
                                        <Skeleton className="h-40 w-full rounded-3xl" />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className="h-3 w-40 opacity-40" />
                                        <Skeleton className="h-14 w-full rounded-2xl" />
                                        <Skeleton className="h-3 w-32 opacity-40" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* --- Action Footer --- */}
                        <div className="pt-8 flex items-center justify-end gap-6 border-t border-border">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-12 w-44 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
