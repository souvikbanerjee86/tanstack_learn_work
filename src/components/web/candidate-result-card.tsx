import { Briefcase, CheckCircle2, AlertCircle, FileText, User, Loader2, ExternalLink, Calendar, Gauge } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CandidateMatch } from "@/lib/types";
import { Checkbox } from "../ui/checkbox";
import { CVDialog } from "./cv-dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CandidateResultCard({
    data,
    selectedItems,
    handleCheckedChange,
    downlaodUrl,
    isOpen,
    setIsOpen,
    isDownloading,
    fileUrl
}: {
    data: CandidateMatch,
    selectedItems: string[],
    handleCheckedChange: (id: string, checked: boolean) => void,
    downlaodUrl: (url: string) => void,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isDownloading: boolean,
    fileUrl: string
}) {
    const isSelected = selectedItems.includes(data.candidate_email);

    return (
        <div className="group relative">
            <Card className={cn(
                "w-full border shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden",
                isSelected ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "hover:border-primary/20"
            )}>
                {/* Visual Accent */}
                <div className={cn(
                    "absolute top-0 left-0 w-1.5 h-full transition-all duration-500",
                    data.matched_score > 80 ? "bg-emerald-500" : data.matched_score > 60 ? "bg-amber-500" : "bg-primary/40"
                )} />

                <CardHeader className="pb-4 pt-6 px-6 sm:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                        <div className="flex gap-5">
                            <div className="relative shrink-0">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-muted to-muted/50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-muted-foreground/10 group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                    <User className="h-7 w-7 text-muted-foreground/70" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-2xl font-black tracking-tight mb-1 truncate">
                                    {data.candidate_name}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1.5 font-bold text-primary/80">
                                        <Briefcase className="h-3.5 w-3.5" />
                                        {data.seniority_level}
                                    </div>
                                    <span className="hidden sm:block opacity-20">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {data.years_of_experience} Years Experience
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                                    <ExternalLink className="h-2.5 w-2.5" />
                                    {data.source_ref.split('/').pop()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                            <div className="relative group/score">
                                <div className={cn(
                                    "px-4 py-2 rounded-2xl backdrop-blur-md border shadow-lg flex items-center gap-3 transition-transform duration-300 group-hover/score:-translate-y-1",
                                    data.matched_score > 80
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                        : "bg-primary/5 border-primary/20 text-primary"
                                )}>
                                    <Gauge className="h-5 w-5 opacity-70" />
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-bold opacity-70 uppercase tracking-tighter">Match</span>
                                        <span className="text-xl font-black tabular-nums tracking-tighter">{data.matched_score}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-2xl bg-muted/30 border transition-all duration-300",
                                isSelected ? "border-primary bg-primary text-primary-foreground shadow-md" : "hover:border-muted-foreground/20"
                            )}>
                                <Checkbox
                                    id={`check-${data.candidate_email}`}
                                    className={cn(
                                        "h-5 w-5 rounded-lg border-2",
                                        isSelected && "bg-white border-white text-primary"
                                    )}
                                    checked={isSelected}
                                    onCheckedChange={(checked: boolean) => handleCheckedChange(data.candidate_email, checked)}
                                />
                                <Label
                                    htmlFor={`check-${data.candidate_email}`}
                                    className="text-xs font-black uppercase tracking-widest cursor-pointer select-none"
                                >
                                    {isSelected ? "Accepted" : "Accept"}
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
                    {/* Summary Section */}
                    <div className="relative bg-muted/20 rounded-2xl p-5 border border-muted-foreground/5 italic">
                        <div className="absolute top-3 left-4 text-4xl text-primary/10 font-serif leading-none">"</div>
                        <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed indent-4 font-medium italic">
                            {data.summary}
                        </p>
                    </div>

                    {/* Primary Skills */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                            Expertise
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {data.primary_skills && data.primary_skills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="outline"
                                    className="bg-primary/5 border-primary/10 text-primary/80 px-3 py-1 rounded-xl text-xs font-bold hover:bg-primary/10 transition-colors"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Analysis Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-500/10">
                            <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Strong Alignment
                            </h4>
                            <ul className="grid grid-cols-1 gap-2">
                                {data.matched_criteria && data.matched_criteria.map((item, i) => (
                                    <li key={i} className="flex gap-2.5 text-xs text-muted-foreground/90 font-medium leading-relaxed">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 opacity-40" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {data.missing_information && data.missing_information.length > 0 && (
                            <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-3.5 w-3.5" /> Areas to clarify
                                </h4>
                                <ul className="grid grid-cols-1 gap-2">
                                    {data.missing_information.map((item, i) => (
                                        <li key={i} className="flex gap-2.5 text-xs text-muted-foreground/90 font-medium leading-relaxed">
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 opacity-40" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/30 p-5 px-6 sm:px-8 flex flex-col sm:flex-row gap-4 justify-between border-t border-muted/50">
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/70">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 opacity-50" />
                            Notice: <span className="text-foreground">{data.notice_period || "Immediate"}</span>
                        </div>
                    </div>
                    <Button
                        disabled={isDownloading}
                        size="sm"
                        variant="link"
                        className="p-0 h-auto text-primary hover:text-primary/70 transition-colors gap-2 font-bold uppercase tracking-widest text-[10px]"
                        onClick={(e) => {
                            e.preventDefault()
                            downlaodUrl(data.source_ref.substring(data.source_ref.indexOf("uploads/")))
                        }}
                    >
                        {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                        View Full Resume
                    </Button>
                </CardFooter>
            </Card>
            <CVDialog isOpen={isOpen} setIsOpen={setIsOpen} fileUrl={fileUrl} />
        </div>
    );
}

// Added missing import
import { Clock } from "lucide-react";