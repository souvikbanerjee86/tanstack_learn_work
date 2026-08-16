import { 
    Briefcase, 
    CheckCircle2, 
    AlertCircle, 
    FileText, 
    User, 
    Calendar, 
    Gauge, 
    Clock, 
    Sparkles, 
    X,
    ExternalLink
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CandidateMatch, JobDetail, ProfileSearchCritieria } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CandidateCompareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidate: CandidateMatch | null;
    job: JobDetail | undefined;
    searchCriteria: ProfileSearchCritieria | null;
    isSelected: boolean;
    onToggleSelect: (email: string, checked: boolean) => void;
    onViewResume: (sourceRef: string) => void;
}

export function CandidateCompareDialog({
    open,
    onOpenChange,
    candidate,
    job,
    searchCriteria,
    isSelected,
    onToggleSelect,
    onViewResume,
}: CandidateCompareDialogProps) {
    if (!candidate) return null;

    const jobTitle = job?.job_title || "Job Position Benchmark";
    const jobId = job?.job_id || searchCriteria?.jobId || "REQUISITION";
    const jobDescription = searchCriteria?.jobDescription || job?.job_description || "No specific job description provided.";
    const requiredSkills = searchCriteria?.skills 
        ? searchCriteria.skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];
    const minExperience = searchCriteria?.experience ?? job?.experience;
    const domain = searchCriteria?.preferedDomain;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! w-[95vw] h-[90vh] max-h-[850px] p-0 rounded-3xl border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header Strip */}
                <div className="px-6 py-4 border-b border-border/40 bg-muted/20 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                                <span>Side-by-Side Comparison</span>
                                <Badge variant="outline" className="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                                    {candidate.matched_score}% MATCH
                                </Badge>
                            </DialogTitle>
                            <p className="text-xs text-muted-foreground font-medium">
                                Comparing candidate qualifications directly against job requirements
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all",
                            isSelected 
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" 
                                : "bg-muted/40 border-border/60 hover:border-indigo-500/30"
                        )}>
                            <Checkbox
                                id={`modal-check-${candidate.candidate_email}`}
                                className={cn(
                                    "h-4 w-4 rounded-md border-2",
                                    isSelected && "bg-white border-white text-indigo-600"
                                )}
                                checked={isSelected}
                                onCheckedChange={(checked: boolean) => onToggleSelect(candidate.candidate_email, checked)}
                            />
                            <Label
                                htmlFor={`modal-check-${candidate.candidate_email}`}
                                className="text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                            >
                                {isSelected ? "Selected for Invite" : "Select Candidate"}
                            </Label>
                        </div>
                    </div>
                </div>

                {/* 2-Column Split Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40 overflow-hidden min-h-0">
                    {/* Left Column: Job Description & Specification */}
                    <div className="flex flex-col h-full overflow-hidden bg-muted/10">
                        <div className="p-5 border-b border-border/30 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <Briefcase className="h-4 w-4 text-indigo-500" />
                                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                                    Target Position Specification
                                </span>
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                {jobId}
                            </Badge>
                        </div>

                        <ScrollArea className="flex-1 p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-foreground">
                                        {jobTitle}
                                    </h3>
                                    {job?.location && (
                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                            Location: <strong className="text-foreground">{job.location}</strong>
                                        </p>
                                    )}
                                </div>

                                {/* Key Requirements Badges */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {minExperience !== undefined && (
                                        <Badge variant="outline" className="bg-background text-xs font-semibold py-1 px-2.5 border-border/60">
                                            Experience: {minExperience}+ Years
                                        </Badge>
                                    )}
                                    {domain && (
                                        <Badge variant="outline" className="bg-background text-xs font-semibold py-1 px-2.5 border-border/60">
                                            Domain: {domain}
                                        </Badge>
                                    )}
                                    {job?.job_type && (
                                        <Badge variant="outline" className="bg-background text-xs font-semibold py-1 px-2.5 border-border/60">
                                            Type: {job.job_type}
                                        </Badge>
                                    )}
                                </div>

                                {requiredSkills.length > 0 && (
                                    <div className="space-y-2 pt-2">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 block">
                                            Key Skills Desired
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {requiredSkills.map((s) => (
                                                <Badge key={s} variant="secondary" className="text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator className="my-3 opacity-40" />

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 block">
                                        Detailed Job Description & Requirements
                                    </span>
                                    <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal whitespace-pre-wrap rounded-2xl bg-background/60 p-4 border border-border/40">
                                        {jobDescription}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Column: Candidate Qualifications & AI Evaluation */}
                    <div className="flex flex-col h-full overflow-hidden bg-background">
                        <div className="p-5 border-b border-border/30 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <User className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                                    Candidate Profile & Match Analysis
                                </span>
                            </div>
                            <div className={cn(
                                "px-2.5 py-0.5 rounded-lg text-xs font-black tabular-nums flex items-center gap-1",
                                candidate.matched_score > 80 
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            )}>
                                <Gauge className="h-3.5 w-3.5" />
                                {candidate.matched_score}% Match
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6 space-y-6">
                            <div className="space-y-5">
                                {/* Candidate Header Info */}
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-foreground">
                                        {candidate.candidate_name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium mt-1">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{candidate.seniority_level}</span>
                                        <span>•</span>
                                        <span>{candidate.years_of_experience} Years Exp</span>
                                        <span>•</span>
                                        <span>Notice: {candidate.notice_period || "Immediate"}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-mono">
                                        <ExternalLink className="h-3 w-3" />
                                        <span>{candidate.source_ref.split('/').pop()}</span>
                                    </div>
                                </div>

                                {/* Executive Summary */}
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                                    {candidate.summary}
                                </div>

                                {/* Primary Skills */}
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70 block">
                                        Extracted Candidate Skills
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {candidate.primary_skills?.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold py-0.5 px-2.5 rounded-lg"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-2 opacity-40" />

                                {/* Alignment Criteria */}
                                <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20">
                                    <h4 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> Strong Role Alignments
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {candidate.matched_criteria?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-medium leading-relaxed">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 opacity-60" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Missing / Clarification points */}
                                {candidate.missing_information && candidate.missing_information.length > 0 && (
                                    <div className="space-y-2 p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-500/20">
                                        <h4 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                            <AlertCircle className="h-3.5 w-3.5" /> Areas to Clarify in Interview
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {candidate.missing_information.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-medium leading-relaxed">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 opacity-60" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t border-border/40 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-indigo-500/10 hover:text-indigo-600"
                                onClick={() => onViewResume(candidate.source_ref.substring(candidate.source_ref.indexOf("uploads/")))}
                            >
                                <FileText className="h-3.5 w-3.5" />
                                <span>Preview Full Resume (CV)</span>
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="h-9 rounded-xl text-xs font-semibold"
                            >
                                Close Comparison
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
