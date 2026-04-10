import { useState, useEffect } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const loadingStatuses = [
    "Analyzing dataset...",
    "Optimizing search index...",
    "AI evaluating semantic matches...",
    "Processing candidate metadata...",
    "Ranking top-tier profiles...",
    "Finalizing intelligence report..."
]

export function MultiStepLoader({ isLoading }: { isLoading: boolean }) {
    const [index, setIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!isLoading) {
            setIndex(0)
            setProgress(0)
            return
        }

        // Cycle through text messages
        const textInterval = setInterval(() => {
            setIndex((prev) => (prev + 1) % loadingStatuses.length)
        }, 1800)

        // Smoothly increase progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return prev
                return prev + 2
            })
        }, 400)

        return () => {
            clearInterval(textInterval)
            clearInterval(progressInterval)
        }
    }, [isLoading])

    if (!isLoading) return null

    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-primary/10 shadow-2xl relative overflow-hidden max-w-2xl mx-auto my-12">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl opacity-50" />
            
            <div className="relative">
                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 shadow-md border animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-xl font-black tracking-tight text-foreground transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
                    {loadingStatuses[index]}
                </p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                    EazyAI Intelligence Engine
                </p>
            </div>

            <div className="w-full max-w-[300px] space-y-2">
                <Progress value={progress} className="h-2.5 bg-primary/10" />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-1">
                    <span>Searching</span>
                    <span>{progress}%</span>
                </div>
            </div>
        </div>
    )
}