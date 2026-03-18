
import { AnswerOutcome } from '@/components/web/answer-outcome'
import { AudioOutcome } from '@/components/web/audio-outcome'
import { getInterviewAnswersList } from '@/lib/server-function'
import { createFileRoute, useLocation } from '@tanstack/react-router'

import { queryOptions } from '@tanstack/react-query'
import { Suspense } from 'react'
import InterviewFeedbackSkeleton from '@/components/web/interview-feedback-skeleton'

export const interviewAnswerQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['candidates', email, job_id],
    queryFn: () => getInterviewAnswersList({ data: { candidate: email, job_id: job_id } })
})

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
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 text-slate-900 dark:text-zinc-100 transition-colors">
            <div className="max-w-5xl mx-auto space-y-6">

                <Suspense>
                    <AudioOutcome email={email} id={id} />
                </Suspense>


                <Suspense fallback={<InterviewFeedbackSkeleton />}>
                    <AnswerOutcome email={email} id={id} interview_evaluation={interview_status} />
                </Suspense>

            </div>
        </div>
    );
};



