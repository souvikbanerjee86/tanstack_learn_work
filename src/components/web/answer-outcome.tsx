import { BrainCircuit, CheckCircle2, Mail, Quote, XCircle, Fingerprint, Activity, Clock, ShieldCheck, UserCheck, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getInterviewAnswersList, getInterviewSessionInfo, interviewEvaluate } from "@/lib/server-function";
import { NoEvaluation } from "./no-evaluation";
import { TotalScoreCard } from "./total-score-card";
import { EvaluationDialog } from "./evaluation-dialog";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { SessionTimeline } from "./session-timeline";
import { interviewVoiceAnswerQueryOptions } from "./audio-outcome";
import { movementDetectionDetailsQueryOptions } from "./movement-outcome";
import { PDFDownloadButton } from "./pdf-download-button";
import { IntegrityTrustGauge } from "./integrity-trust-gauge";
import { KeywordRubricInspector } from "./keyword-rubric-inspector";

export const interviewAnswerQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['candidates', email, job_id],
    queryFn: () => getInterviewAnswersList({ data: { candidate: email, job_id: job_id } })
})

export const interviewSessionInfoQueryOptions = (email: string, session_id: string) => queryOptions({
    queryKey: ['interviewSession', email, session_id],
    queryFn: () => getInterviewSessionInfo({ data: { user_id: email, app: "app", session_id: session_id } })
})

export function AnswerOutcome({ email, id, interview_evaluation, feedback_value }: { email: string, id: string, interview_evaluation: string, feedback_value: string }) {
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [evaluation, setEvaluation] = useState(interview_evaluation)
    const { data: answers } = useSuspenseQuery(interviewAnswerQueryOptions(email, id))

    if (!answers?.data || answers.data.length === 0) {
        return <NoEvaluation />;
    }
    const { data: sessions } = useSuspenseQuery(interviewSessionInfoQueryOptions(email, answers.data[0].session_id))

    // Fetch audio and movement data for the report
    const { data: voiceAnswersData } = useQuery(interviewVoiceAnswerQueryOptions(email, id))
    const { data: movementDataResult } = useQuery(movementDetectionDetailsQueryOptions(email, id))

    const confirmEvaluation = async (data: { verdict: string, feedback: string }) => {
        startTransition(async () => {
            try {
                await interviewEvaluate({ 
                    data: { 
                        job_id: answers.data[0].job_id, 
                        candidate_email: answers.data[0].candidate, 
                        verdict: data.verdict, 
                        feedback: data.feedback 
                    } 
                })
                toast.success("Hiring decision saved successfully")
                setOpen(false)
                setEvaluation("EVALUATED")
            } catch (e: any) {
                toast.error(e.message || "Failed to submit evaluation")
            }
        })
    }

    const currentScores = answers.data.map((data) => data.score ?? 0);
    const candidateAnswersList = answers.data.map((d) => d.answer ?? "");
    const questionsMeta = answers.data.map((d) => ({
        question: d.question,
        sample_answer: (d as any).sample_answer || "",
        keywords: (d as any).keywords || [],
    }));

    const movementAnomaliesTotal = movementDataResult?.data ? movementDataResult.data.length : 0;

    return (
        <div className="space-y-10">
            {/* Top Score Aggregator */}
            <TotalScoreCard scores={currentScores} />

            {/* Synthesized Integrity Trust Gauge */}
            <IntegrityTrustGauge
                faceConfidence={96}
                movementAnomaliesCount={movementAnomaliesTotal}
                audioClarityScore={92}
                totalQuestionsCount={answers.data.length}
            />

            {/* Semantic Keyword & Rubric Inspector */}
            <KeywordRubricInspector
                candidateAnswers={candidateAnswersList}
                questions={questionsMeta}
            />

            {/* Audit Toolbar & Decision Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/60 shadow-lg shadow-black/5">
                <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex-wrap">
                        <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Audit Ref:</span>
                        <span className="text-foreground font-mono font-bold">{id}</span>
                        <span className="opacity-30">•</span>
                        <Badge 
                            variant="outline" 
                            className={cn(
                                "text-[9px] font-black uppercase tracking-wider px-2 py-0.5",
                                evaluation === "PENDING" 
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" 
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            )}
                        >
                            {evaluation}
                        </Badge>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                        Technical Response Assessment
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <PDFDownloadButton
                        email={email}
                        id={id}
                        evaluation={evaluation}
                        feedback={feedback_value}
                        answers={answers.data}
                        voiceAnswers={voiceAnswersData?.data}
                        movementData={movementDataResult?.data}
                    />
                    <EvaluationDialog 
                        confirmEvaluation={confirmEvaluation} 
                        isPending={isPending} 
                        open={open} 
                        setOpen={setOpen} 
                        evaluation={evaluation} 
                    />
                </div>
            </div>

            {/* Admin Evaluation Feedback Banner (if available) */}
            {feedback_value && (
                <div className="p-5 sm:p-6 rounded-3xl border border-l-4 shadow-xl backdrop-blur-xl bg-gradient-to-r from-indigo-500/5 via-background to-transparent border-indigo-500/20 border-l-indigo-600 space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Official Recruiter Verdict Feedback
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground/90 leading-relaxed italic pl-6 border-l border-indigo-500/30">
                        "{feedback_value}"
                    </p>
                </div>
            )}

            {/* AI Session Telemetry Trace */}
            {sessions && <SessionTimeline session={sessions} />}

            {/* Detailed Question Answers List */}
            <div className="space-y-8">
                {answers.data.map((data, index) => {
                    const isHighImpact = (data.score ?? 0) >= 7;
                    return (
                        <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Main Content: Question & Answer Evaluation Card */}
                            <Card className="lg:col-span-3 shadow-xl border border-border/60 overflow-hidden rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl flex flex-col justify-between">
                                {/* Question Title Header */}
                                <div className="bg-zinc-900 text-white p-6 sm:p-8 flex justify-between items-start gap-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] pointer-events-none" />

                                    <div className="space-y-2 relative z-10 max-w-[80%]">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                            Question Prompt {index + 1}
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold tracking-tight leading-snug text-white">
                                            {data.question}
                                        </h3>
                                    </div>

                                    {/* Score Indicator */}
                                    <div className="flex flex-col items-center justify-center bg-white/10 rounded-2xl p-3 sm:p-4 min-w-[80px] sm:min-w-[90px] backdrop-blur-md border border-white/10 shadow-lg relative z-10 shrink-0">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mb-0.5">Score</span>
                                        <span className={cn(
                                            "text-2xl sm:text-3xl font-black tabular-nums tracking-tighter",
                                            isHighImpact ? 'text-emerald-400' : (data.score ?? 0) >= 4 ? 'text-amber-400' : 'text-rose-400'
                                        )}>
                                            {data.score ?? 0}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-6 sm:p-8 space-y-6">
                                    {/* Candidate's Transcript */}
                                    <div className="relative group overflow-hidden rounded-2xl border border-indigo-500/15 bg-indigo-500/5 dark:bg-indigo-950/20 p-5 sm:p-6 space-y-3">
                                        <Quote className="absolute top-4 right-4 w-12 h-12 text-indigo-500/10 rotate-12 pointer-events-none" />
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="h-px w-6 bg-indigo-500/40" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                                Candidate Response Transcript
                                            </span>
                                        </div>

                                        <p className="italic text-sm sm:text-base text-foreground font-medium leading-relaxed">
                                            "{data.answer}"
                                        </p>
                                    </div>

                                    {/* AI Reasoning Analysis */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                                <BrainCircuit className="w-4 h-4" /> AI Evaluation Reasoning
                                            </span>
                                            <Badge variant="outline" className="text-[9px] font-mono text-muted-foreground/60 border-border/40">
                                                Gemini Engine
                                            </Badge>
                                        </div>
                                        <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/40 text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                                            {data.reasoning}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sidebar: Candidate & Meta Diagnostics */}
                            <div className="space-y-6">
                                <Card className="shadow-lg border border-border/60 rounded-3xl overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl">
                                    <CardHeader className="pb-3 pt-5 px-5 bg-muted/20 border-b border-border/40">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-indigo-500" /> Integrity Verification
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="p-5 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Candidate</p>
                                                <p className="text-xs font-bold truncate text-foreground">{data.candidate}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">Analysis Verdict</p>
                                                <Badge variant="outline" className="text-[10px] font-black uppercase mt-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                                    {data?.ai_verdict || "Evaluated"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <Separator className="opacity-40" />

                                        {/* Diagnostics checklist */}
                                        <div className="space-y-3 pt-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5">
                                                <Sparkles className="h-3 w-3 text-indigo-500" /> Automated Telemetry
                                            </span>
                                            <div className="space-y-2.5">
                                                <CheckItem label="Logic Consistency" status={data.answer_evaluation} />
                                                <CheckItem label="Identity Match" status={data.text_evaluation} />
                                                <CheckItem label="Voice Biometrics" status={data.voice_evaluation} />
                                            </div>
                                        </div>
                                    </CardContent>

                                    <div className="bg-muted/30 px-5 py-3 border-t border-border/40 flex items-center gap-2 text-[10px] font-bold text-muted-foreground font-mono">
                                        <Clock className="h-3 w-3 opacity-60" />
                                        <span>Processed: {new Date(data?.evaluated_at).toLocaleDateString()}</span>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const CheckItem = ({ label, status }: { label: string; status: boolean }) => (
    <div className="flex items-center justify-between group text-xs font-semibold">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
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
