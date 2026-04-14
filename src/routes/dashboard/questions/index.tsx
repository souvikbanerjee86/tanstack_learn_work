import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, HelpCircle, Loader2, Plus, Sparkles, MessageSquare, LayoutGrid, Info } from 'lucide-react'
import { Suspense, useState, useEffect } from 'react'
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { addInterviewQuestion, addQuestionUsingAI, deleteInterviewQuestion, getInterviewQuestions, getJobDetails } from '@/lib/server-function'
import { QuestionsSkeleton } from '@/components/web/questions-skeleton'
import { QuestionsContent } from '@/components/web/questions-content'
import { JobContent } from '@/components/web/job-content'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { QuestionsLayoutSkeleton } from '@/components/web/questions-layout-skeleton'
import { JobContentSkeleton } from '@/components/web/job-content-skeleton'

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
    return (
        <Suspense fallback={<QuestionsLayoutSkeleton />}>
            <QuestionsDashboardWrapper />
        </Suspense>
    )
}

function QuestionsDashboardWrapper() {
    const { data } = useSuspenseQuery(jobsQueryOptions)
    const jobs = data.data
    const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.job_id ?? null)
    const [isOpen, setIsOpen] = useState(false);
    const [questionCount, setQuestionCount] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [newQuestion, setNewQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const selectedJob = jobs.find((j) => j.job_id === selectedJobId)

    const addQuestion = async () => {
        if (!newQuestion.trim() || !selectedJobId) return
        try {
            setLoading(true)
            await addInterviewQuestion({ data: { job_id: selectedJobId, question: newQuestion } })
            toast.success("Question added successfully")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
            setNewQuestion("")
        } catch (e) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    function getQuestions(job_id: string | null) {
        setSelectedJobId(job_id)
    }

    async function deleteQuestion(question_id: string) {
        try {
            await deleteInterviewQuestion({ data: { question_id: question_id } })
            toast.success("Question deleted successfully")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
        } catch (e) {
            toast.error("Failed to delete question")
        }
    }

    const createAIQuestion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (questionCount < 1) {
            setError("Please select the number of questions")
            return
        }
        try {
            setLoading(true)
            await addQuestionUsingAI({ data: { job_id: selectedJobId!, num_of_questions: questionCount } })
            toast.success("AI generated questions added")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
        } catch (e) {
            toast.error("Something went wrong with AI generation")
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full max-w-full gap-8 p-4 md:p-10 lg:p-14 overflow-hidden bg-transparent">
            {/* --- Sidebar: Job List --- */}
            <JobContent selectedJobId={selectedJobId} jobs={jobs} getQuestions={getQuestions} />

            {/* --- Main Area: Questions --- */}
            <div className={cn(
                "flex-1 flex flex-col gap-6 h-full min-h-0",
                !selectedJobId && "hidden md:flex"
            )}>
                {selectedJobId ? (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="md:hidden shrink-0 rounded-xl"
                                    onClick={() => getQuestions(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-black tracking-tight truncate">
                                            {selectedJob?.job_title}
                                        </h2>
                                        <Badge variant="outline" className="hidden sm:flex bg-primary/5 text-primary border-primary/20 font-mono text-[10px] uppercase">
                                            {selectedJob?.job_id}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                                        <Info className="h-3.5 w-3.5" />
                                        Define and refine the evaluation criteria for this role.
                                    </p>
                                </div>
                                <div className="hidden lg:flex items-center gap-2">
                                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" className="rounded-xl border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 gap-2 border shadow-sm">
                                                <Sparkles className="h-4 w-4" />
                                                <span>AI Draft</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertComponent 
                                            createAIQuestion={createAIQuestion} 
                                            setQuestionCount={setQuestionCount} 
                                            error={error} 
                                            loading={loading} 
                                        />
                                    </AlertDialog>
                                </div>
                            </div>

                            {/* Add Question Input Area */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-primary blur opacity-20 group-focus-within:opacity-40 transition-opacity rounded-3xl" />
                                <div className="relative flex flex-col sm:flex-row gap-3 p-3 bg-card border rounded-2xl shadow-sm">
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Type a custom interview question..."
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    addQuestion();
                                                }
                                            }}
                                            className="min-h-[60px] max-h-[120px] resize-none border-none focus-visible:ring-0 bg-transparent text-base placeholder:text-muted-foreground/50 px-3 py-2"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 px-1 pb-1 sm:pb-0">
                                        <Button 
                                            size="sm" 
                                            onClick={addQuestion} 
                                            className="rounded-xl px-5 h-10 gap-2 shadow-md transition-all active:scale-95" 
                                            disabled={loading || !newQuestion.trim()}
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 shrink-0" />}
                                            <span className="font-bold">Add Question</span>
                                        </Button>
                                        <div className="sm:hidden flex-1">
                                             <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl h-10 gap-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                                                        <Sparkles className="h-4 w-4" />
                                                        AI Draft
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertComponent createAIQuestion={createAIQuestion} setQuestionCount={setQuestionCount} error={error} loading={loading} />
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions List Card */}
                        <Card className="flex-1 flex flex-col shadow-xl border-muted/60 overflow-hidden rounded-3xl bg-background/40 backdrop-blur-xl">
                            <CardHeader className="bg-muted/10 border-b px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary/80 uppercase tracking-widest">
                                        <HelpCircle className="h-4 w-4" />
                                        Bank of Questions
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        <LayoutGrid className="h-4 w-4" />
                                        <Separator orientation="vertical" className="h-3" />
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <Suspense fallback={<div className="p-8"><QuestionsSkeleton /></div>}>
                                <Questions job_id={selectedJobId} deleteQuestion={deleteQuestion} />
                            </Suspense>
                        </Card>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-card/20 rounded-3xl border-2 border-dashed border-muted/50">
                         <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <LayoutGrid className="h-10 w-10 text-primary opacity-40" />
                         </div>
                         <h2 className="text-2xl font-black mb-2 tracking-tight">Select a Job Role</h2>
                         <p className="text-muted-foreground text-center max-w-sm">
                            Pick a role from the sidebar to view, add, or generate interview questions.
                         </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function Questions({ job_id, deleteQuestion }: { job_id: string | null, deleteQuestion: (question_id: string) => void }) {
    const { data } = useSuspenseQuery(questionsQueryOptions(job_id!))
    const questions = data.questions || []
    return <QuestionsContent questions={questions} deleteQuestion={deleteQuestion} />
}

function AlertComponent({ createAIQuestion, setQuestionCount, error, loading }: { createAIQuestion: (e: React.MouseEvent<HTMLButtonElement>) => void, setQuestionCount: (value: number) => void, error: string | null, loading: boolean }) {
    return (
        <AlertDialogContent className="rounded-3xl border-indigo-500/20 max-w-md">
            <form>
                <AlertDialogHeader>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                        <Sparkles className="h-6 w-6 text-indigo-500" />
                    </div>
                    <AlertDialogTitle className="text-2xl font-black tracking-tight">AI Question Assistant</AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground/80 leading-relaxed pt-2">
                        I'll analyze the job description and create professional, tailored interview questions for this role.
                        <br /><br />
                        <span className="font-bold text-foreground">How many questions should I draft?</span>
                        
                        <NativeSelect 
                            className="mt-4 w-full rounded-xl bg-muted/50 border-muted-foreground/10 hover:bg-muted focus-within:ring-primary/20"
                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        >
                            <NativeSelectOption value="0">Choose Quantity</NativeSelectOption>
                            {[3, 5, 8, 10, 15].map(num => (
                                <NativeSelectOption key={num} value={num}>
                                    {num} Professional Questions
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                        {error && <p className='text-red-500 text-xs font-bold mt-2 ml-1 animate-pulse'>{error}</p>}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-8 gap-3">
                    <AlertDialogCancel className="rounded-2xl h-12 flex-1 border-muted bg-background hover:bg-muted font-bold transition-all">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="default"
                            type='submit'
                            className="rounded-2xl h-12 flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                            onClick={(e) => createAIQuestion(e)}
                            disabled={loading}
                        >
                            {loading ? "Drafting..." : "Draft Questions"}
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </form>
        </AlertDialogContent >
    );
}