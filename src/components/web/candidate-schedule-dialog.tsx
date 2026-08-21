import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { candidate } from "@/lib/types";
import { 
    Calendar, 
    Clock, 
    Mail, 
    ExternalLink, 
    Copy, 
    Check, 
    Briefcase,
    CalendarCheck2
} from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

interface CandidateScheduleDialogProps {
    candidate: candidate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CandidateScheduleDialog({ candidate, open, onOpenChange }: CandidateScheduleDialogProps) {
    const [copied, setCopied] = useState(false);
    const [duration, setDuration] = useState("45");
    const [interviewType, setInterviewType] = useState("Technical & AI Review");
    const dateOffset = "1"; // default tomorrow

    if (!candidate) return null;

    const candidateEmail = candidate.email;
    const candidateName = candidate.name || candidateEmail.split('@')[0];
    const jobTitle = candidate.job_name || "Open Position";

    // Target meeting date calculations
    const scheduledDate = addDays(new Date(), parseInt(dateOffset, 10));
    const startTimeStr = format(scheduledDate, "yyyyMMdd'T'100000");
    const endTimeStr = format(scheduledDate, "yyyyMMdd'T'104500");

    const eventTitle = `Interview: ${candidateName} — ${jobTitle} (${interviewType})`;
    const eventDescription = `Hello ${candidateName},\n\nWe would like to invite you for your ${interviewType} session for the ${jobTitle} position at EazyAI.\n\nCandidate Email: ${candidateEmail}\nDuration: ${duration} minutes\n\nPlease ensure your camera and microphone are operational.`;

    // Google Calendar URL generator
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        eventTitle
    )}&dates=${startTimeStr}/${endTimeStr}&details=${encodeURIComponent(
        eventDescription
    )}&add=${encodeURIComponent(candidateEmail)}`;

    // Outlook Calendar URL generator
    const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
        eventTitle
    )}&body=${encodeURIComponent(eventDescription)}&to=${encodeURIComponent(candidateEmail)}`;

    // Mailto link
    const mailtoUrl = `mailto:${candidateEmail}?subject=${encodeURIComponent(
        `Interview Invitation: ${jobTitle} at EazyAI`
    )}&body=${encodeURIComponent(
        `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} role.\n\nWe are impressed with your profile and would like to schedule a ${duration}-minute ${interviewType} round.\n\nPlease reply with your available time slots or join the calendar invitation.\n\nBest regards,\nRecruitment Team | EazyAI`
    )}`;

    const handleCopyInviteText = async () => {
        try {
            await navigator.clipboard.writeText(eventDescription);
            setCopied(true);
            toast.success("Invitation message copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy invite text");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] rounded-3xl p-0 overflow-hidden border border-border/60 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-2xl">
                {/* Header */}
                <div className="p-6 sm:p-7 border-b border-border/40 bg-linear-to-br from-indigo-500/10 via-violet-500/5 to-transparent">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
                                <CalendarCheck2 className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                                    Schedule Interview
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    Generate calendar invites and invitation templates for this candidate.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                    {/* Candidate Preview Card */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 backdrop-blur-md space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-sm sm:text-base">{candidateName}</span>
                                <Badge variant="outline" className="text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                                    {(candidate as any).interview_status || 'Applied'}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                            <div className="flex items-center gap-1">
                                <Mail className="h-3.5 w-3.5 text-indigo-500" />
                                <span>{candidateEmail}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                                <span>{jobTitle}</span>
                            </div>
                        </div>
                    </div>

                    {/* Configuration Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                                Round Type
                            </Label>
                            <Select value={interviewType} onValueChange={setInterviewType}>
                                <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/60 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Technical & AI Review">Technical & AI Review</SelectItem>
                                    <SelectItem value="System Architecture Round">System Architecture</SelectItem>
                                    <SelectItem value="Hiring Manager Discussion">Hiring Manager Round</SelectItem>
                                    <SelectItem value="HR & Culture Fit">Culture & HR Fit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                                Duration
                            </Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/60 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="30">30 Minutes</SelectItem>
                                    <SelectItem value="45">45 Minutes</SelectItem>
                                    <SelectItem value="60">60 Minutes</SelectItem>
                                    <SelectItem value="90">90 Minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Schedule Shortcuts */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                            1-Click Calendar Dispatch
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <a
                                href={googleCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
                            >
                                <Calendar className="h-4 w-4" />
                                <span>Google Calendar</span>
                                <ExternalLink className="h-3 w-3 opacity-60 ml-auto" />
                            </a>

                            <a
                                href={outlookCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
                            >
                                <Clock className="h-4 w-4" />
                                <span>Outlook Calendar</span>
                                <ExternalLink className="h-3 w-3 opacity-60 ml-auto" />
                            </a>
                        </div>
                    </div>

                    {/* Email Template Action */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                                Email Template
                            </Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyInviteText}
                                className="h-7 px-2 text-[11px] font-bold text-muted-foreground hover:text-foreground gap-1"
                            >
                                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                {copied ? "Copied" : "Copy Template"}
                            </Button>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/50 font-mono text-[11px] text-muted-foreground leading-relaxed">
                            {eventDescription}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                        Close
                    </Button>
                    <a href={mailtoUrl} className="inline-flex">
                        <Button
                            size="sm"
                            className="rounded-xl text-xs font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                        >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Send Email Invite</span>
                        </Button>
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
