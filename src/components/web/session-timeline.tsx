import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Cpu,
    MessageSquare,
    Mic,
    Terminal,
    User,
    Workflow,
} from "lucide-react";
import { Badge } from "../ui/badge";
import type { ADKEvent, ADKResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SessionTimelineProps {
    session: ADKResponse;
}

export function SessionTimeline({ session }: SessionTimelineProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Extract visible conversation events (text messages and function calls with answers)
    const visibleEvents = session.events.filter((event) => {
        const parts = event.content.parts;
        if (parts.length === 0) return false;
        if (parts.some((p) => p.text)) return true;
        if (parts.some((p) => p.functionCall)) return true;
        if (parts.some((p) => (p as any).inlineData)) return true;
        return false;
    });

    // Left Column: Candidate & AI Interviewer interactions (conversations/messages/voice)
    const leftEvents = visibleEvents.filter((event) => {
        const parts = event.content.parts;
        const isFunctionCall = parts.some((p) => p.functionCall);
        return !isFunctionCall;
    });

    // Right Column: System Calls (function calls)
    const rightEvents = visibleEvents.filter((event) => {
        const parts = event.content.parts;
        return parts.some((p) => p.functionCall);
    });

    const totalTokens = session.state.total_tokens_consumed;
    const promptTokens = session.state.total_prompt_tokens;
    const candidateTokens = session.state.total_candidates_tokens;

    return (
        <div className="space-y-0">
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full group cursor-pointer",
                    "flex items-center justify-between",
                    "px-6 py-5 md:px-8 md:py-5.5",
                    "rounded-[2rem] border",
                    "bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-cyan-600/10",
                    "dark:from-violet-600/20 dark:via-indigo-600/20 dark:to-cyan-600/20",
                    "border-violet-500/20 dark:border-violet-500/35",
                    "hover:border-violet-500/40 dark:hover:border-violet-500/60",
                    "hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10",
                    "transition-all duration-500 ease-out",
                    isExpanded && "rounded-b-none border-b-0"
                )}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            "h-11 w-11 rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br from-violet-600/30 to-indigo-600/30",
                            "border border-violet-500/30 shadow-inner",
                            "group-hover:scale-105 transition-all duration-300"
                        )}
                    >
                        <Workflow className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base font-black tracking-tight text-foreground">
                                AI Evaluation Process
                            </span>
                            <Badge
                                variant="outline"
                                className="text-[7.5px] font-black uppercase tracking-widest bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-400 px-1.5 py-0 h-4 flex items-center"
                            >
                                Trace Log
                            </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                            {visibleEvents.length} events • {totalTokens.toLocaleString()} tokens
                        </p>
                    </div>
                </div>
                <div
                    className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center",
                        "bg-violet-500/15 border border-violet-500/15",
                        "group-hover:bg-violet-500/25 transition-all duration-200"
                    )}
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    )}
                </div>
            </button>

            {/* Expandable Content */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isExpanded ? "max-h-[12000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div
                    className={cn(
                        "border border-t-0 border-violet-500/20 dark:border-violet-500/35",
                        "rounded-b-[2rem] overflow-hidden",
                        "bg-card/45 backdrop-blur-md"
                    )}
                >
                    {/* Trace Stats Header Cards */}
                    <div className="p-5 md:p-6 bg-muted/15 border-b border-border/30 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mr-2">
                                Trace Stats:
                            </span>
                            
                            {/* Card 1: Total */}
                            <div className="flex flex-col bg-violet-500/5 dark:bg-violet-500/15 border border-violet-500/20 dark:border-violet-500/30 px-4 py-2 rounded-xl min-w-[110px] hover:shadow-sm transition-all">
                                <span className="text-[9px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-wider">Total</span>
                                <span className="font-mono font-black text-sm md:text-base text-violet-700 dark:text-violet-300 mt-0.5">
                                    {totalTokens.toLocaleString()}
                                </span>
                            </div>

                            {/* Card 2: Prompt */}
                            <div className="flex flex-col bg-blue-500/5 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 px-4 py-2 rounded-xl min-w-[110px] hover:shadow-sm transition-all">
                                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">Prompt</span>
                                <span className="font-mono font-black text-sm md:text-base text-blue-700 dark:text-blue-300 mt-0.5">
                                    {promptTokens.toLocaleString()}
                                </span>
                            </div>

                            {/* Card 3: Response */}
                            <div className="flex flex-col bg-emerald-500/5 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 px-4 py-2 rounded-xl min-w-[110px] hover:shadow-sm transition-all">
                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Response</span>
                                <span className="font-mono font-black text-sm md:text-base text-emerald-700 dark:text-emerald-300 mt-0.5">
                                    {candidateTokens.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {session.state.user_name && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/75 bg-foreground/5 px-2.5 py-1.5 rounded-lg border border-border/30">
                                    <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                                    <span>{session.state.user_name}</span>
                                </div>
                                {session.state.job_id && (
                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/75 bg-foreground/5 px-2.5 py-1.5 rounded-lg border border-border/30">
                                        <Cpu className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        <span>{session.state.job_id}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {session.state.user_self_info && (
                            <div className="w-full text-xs text-muted-foreground/75 leading-relaxed bg-muted/30 px-4 py-2.5 rounded-xl border border-border/30 mt-1 italic">
                                &quot;{session.state.user_self_info}&quot;
                            </div>
                        )}
                    </div>

                    {/* Dual Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                        
                        {/* Left Column: Candidate & AI interactions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 border-b border-violet-500/10 pb-3 mb-4">
                                <MessageSquare className="h-4 w-4" />
                                Interview Conversation
                            </div>
                            <div className="space-y-6 pl-1">
                                {leftEvents.map((event, index) => (
                                    <TimelineEvent key={event.id} event={event} index={index} side="left" />
                                ))}
                            </div>
                        </div>

                        {/* Right Column: System Action / Tool Trace Logs */}
                        <div className="space-y-6 lg:border-l lg:border-border/30 lg:pl-8">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 border-b border-cyan-500/10 pb-3 mb-4">
                                <Terminal className="h-4 w-4" />
                                Agent System Calls
                            </div>
                            <div className="space-y-6 pl-1">
                                {rightEvents.map((event, index) => (
                                    <TimelineEvent key={event.id} event={event} index={index} side="right" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TimelineEventProps {
    event: ADKEvent;
    index: number;
    side: "left" | "right";
}

function TimelineEvent({ event, index, side }: TimelineEventProps) {
    const parts = event.content.parts;
    if (parts.length === 0) return null;

    const isModel = event.content.role === "model";

    const textPart = parts.find((p) => p.text);
    const functionCallPart = parts.find((p) => p.functionCall);
    const audioPart = parts.find((p) => (p as any).inlineData);

    const functionResponsePart = parts.find((p) => p.functionResponse);
    if (functionResponsePart && !textPart) return null;

    let displayText = "";
    let eventType: "message" | "function_call" | "audio_input" = "message";
    let functionName = "";

    if (textPart?.text) {
        displayText = textPart.text;
        eventType = "message";
    } else if (functionCallPart?.functionCall) {
        functionName = functionCallPart.functionCall.name;
        eventType = "function_call";
    } else if (audioPart) {
        displayText = "🎙️ Voice Recording";
        eventType = "audio_input";
    }

    const timestamp = new Date(event.timestamp * 1000);
    const timeStr = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const getFunctionLabel = (name: string) => {
        const labels: Record<string, string> = {
            save_name: "Identity Captured",
            save_job_id: "Job ID Registered",
            tellme_about_yupurself: "Profile Ingested",
            submit_answer: "Answer Submitted",
        };
        return labels[name] || name;
    };

    const isInterviewer = isModel && eventType === "message";
    const isAudio = eventType === "audio_input";

    return (
        <div
            className={cn(
                "group relative flex gap-3.5 pl-5 pb-5 border-l border-border/40 last:border-0 last:pb-0",
                "animate-in fade-in slide-in-from-bottom-1 duration-300"
            )}
            style={{ animationDelay: `${index * 20}ms` }}
        >
            {/* Trace Indicator dot on the timeline line */}
            <div className="absolute left-[-5.5px] top-1">
                <div
                    className={cn(
                        "h-3 w-3 rounded-full border shadow-sm transition-all duration-300 group-hover:scale-125",
                        isInterviewer
                            ? "bg-violet-500 border-violet-600 shadow-violet-500/50"
                            : side === "right"
                              ? "bg-cyan-500 border-cyan-600 shadow-cyan-500/50"
                              : isAudio
                                ? "bg-rose-500 border-rose-600 shadow-rose-500/50"
                                : "bg-zinc-400 border-zinc-500 dark:bg-zinc-500 dark:border-zinc-400"
                    )}
                />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
                {/* Event header info */}
                <div className="flex items-center gap-2 leading-none">
                    <span
                        className={cn(
                            "text-[10px] font-black uppercase tracking-wider",
                            isInterviewer
                                ? "text-violet-600 dark:text-violet-400"
                                : side === "right"
                                  ? "text-cyan-600 dark:text-cyan-400 font-mono"
                                  : isAudio
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-muted-foreground/80"
                        )}
                    >
                        {isInterviewer
                            ? "AI Interviewer"
                            : side === "right"
                              ? "System Call"
                              : isAudio
                                ? "Candidate Voice"
                                : "Candidate"}
                    </span>

                    {side === "right" && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted border border-border/30 px-1.5 py-0.5 rounded h-4 flex items-center">
                            {getFunctionLabel(functionName)}
                        </span>
                    )}

                    <span className="text-[9px] text-muted-foreground/40 font-mono ml-auto">{timeStr}</span>
                </div>

                {/* Event message text body / system call parameter blocks */}
                {side === "right" && functionCallPart?.functionCall ? (
                    <div className="bg-zinc-950/90 dark:bg-black/60 border border-cyan-500/10 rounded-xl p-3.5 font-mono text-[11px] text-cyan-400 space-y-2 shadow-inner">
                        <div className="flex items-center gap-2 border-b border-cyan-500/10 pb-1.5 mb-1.5">
                            <Terminal className="h-3.5 w-3.5 text-cyan-500" />
                            <span className="text-[9px] uppercase font-black tracking-widest text-cyan-500/80">API.call::{functionName}</span>
                        </div>
                        {Object.entries(functionCallPart.functionCall.args).map(([key, val]) => (
                            <div key={key} className="flex flex-col gap-0.5">
                                <span className="text-[9px] text-cyan-600 dark:text-cyan-500/60 font-sans font-bold uppercase tracking-wider">{key}</span>
                                <span className="text-zinc-200 dark:text-zinc-300 break-words whitespace-pre-wrap leading-relaxed text-xs font-semibold">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                ) : isAudio ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/5 border border-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400 leading-none">
                        <Mic className="h-3.5 w-3.5" />
                        <span>Voice Recording Submitted</span>
                        <div className="flex gap-0.5 ml-1">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-0.5 bg-rose-500/40 rounded-full animate-pulse"
                                    style={{
                                        height: `${6 + Math.random() * 6}px`,
                                        animationDelay: `${i * 120}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "text-[13px] leading-relaxed rounded-xl p-3 border shadow-xs max-w-2xl",
                            isInterviewer
                                ? "bg-violet-500/[0.02] border-violet-500/10 text-foreground/90 font-medium shadow-sm"
                                : "bg-muted/20 border-border/35 text-foreground/85"
                        )}
                    >
                        {displayText}
                    </div>
                )}

                {/* Event Token Metrics */}
                {event.usageMetadata && (
                    <div className="flex items-center gap-2 pt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono text-muted-foreground/50">
                            Usage: {event.usageMetadata.totalTokenCount.toLocaleString()} total tokens
                        </span>
                        {event.usageMetadata.thoughtsTokenCount != null &&
                            event.usageMetadata.thoughtsTokenCount > 0 && (
                                <span className="text-[8px] font-mono text-amber-600/60 dark:text-amber-400/60 flex items-center gap-0.5">
                                    • {event.usageMetadata.thoughtsTokenCount} thinking
                                </span>
                            )}
                        {event.usageMetadata.cachedContentTokenCount != null &&
                            event.usageMetadata.cachedContentTokenCount > 0 && (
                                <span className="text-[8px] font-mono text-emerald-600/60 dark:text-emerald-400/60">
                                    • {event.usageMetadata.cachedContentTokenCount.toLocaleString()} cached
                                </span>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
}
