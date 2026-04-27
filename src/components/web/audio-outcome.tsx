import { BrainCircuit, Database, FileSearch, Info, ShieldCheck, PlayCircle, Headphones, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
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
        } catch (e) {
            toast.error("Download failed")
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className='flex flex-row justify-end'>
            <div></div>
            <div> <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-2 text-[10px] font-bold uppercase tracking-tighter">
                        <Info className="w-3 h-3 mr-2" /> View Audio Outcome
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-l dark:border-zinc-800 flex flex-col p-0 shadow-2xl">
                    <SheetHeader className="p-6 border-b dark:border-zinc-800">
                        <SheetTitle className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Voice Audit Deep-Dive
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            Detailed forensic analysis for Response
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                        {voiceAnswers.data.map((data, index) => (
                            <div key={index} className="group relative p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer overflow-hidden space-y-6">
                                {/* Visual Accent */}
                                <div className={cn(
                                    "absolute top-0 left-0 w-1.5 h-full transition-all duration-500",
                                    data.analysis_result?.conclusion === 'Human' ? "bg-emerald-500" : "bg-rose-500"
                                )} />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            <BrainCircuit className="w-3.5 h-3.5 text-primary/60" /> AI Verdict
                                        </h4>
                                        <div className="h-2 w-2 rounded-full bg-primary/20 animate-pulse" />
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-inner">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Conclusion</p>
                                            <p className={cn(
                                                "text-xl font-black tracking-tight",
                                                data.analysis_result?.conclusion === 'Human' ? 'text-emerald-500' : 'text-rose-500'
                                            )}>
                                                {data.analysis_result?.conclusion || "Not Analyzed"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Confidence</p>
                                            <p className="text-xl font-mono font-black tabular-nums tracking-tighter">
                                                {((data.analysis_result?.confidence_score ?? 0) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                        <FileSearch className="w-3.5 h-3.5 text-primary/60" /> Forensic Reasoning
                                    </h4>
                                    <div className="relative p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10 italic">
                                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                                            "{data.analysis_result?.reasoning || "No detailed reasoning provided."}"
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                        <Database className="w-3.5 h-3.5 text-primary/60" /> Session Intelligence
                                    </h4>
                                    <div className="space-y-4 text-[11px] font-medium bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                                        <div className="space-y-1.5">
                                            <p className="text-primary/70 font-black uppercase tracking-widest text-[9px]"># FILE URI</p>
                                            <p className="break-all opacity-70 font-mono text-[10px] leading-relaxed selection:bg-primary selection:text-white">
                                                {data.gcs_uri}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                            <div>
                                                <p className="text-zinc-400 font-black uppercase tracking-tighter text-[9px]">SESSION_ID</p>
                                                <p className="truncate font-mono">{data.session_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-400 font-black uppercase tracking-tighter text-[9px]">JOB_ID</p>
                                                <p className="font-mono">{data.job_id}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                                            <p className="text-zinc-400 font-black uppercase tracking-tighter text-[9px]">TIMESTAMP</p>
                                            <p className="font-mono opacity-80">{new Date(data.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        disabled={downloading}
                                        className={cn(
                                            "w-full gap-2 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] py-6 shadow-xl",
                                            "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white hover:scale-[1.02]",
                                            data.gcs_uri ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (data.gcs_uri) downloadVoiceUrl(data.gcs_uri.substring(data.gcs_uri.indexOf("uploads/")))
                                        }}
                                    >
                                        {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                                        {data.gcs_uri ? "Play Source Audio" : "No Audio Source"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet></div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border dark:border-zinc-800 rounded-3xl p-6 shadow-2xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Headphones className="w-5 h-5" />
                            </div>
                            Source Audio
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center py-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                        {fileUrl ? (
                            <audio
                                controls
                                autoPlay
                                className="w-full max-w-[280px]"
                                src={decodeURIComponent(fileUrl)}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}