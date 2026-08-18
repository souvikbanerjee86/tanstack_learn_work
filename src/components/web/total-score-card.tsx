import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, Target, TrendingUp, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TotalScoreCardProps {
    scores: number[];
    maxScorePerQuestion?: number;
}

export function TotalScoreCard({ scores, maxScorePerQuestion = 10 }: TotalScoreCardProps) {
    const total = scores.reduce((acc, curr) => acc + curr, 0);
    const totalPossible = scores.length * maxScorePerQuestion;
    const percentage = totalPossible > 0 ? Math.round((total / totalPossible) * 100) : 0;

    const getVariant = (percent: number) => {
        if (percent >= 75) return {
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
            border: "border-emerald-500/30",
            badgeBg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
            label: "Superior Alignment",
            gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent"
        };
        if (percent >= 50) return {
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10 dark:bg-amber-500/15",
            border: "border-amber-500/30",
            badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
            label: "Balanced Fit",
            gradient: "from-amber-500/10 via-amber-500/5 to-transparent"
        };
        return {
            color: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-500/10 dark:bg-rose-500/15",
            border: "border-rose-500/30",
            badgeBg: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
            label: "Needs Review",
            gradient: "from-rose-500/10 via-rose-500/5 to-transparent"
        };
    };

    const variant = getVariant(percentage);

    return (
        <Card className={cn(
            "relative overflow-hidden group shadow-xl rounded-[2.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border transition-all duration-300",
            variant.border
        )}>
            {/* Background Ambient Glow */}
            <div className={cn("absolute inset-0 bg-linear-to-br opacity-60 pointer-events-none", variant.gradient)} />

            <CardContent className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 z-10">
                <div className="flex items-center gap-5 sm:gap-8 w-full sm:w-auto">
                    <div className={cn(
                        "h-16 w-16 sm:h-20 sm:w-20 rounded-3xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105 duration-300 shrink-0",
                        variant.bg,
                        variant.border
                    )}>
                        <Target className={cn("h-8 w-8 sm:h-10 sm:w-10", variant.color)} />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                            Aggregate Assessment Score
                        </div>
                        <div className="flex items-baseline gap-2.5">
                            <h2 className={cn("text-4xl sm:text-6xl font-black tracking-tighter tabular-nums", variant.color)}>
                                {total}
                            </h2>
                            <span className="text-xl sm:text-2xl font-bold text-muted-foreground/60">
                                / {totalPossible}
                            </span>
                            <Badge variant="outline" className={cn("ml-2 font-mono text-xs font-black", variant.badgeBg)}>
                                {percentage}%
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <div className={cn(
                        "px-4 sm:px-6 py-2 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-wider border shadow-md flex items-center gap-2",
                        variant.badgeBg
                    )}>
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{variant.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1 rounded-full border border-border/40">
                        <HelpCircle className="h-3 w-3 opacity-60" />
                        <span>Based on <strong className="text-foreground">{scores.length}</strong> Prompts</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}