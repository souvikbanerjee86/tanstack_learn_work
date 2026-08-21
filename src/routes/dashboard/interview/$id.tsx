import { AnswerOutcome } from '@/components/web/answer-outcome'
import { AudioOutcome } from '@/components/web/audio-outcome'
import { createFileRoute, useLocation, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import InterviewFeedbackSkeleton from '@/components/web/interview-feedback-skeleton'
import { MovementOutCome } from '@/components/web/movement-outcome'
import { ChevronLeft, ShieldCheck, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/interview/$id')({
    loaderDeps: ({ search }: any) => ({
        email: search.email,
    }),
    loader: async ({ params, deps }) => {
        const { id } = params
        const { email } = deps
        return { email, id }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { email, id } = Route.useLoaderData()
    const location = useLocation()
    const { interview_status, feedback } = (location.state as any) || {}

    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 lg:p-14 pb-24 relative overflow-hidden transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
                {/* --- Executive Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-border/40">
                    <div className="space-y-3">
                        <Link
                            to="/dashboard/interview"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Sessions
                        </Link>
                        
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="h-13 w-13 sm:h-16 sm:w-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5 text-indigo-600 dark:text-indigo-400 shrink-0">
                                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
                                        Interview Evaluation
                                    </h1>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                                        Candidate Audit
                                    </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1 truncate">
                                    <Mail className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                    <span>Analysis for candidate</span>
                                    <span className="text-foreground font-bold truncate">{email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Forensic Outcome Action Drawers */}
                    <div className="flex flex-wrap items-center gap-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-2 rounded-2xl border border-border/60 shadow-md shadow-black/5 self-start md:self-auto">
                        <Suspense fallback={<div className="h-9 w-28 bg-muted animate-pulse rounded-xl" />}>
                            <AudioOutcome email={email} id={id} />
                        </Suspense>
                        <Suspense fallback={<div className="h-9 w-28 bg-muted animate-pulse rounded-xl" />}>
                            <MovementOutCome email={email} id={id} />
                        </Suspense>
                    </div>
                </div>

                {/* --- Main Audit Content --- */}
                <div className="relative">
                    <Suspense fallback={<InterviewFeedbackSkeleton />}>
                        <AnswerOutcome 
                            email={email} 
                            id={id} 
                            interview_evaluation={interview_status ?? "PENDING"} 
                            feedback_value={feedback ?? ""} 
                        />
                    </Suspense>
                </div>

                {/* --- Footer Note --- */}
                <div className="pt-16 pb-6 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="h-px w-24 bg-border/60" />
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 max-w-sm leading-relaxed">
                        Automated Analysis provided by EazyAI Intelligence Systems. Verify with human oversight.
                    </p>
                </div>
            </div>
        </div>
    );
}
