import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ShieldCheck, 
    ShieldAlert, 
    Shield, 
    ScanFace, 
    Activity, 
    Mic 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrityTrustGaugeProps {
    faceConfidence?: number; // 0 - 100
    movementAnomaliesCount?: number; // e.g. 0, 1, 2...
    audioClarityScore?: number; // 0 - 100
    totalQuestionsCount?: number;
}

export function IntegrityTrustGauge({
    faceConfidence = 95,
    movementAnomaliesCount = 0,
    audioClarityScore = 90,
    totalQuestionsCount = 5,
}: IntegrityTrustGaugeProps) {
    // Calculate synthesized integrity index
    const { trustScore, statusLevel, badgeColor, badgeBg, badgeBorder, icon: Icon } = useMemo(() => {
        // Base starting score from face confidence
        let score = (faceConfidence * 0.45) + (audioClarityScore * 0.35);

        // Deduct points for movement anomalies (head turns, multi-face, out of frame)
        const penaltyPerAnomaly = totalQuestionsCount > 0 ? (20 / totalQuestionsCount) : 4;
        const movementPenalty = Math.min(30, movementAnomaliesCount * penaltyPerAnomaly);
        score = Math.max(10, Math.min(100, score - movementPenalty + 20));

        const finalScore = Math.round(score);

        if (finalScore >= 85) {
            return {
                trustScore: finalScore,
                statusLevel: "High Integrity Verified",
                badgeColor: "text-emerald-600 dark:text-emerald-400",
                badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
                badgeBorder: "border-emerald-500/30",
                icon: ShieldCheck,
            };
        } else if (finalScore >= 65) {
            return {
                trustScore: finalScore,
                statusLevel: "Moderate Trust - Review Advised",
                badgeColor: "text-amber-600 dark:text-amber-400",
                badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
                badgeBorder: "border-amber-500/30",
                icon: Shield,
            };
        } else {
            return {
                trustScore: finalScore,
                statusLevel: "Integrity Caution / Anomaly Detected",
                badgeColor: "text-rose-600 dark:text-rose-400",
                badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
                badgeBorder: "border-rose-500/30",
                icon: ShieldAlert,
            };
        }
    }, [faceConfidence, movementAnomaliesCount, audioClarityScore, totalQuestionsCount]);

    // SVG Circular progress math
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (trustScore / 100) * circumference;

    return (
        <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 p-6 space-y-5">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                {/* Left: Gauge Arc & Score */}
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center shrink-0">
                        <svg className="w-28 h-28 -rotate-90">
                            {/* Track */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className="stroke-muted/40"
                                strokeWidth="8"
                                fill="none"
                            />
                            {/* Progress Arc */}
                            <circle
                                cx="56"
                                cy="56"
                                r={radius}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    trustScore >= 85
                                        ? "stroke-emerald-500"
                                        : trustScore >= 65
                                        ? "stroke-amber-500"
                                        : "stroke-rose-500"
                                )}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl font-black tracking-tight text-foreground font-mono">
                                {trustScore}%
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                Trust Index
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <Badge
                                variant="outline"
                                className={cn("text-[10px] font-black uppercase tracking-wider gap-1.5 px-2.5 py-0.5 border", badgeBg, badgeBorder, badgeColor)}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{statusLevel}</span>
                            </Badge>
                        </div>
                        <h4 className="text-base font-bold text-foreground">
                            Proctoring & Identity Telemetry
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                            Multimodal evaluation combining facial biometric matching, eye gaze movement, and acoustic response consistency.
                        </p>
                    </div>
                </div>

                {/* Right: Sub-telemetry Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto shrink-0">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/50 text-center min-w-[90px]">
                        <ScanFace className="h-4 w-4 text-indigo-500 mb-1" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Face Match</span>
                        <span className="text-sm font-black font-mono text-foreground mt-0.5">{faceConfidence}%</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/50 text-center min-w-[90px]">
                        <Activity className="h-4 w-4 text-purple-500 mb-1" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Anomalies</span>
                        <span className="text-sm font-black font-mono text-foreground mt-0.5">{movementAnomaliesCount}</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/40 border border-border/50 text-center min-w-[90px]">
                        <Mic className="h-4 w-4 text-emerald-500 mb-1" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Audio Stream</span>
                        <span className="text-sm font-black font-mono text-foreground mt-0.5">{audioClarityScore}%</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
