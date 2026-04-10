import { AnswerOutcome } from '@/components/web/answer-outcome'
import { AudioOutcome } from '@/components/web/audio-outcome'
import { createFileRoute, useLocation, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import InterviewFeedbackSkeleton from '@/components/web/interview-feedback-skeleton'
import { MovementOutCome } from '@/components/web/movement-outcome'
import { ChevronLeft, PieChart, ShieldCheck } from 'lucide-react'

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
    const { interview_status } = location.state as any;

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-14 transition-colors">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* --- Executive Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-muted-foreground/10">
                    <div className="space-y-4">
                        <Link
                            to="/dashboard/interview"
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                            Back to Sessions
                        </Link>
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">Interview Evaluation</h1>
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                                    <PieChart className="h-3.5 w-3.5" />
                                    Deep dive analysis for candidate <span className="text-foreground font-bold">{email}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-muted/30 p-2 rounded-[1.5rem] border border-muted-foreground/5">
                        <Suspense fallback={<div className="h-10 w-24 bg-muted animate-pulse rounded-xl" />}>
                            <AudioOutcome email={email} id={id} />
                        </Suspense>
                        <Suspense fallback={<div className="h-10 w-24 bg-muted animate-pulse rounded-xl" />}>
                            <MovementOutCome email={email} id={id} />
                        </Suspense>
                    </div>
                </div>

                {/* --- Main Audit Content --- */}
                <div className="relative">
                    {/* Visual Decor */}
                    <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                    <Suspense fallback={<InterviewFeedbackSkeleton />}>
                        <AnswerOutcome email={email} id={id} interview_evaluation={interview_status} />
                    </Suspense>
                </div>

                {/* --- Footer Note --- */}
                <div className="pt-20 pb-10 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="h-px w-20 bg-muted" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 max-w-xs leading-loose">
                        Automated Analysis provided by EazyAI Intelligence Systems. Verify results with human oversight.
                    </p>
                </div>
            </div>
        </div>
    );
};
