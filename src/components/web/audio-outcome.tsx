import { BrainCircuit, Database, ExternalLink, FileSearch, Info, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getInterviewVoiceAnswersList } from "@/lib/server-function";

export const interviewVoiceAnswerQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['interviews', email, job_id],
    queryFn: () => getInterviewVoiceAnswersList({ data: { candidate: email, job_id: job_id } })
})


export function AudioOutcome({ email, id }: { email: string, id: string }) {
    const { data: voiceAnswers } = useSuspenseQuery(interviewVoiceAnswerQueryOptions(email, id))
    return (
        <div className='flex flex-row justify-end'>
            <div></div>
            <div> <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mt-2 text-[10px] font-bold uppercase tracking-tighter">
                        <Info className="w-3 h-3 mr-2" /> View Audio Outcome
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white dark:bg-zinc-950 border-l dark:border-zinc-800 flex flex-col p-0">
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

                            <div key={index}>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        <BrainCircuit className="w-4 h-4" /> AI Verdict
                                    </h4>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Conclusion</p>
                                            <p className={`text-lg font-bold ${data.analysis_result?.conclusion === 'Human' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {data.analysis_result?.conclusion || "Not Analyzed"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Confidence</p>
                                            <p className="text-lg font-mono font-bold">
                                                {((data.analysis_result?.confidence_score ?? 0) * 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        <FileSearch className="w-4 h-4" /> Forensic Reasoning
                                    </h4>
                                    <div className="relative p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 italic">
                                            "{data.analysis_result?.reasoning || "No detailed reasoning provided."}"
                                        </p>
                                    </div>
                                </div>


                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                        <Database className="w-4 h-4" /> File & Session Info
                                    </h4>
                                    <div className="space-y-3 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                        <div className="space-y-1">
                                            <p className="text-primary font-bold"># GCS URI</p>
                                            <p className="break-all opacity-70 selection:bg-primary selection:text-white cursor-text">
                                                {data.gcs_uri}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div>
                                                <p className="text-zinc-500">SESSION_ID</p>
                                                <p className="truncate">{data.session_id}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500">JOB_ID</p>
                                                <p>{data.job_id}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-zinc-500">TIMESTAMP</p>
                                            <p>{new Date(data.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>


                                <div className="pt-4">
                                    <Button variant="outline" className="w-full gap-2" asChild>
                                        {data.gcs_uri ? <a href={data.gcs_uri.replace('gs://', 'https://storage.googleapis.com/')} target="_blank" rel="noreferrer">
                                            <ExternalLink className="w-4 h-4" /> Inspect Source Audio
                                        </a> : <></>}
                                    </Button>
                                </div>
                            </div>

                        ))}
                    </div>
                </SheetContent>
            </Sheet></div>
        </div>
    )
}