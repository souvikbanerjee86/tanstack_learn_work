
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, HelpCircle, Loader2, Plus } from 'lucide-react'
import { Suspense, useState } from 'react'
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { addInterviewQuestion, deleteInterviewQuestion, getInterviewQuestions, getJobDetails } from '@/lib/server-function'
import { QuestionsSkeleton } from '@/components/web/questions-skeleton'
import { QuestionsContent } from '@/components/web/questions-content'
import { JobContent } from '@/components/web/job-content'
import { toast } from 'sonner'

export const jobsQueryOptions = queryOptions({
    queryKey: ['jobs'],
    queryFn: () => getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
})

export const questionsQueryOptions = (job_id: string) => queryOptions({
    queryKey: ['questions', job_id],
    queryFn: () => getInterviewQuestions({ data: { job_id: job_id, limit: null, offset: null } })
})
export const Route = createFileRoute('/dashboard/questions/')({
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(jobsQueryOptions)
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useSuspenseQuery(jobsQueryOptions)
    const [jobs, setJobs] = useState(data.data)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(data.data[0].job_id)
    const [newQuestion, setNewQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const selectedJob = jobs.find((j) => j.id === selectedJobId)

    const addQuestion = async () => {
        if (!newQuestion.trim() || !selectedJobId) return
        try {
            setLoading(true)
            await addInterviewQuestion({ data: { job_id: selectedJobId, question: newQuestion } })
            toast("Question Added Successfully")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
            setNewQuestion("")
        } catch (e) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }

    }

    function getQuestions(job_id: string | null) {
        console.log(job_id)
        setSelectedJobId(job_id)
    }

    async function deleteQuestion(question_id: string) {
        await deleteInterviewQuestion({ data: { question_id: question_id } })
        toast("Question Deleted Successfully")
        queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
    }



    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] max-w-7xl gap-4 p-4 lg:p-8">

            {/* --- Sidebar: Job List --- */}
            <Suspense fallback={<>Loading.....</>}>
                <JobContent selectedJobId={selectedJobId} jobs={jobs} getQuestions={getQuestions} />
            </Suspense>


            {/* --- Main Area: Questions --- */}
            <div className={`flex-1 flex flex-col gap-4 ${!selectedJobId && 'hidden md:flex'}`}>

                <>
                    {/* Header with Mobile Back Button */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => getQuestions(null)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{selectedJob?.job_title}</h2>
                            <p className="text-sm text-muted-foreground italic">Manage interview questions for this role.</p>
                        </div>
                    </div>

                    <Card className="flex-1 flex flex-col shadow-lg border-muted/60 overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4 text-primary" />
                                    Interview Questions
                                </CardTitle>

                                {/* Add Question Input */}
                                <div className="flex items-center gap-2 w-full ">
                                    <Textarea
                                        placeholder="Type a new question..."
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                                        className="h-15 bg-background"
                                    />
                                    <Button size="sm" onClick={addQuestion} className="gap-2" disabled={loading}>
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        {loading ? "Adding..." : "Add"}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <Suspense fallback={<QuestionsSkeleton />}>
                            <Questions job_id={selectedJobId} deleteQuestion={deleteQuestion} />
                        </Suspense>

                    </Card>
                </>

            </div>
        </div>
    )
}


function Questions({ job_id, deleteQuestion }: { job_id: string | null, deleteQuestion: (question_id: string) => void }) {
    const { data } = useSuspenseQuery(questionsQueryOptions(job_id!))
    const questions = data.questions
    return <QuestionsContent questions={questions} deleteQuestion={deleteQuestion} />
}