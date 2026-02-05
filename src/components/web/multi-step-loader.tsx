import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const loadingStatuses = [
    "Submitting data...",
    "Encrypting files...",
    "Processing with Gemini AI...",
    "Generating matches...",
    "Finalizing results..."
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
        }, 2000)

        // Smoothly increase progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev
                return prev + 5
            })
        }, 1000)

        return () => {
            clearInterval(textInterval)
            clearInterval(progressInterval)
        }
    }, [isLoading])

    if (!isLoading) return null

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 border rounded-lg bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm font-medium animate-in fade-in slide-in-from-bottom-1">
                    {loadingStatuses[index]}
                </p>
            </div>
            <Progress value={progress} className="w-[250px]" />
        </div>
    )
}