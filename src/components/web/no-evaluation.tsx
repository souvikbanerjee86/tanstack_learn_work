
import { Card, CardContent } from "@/components/ui/card"
import { Inbox, PlusCircle } from "lucide-react"
import { Button } from "../ui/button"

export function NoEvaluation() {
    return (<div className="flex items-center justify-center min-h-[400px] w-full p-4">
        <Card className="w-full max-w-md border-dashed border-2 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-slate-100 dark:bg-zinc-900 p-4 mb-4">
                    <Inbox className="w-10 h-10 text-muted-foreground/60" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">
                    No evaluation data available yet
                </h2>
                <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-[280px]">
                    It looks like there are no candidate responses to review for this session.
                </p>
                <Button variant="outline" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Start New Evaluation
                </Button>
            </CardContent>
        </Card>
    </div>)
}