import { BrainCircuit, CheckCircle2, Mail, Quote, XCircle, Fingerprint, Activity, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getInterviewAnswersList, interviewEvaluate } from "@/lib/server-function";
import { NoEvaluation } from "./no-evaluation";
import { TotalScoreCard } from "./total-score-card";
import { EvaluationDialog } from "./evaluation-dialog";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export const interviewAnswerQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['candidates', email, job_id],
    queryFn: () => getInterviewAnswersList({ data: { candidate: email, job_id: job_id } })
})

export function AnswerOutcome({ email, id, interview_evaluation }: { email: string, id: string, interview_evaluation: string }) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [evaluation, setEvaluation] = useState(interview_evaluation)
    const { data: answers } = useSuspenseQuery(interviewAnswerQueryOptions(email, id))

    if (answers.data.length === 0) {
        return <NoEvaluation />;
    }

    const confirmEvaluation = async (data: { verdict: string, feedback: string }) => {
        startTransition(async () => {
            try {
                await interviewEvaluate({ data: { job_id: answers.data[0].job_id, candidate_email: answers.data[0].candidate, verdict: data.verdict, feedback: data.feedback } })
                toast.success("Evaluation Successful")
                setOpen(false)
                setEvaluation("EVALUATED")
            } catch (e: any) {
                toast.error(e.message)
            }
        })
    }

    const currentScores = answers.data.map((data) => data.score ?? 0);

    return (
        <div className="space-y-12">
            <TotalScoreCard scores={currentScores} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        <Fingerprint className="w-3 h-3" />
                        Audit Ref: <span className="text-foreground">{id}</span>
                        <span className="opacity-20 px-1">•</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full border text-[9px]",
                            evaluation === "PENDING" ? "bg-amber-500/5 text-amber-600 border-amber-500/10" : "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
                        )}>
                            {evaluation}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Technical Response Audit
                    </h1>
                </div>
                <EvaluationDialog confirmEvaluation={confirmEvaluation} isPending={isPending} open={open} setOpen={setOpen} evaluation={evaluation} />
            </div>

            <div className="space-y-10">
                {answers.data.map((data, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content: The Evaluation Card */}
                        <Card className="lg:col-span-3 shadow-xl border shadow-zinc-200/50 dark:shadow-none dark:border-muted-foreground/10 overflow-hidden rounded-[2rem] bg-card/50 backdrop-blur-sm">
                            <div className="bg-zinc-900 dark:bg-zinc-900/80 p-6 md:p-8 text-white flex justify-between items-start relative overflow-hidden">
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />

                                <div className="space-y-3 relative z-10 max-w-[80%]">
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                        Question Session {index + 1}
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold tracking-tight leading-snug">
                                        {data.question}
                                    </h2>
                                </div>

                                {/* Score Indicator inside the Question Header */}
                                <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 min-w-[100px] backdrop-blur-md border border-white/10 shadow-2xl relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400/80 mb-1">Impact</span>
                                    <span className={cn(
                                        "text-4xl font-black tabular-nums tracking-tighter",
                                        (data.score ?? 0) < 50 ? 'text-rose-400' : 'text-emerald-400'
                                    )}>
                                        {data.score ?? 0}
                                    </span>
                                </div>
                            </div>

                            <CardContent className="p-0">
                                {/* Candidate's Response Section */}
                                <div className="p-6 md:p-8 space-y-8">
                                    <div className="relative group/answer overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50 rounded-3xl" />
                                        <div className="relative z-10 p-6 md:p-8 rounded-3xl border border-primary/10 shadow-inner group-hover/answer:border-primary/20 transition-all duration-500">
                                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                                            <Quote className="absolute top-4 right-6 w-16 h-16 text-primary/5 rotate-12 transition-transform group-hover/answer:scale-110 duration-700" />

                                            <div className="flex flex-col gap-4 relative z-10">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-px w-6 bg-primary/30" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Candidate Transcript</span>
                                                </div>
                                                <div className="italic text-lg md:text-2xl text-foreground font-medium leading-relaxed tracking-tight group-hover/answer:text-primary transition-colors duration-500">
                                                    "{data.answer}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Reasoning Section */}
                                    <div className="pt-6 border-t border-muted-foreground/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                <BrainCircuit className="w-4 h-4" /> AI Feedback Analysis
                                            </div>
                                            <Badge variant="outline" className="text-[9px] font-bold opacity-40">GEMINI PRO 1.5</Badge>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            <p className="text-sm md:text-base leading-relaxed text-muted-foreground bg-muted/20 p-5 rounded-2xl border border-muted-foreground/5 relative overflow-hidden">
                                                <AlertCircle className="absolute -bottom-4 -right-4 w-20 h-20 opacity-[0.03] pointer-events-none" />
                                                {data.reasoning}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar: Candidate & Meta */}
                        <div className="space-y-6 lg:pt-4">
                            <Card className="shadow-lg border shadow-zinc-200/50 dark:shadow-none dark:border-muted-foreground/10 rounded-[1.5rem] overflow-hidden bg-card/30">
                                <CardHeader className="pb-4 pt-6 bg-muted/30">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Fingerprint className="h-3.5 w-3.5 opacity-50" /> Identity verification
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pb-6 pt-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1.5 tracking-widest">Candidate</p>
                                            <p className="text-xs font-bold truncate text-foreground/80">{data.candidate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border border-amber-500/10 shadow-inner",
                                            "bg-amber-500/10 text-amber-600"
                                        )}>
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1.5 tracking-widest">Analysis Verdict</p>
                                            <Badge variant="outline" className="text-[9px] h-5 bg-amber-500/5 border-amber-500/20 text-amber-600 font-black">
                                                {data?.ai_verdict}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    <div className="space-y-4 pt-2">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3" /> System Diagnostics
                                        </h4>
                                        <div className="space-y-3">
                                            <CheckItem label="Logic Consistency" status={data.answer_evaluation} />
                                            <CheckItem label="Identity Match (Text)" status={data.text_evaluation} />
                                            <CheckItem label="Voice Biometrics" status={data.voice_evaluation} />
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="bg-muted/50 p-4 border-t border-muted/50 flex items-center gap-3">
                                    <Clock className="h-3 w-3 text-muted-foreground/60" />
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                                        Processed: {new Date(data?.evaluated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CheckItem = ({ label, status }: { label: string; status: boolean }) => (
    <div className="flex items-center justify-between group">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        <div className={cn(
            "p-1 rounded-full",
            status ? "bg-emerald-500/10" : "bg-rose-500/10"
        )}>
            {status ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
            )}
        </div>
    </div>
);
