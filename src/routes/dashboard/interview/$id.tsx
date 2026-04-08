
import { AnswerOutcome } from '@/components/web/answer-outcome'
import { AudioOutcome } from '@/components/web/audio-outcome'
import { createFileRoute, useLocation } from '@tanstack/react-router'

import { Suspense } from 'react'
import InterviewFeedbackSkeleton from '@/components/web/interview-feedback-skeleton'
import { MovementOutCome } from '@/components/web/movement-outcome'




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

                <div className='flex flex-1 flex-row items-center justify-end gap-2'>
                    <Suspense>
                        <AudioOutcome email={email} id={id} />
                    </Suspense>

                    <Suspense>
                        <MovementOutCome email={email} id={id} />
                    </Suspense>
                </div>



                <Suspense fallback={<InterviewFeedbackSkeleton />}>
                    <AnswerOutcome email={email} id={id} interview_evaluation={interview_status} />
                </Suspense>

            </div>
        </div>
    );
};



