import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, Target, TrendingUp, Info } from "lucide-react";

interface TotalScoreCardProps {
    scores: number[];
    maxScorePerQuestion?: number;
}

export function TotalScoreCard({ scores, maxScorePerQuestion = 10 }: TotalScoreCardProps) {
    const total = scores.reduce((acc, curr) => acc + curr, 0);
    const totalPossible = scores.length * maxScorePerQuestion;

    const getVariant = (score: number) => {
        if (score > 35) return { 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10", 
            border: "border-emerald-500/20", 
            label: "Superior Alignment",
            gradient: "from-emerald-500/10 via-background to-background"
        };
        if (score >= 25) return { 
            color: "text-amber-500", 
            bg: "bg-amber-500/10", 
            border: "border-amber-500/20", 
            label: "Balanced Fit",
            gradient: "from-amber-500/10 via-background to-background"
        };
        return { 
            color: "text-rose-500", 
            bg: "bg-rose-500/10", 
            border: "border-rose-500/20", 
            label: "Critical Gaps",
            gradient: "from-rose-500/10 via-background to-background"
        };
    };

    const variant = getVariant(total);

    return (
        <Card className={cn("relative overflow-hidden group shadow-xl border-t-2 rounded-[2.5rem]", variant.border)}>
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", variant.gradient)} />
            
            <CardContent className="relative p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-8 z-10">
                <div className="flex items-center gap-8">
                    <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105 duration-500", variant.bg, variant.border)}>
                        <Target className={cn("h-10 w-10", variant.color)} />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <Sparkles className="h-3 w-3" />
                            Aggregate Interview Score
                        </div>
                        <div className="flex items-baseline gap-3">
                            <h2 className={cn("text-6xl font-black tracking-tighter tabular-nums", variant.color)}>
                                {total}
                            </h2>
                            <span className="text-2xl font-bold text-muted-foreground/40 italic">
                                / {totalPossible}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-3">
                    <div className={cn("px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg flex items-center gap-2", variant.bg, variant.border, variant.color)}>
                        <TrendingUp className="h-3.5 w-3.5" />
                        {variant.label}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/20 px-3 py-1 rounded-full border border-muted-foreground/5">
                        <Info className="h-3 w-3 opacity-50" />
                        Based on <span className="text-foreground font-bold px-1">{scores.length}</span> Technical Questions
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}