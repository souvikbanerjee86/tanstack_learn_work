import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Standard Shadcn utility

interface TotalScoreCardProps {
    scores: number[]; // e.g., [3, 5, 7, 3, 6]
    maxScorePerQuestion?: number;
}

export function TotalScoreCard({ scores, maxScorePerQuestion = 10 }: TotalScoreCardProps) {
    const total = scores.reduce((acc, curr) => acc + curr, 0);
    const totalPossible = scores.length * maxScorePerQuestion;

    // Logic: >35 Green, 25-35 Yellow, <25 Red
    const getVariant = (score: number) => {
        if (score > 35) return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/50", label: "Strong Match" };
        if (score >= 25) return { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/50", label: "Average" };
        return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/50", label: "Below Threshold" };
    };

    const variant = getVariant(total);

    return (
        <Card className={cn("mb-6 border-2 overflow-hidden bg-slate-950", variant.border)}>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        Aggregate Interview Score
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className={cn("text-5xl font-black tracking-tighter", variant.color)}>
                            {total}
                        </h2>
                        <span className="text-xl font-medium text-muted-foreground">
                            / {totalPossible}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight", variant.bg, variant.color)}>
                        {variant.label}
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                        Based on {scores.length} technical questions
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}