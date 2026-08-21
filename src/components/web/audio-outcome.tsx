import { BrainCircuit, Database, FileSearch, ShieldCheck, PlayCircle, Headphones, Loader2, Volume2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getInterviewVoiceAnswersList, getVoiceDownloadURL } from "@/lib/server-function";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const interviewVoiceAnswerQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['interviews', email, job_id],
    queryFn: () => getInterviewVoiceAnswersList({ data: { candidate: email, job_id: job_id } })
})

export function AudioOutcome({ email, id }: { email: string, id: string }) {
    const { data: voiceAnswers } = useSuspenseQuery(interviewVoiceAnswerQueryOptions(email, id))

    if (!voiceAnswers?.data || voiceAnswers.data.length === 0) {
        return null;
    }
    const [downloading, setDownloading] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const downloadVoiceUrl = async (url: string) => {
        try {
            setDownloading(true)
            setFileUrl("")
            setIsOpen(false)
            const response = await getVoiceDownloadURL({ data: { bucket_name: "interview_speech_project-e7c52c57-c7d4-407d-b4b", file_path: url } })
            if (response.download_url) {
                setFileUrl(encodeURIComponent(response.download_url))
                setIsOpen(true)
            }
        } catch {
            toast.error("Failed to fetch audio stream")
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 border-border/60 bg-muted/30 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer shadow-xs"
                    >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-500" /> 
                        <span>Voice Audit ({voiceAnswers.data.length})</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-l border-border/60 flex flex-col p-0 shadow-2xl">
                    <SheetHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-black tracking-tight text-foreground">
                                    Voice Forensics & Biometrics
                                </SheetTitle>
                                <SheetDescription className="text-xs text-muted-foreground font-medium">
                                    Acoustic forensics, speech analysis, and AI synthesis detection
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {voiceAnswers.data.map((data, index) => {
                            const isHuman = data.analysis_result?.conclusion === 'Human'
                            return (
                                <div 
                                    key={index} 
                                    className="group relative p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/60 hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 overflow-hidden space-y-5"
                                >
                                    {/* Accent strip */}
                                    <div className={cn(
                                        "absolute top-0 left-0 w-1.5 h-full transition-colors",
                                        isHuman ? "bg-emerald-500" : "bg-rose-500"
                                    )} />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" /> 
                                                <span>Acoustic Session #{index + 1}</span>
                                            </span>
                                            <Badge 
                                                variant="outline" 
                                                className={cn(
                                                    "text-[10px] font-black uppercase tracking-wider px-2 py-0.5",
                                                    isHuman 
                                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                                )}
                                            >
                                                {data.analysis_result?.conclusion || "Verdict Pending"}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/40">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Forensic Verdict</p>
                                                <p className={cn(
                                                    "text-base font-black tracking-tight",
                                                    isHuman ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                                )}>
                                                    {data.analysis_result?.conclusion || "Not Analyzed"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">Confidence</p>
                                                <p className="text-base font-mono font-black tabular-nums text-foreground">
                                                    {((data.analysis_result?.confidence_score ?? 0) * 100).toFixed(0)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reasoning */}
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <FileSearch className="w-3.5 h-3.5 text-indigo-500" /> Analysis Findings
                                        </h4>
                                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/30 text-xs text-foreground/85 leading-relaxed italic">
                                            "{data.analysis_result?.reasoning || "No anomalies or synthetic pitch patterns detected during speech sample."}"
                                        </div>
                                    </div>

                                    {/* Session Details */}
                                    <div className="space-y-2">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            <Database className="w-3.5 h-3.5 text-indigo-500" /> Audio Storage Details
                                        </h4>
                                        <div className="space-y-2 text-[11px] bg-muted/20 p-4 rounded-2xl border border-border/30 font-mono">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase">GCS Path</span>
                                                <span className="break-all text-xs opacity-80">{data.gcs_uri}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/20 text-muted-foreground">
                                                <div>
                                                    <span className="text-[9px] font-bold uppercase">Session ID:</span>
                                                    <span className="block truncate text-foreground font-semibold">{data.session_id}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold uppercase">Recorded:</span>
                                                    <span className="block text-foreground font-semibold">{new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        disabled={downloading || !data.gcs_uri}
                                        className={cn(
                                            "w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md gap-2 transition-all",
                                            "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (data.gcs_uri) {
                                                const uploadIdx = data.gcs_uri.indexOf("uploads/")
                                                downloadVoiceUrl(uploadIdx !== -1 ? data.gcs_uri.substring(uploadIdx) : data.gcs_uri)
                                            }
                                        }}
                                    >
                                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                                        {data.gcs_uri ? "Listen to Audio Sample" : "No Audio Available"}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Audio Playback Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-border/60 rounded-3xl p-6 shadow-2xl space-y-4">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="flex items-center gap-3 text-lg font-black tracking-tight">
                            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                                <Headphones className="w-5 h-5" />
                            </div>
                            Candidate Speech Recording
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-border/40 space-y-4">
                        {fileUrl ? (
                            <>
                                <audio
                                    id="candidate-audio-player"
                                    controls
                                    autoPlay
                                    className="w-full rounded-xl"
                                    src={decodeURIComponent(fileUrl)}
                                >
                                    Your browser does not support audio playback.
                                </audio>

                                {/* Playback Speed Controller */}
                                <div className="w-full flex items-center justify-between pt-2 border-t border-border/30">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Playback Speed</span>
                                    <div className="flex items-center gap-1">
                                        {['0.75', '1.0', '1.25', '1.5', '2.0'].map((spd) => (
                                            <button
                                                key={spd}
                                                onClick={() => {
                                                    const audioEl = document.getElementById('candidate-audio-player') as HTMLAudioElement;
                                                    if (audioEl) audioEl.playbackRate = parseFloat(spd);
                                                    toast.info(`Playback set to ${spd}x`);
                                                }}
                                                className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-muted/60 hover:bg-indigo-600 hover:text-white transition-colors border border-border/40"
                                            >
                                                {spd}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center p-6">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}