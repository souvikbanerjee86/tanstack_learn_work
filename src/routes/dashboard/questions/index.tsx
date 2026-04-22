import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, HelpCircle, Loader2, Plus, Sparkles, MessageSquare, LayoutGrid, Info } from 'lucide-react'
import { Suspense, useState } from 'react'
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
        <div className="relative min-h-screen flex flex-col lg:flex-row h-full max-w-full gap-6 lg:gap-14 p-4 md:p-10 lg:p-14 overflow-hidden bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
            </div>
            {/* --- Sidebar: Job List --- */}
            <JobContent selectedJobId={selectedJobId} jobs={jobs} getQuestions={getQuestions} />

            {/* --- Main Area: Questions --- */}
            <div className={cn(
                "flex-1 flex flex-col gap-6 h-full min-h-0 min-w-0",
                !selectedJobId && "hidden lg:flex"
            )}>
                {selectedJobId ? (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="lg:hidden shrink-0 rounded-xl h-10 w-10 border-muted-foreground/20"
                                    onClick={() => getQuestions(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                        <h2 className="text-xl md:text-2xl font-black tracking-tight truncate">
                                            {selectedJob?.job_title}
                                        </h2>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-[9px] md:text-[10px] uppercase px-1.5 py-0">
                                            {selectedJob?.job_id}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] md:text-sm text-muted-foreground flex items-center gap-1.5 font-medium opacity-70">
                                        <Info className="h-3.5 w-3.5" />
                                        Define and refine evaluation criteria.
                                    </p>
                                </div>
                                <div className="hidden lg:flex items-center gap-2">
                                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" className="rounded-xl border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 gap-2 border shadow-sm h-11 px-5">
                                                <Sparkles className="h-4 w-4" />
                                                <span className="font-bold">AI Draft</span>
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
                                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-primary/20 blur opacity-40 group-focus-within:opacity-100 transition-opacity rounded-[2rem]" />
                                <div className="relative flex flex-col gap-3 p-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-muted/60 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-black/5">
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
                                            className="min-h-[50px] md:min-h-[60px] max-h-[120px] resize-none border-none focus-visible:ring-0 bg-transparent text-sm md:text-base placeholder:text-muted-foreground/40 px-3 py-2"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-2 pt-2 border-t border-muted/40 sm:border-none sm:pt-0">
                                        <Button
                                            size="sm"
                                            onClick={addQuestion}
                                            className="flex-1 sm:flex-none rounded-xl md:rounded-2xl px-6 h-11 md:h-12 gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px]"
                                            disabled={loading || !newQuestion.trim()}
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 shrink-0" />}
                                            Add Question
                                        </Button>
                                        <div className="lg:hidden">
                                            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full rounded-xl md:rounded-2xl h-11 md:h-12 gap-2 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px]">
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
                        <Card className="flex-1 flex flex-col shadow-2xl shadow-black/5 border-muted/40 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-white/40 dark:bg-zinc-950/40 backdrop-blur-2xl">
                            <CardHeader className="bg-muted/5 border-b border-muted/40 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[10px] md:text-xs font-black flex items-center gap-2 text-primary/60 uppercase tracking-[0.2em]">
                                        <HelpCircle className="h-4 w-4" />
                                        Bank of Questions
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 opacity-20">
                                        <LayoutGrid className="h-4 w-4" />
                                        <Separator orientation="vertical" className="h-3 bg-muted-foreground" />
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                </div>
                            </CardHeader>
                            <Suspense fallback={<div className="p-8 md:p-12"><QuestionsSkeleton /></div>}>
                                <Questions job_id={selectedJobId} deleteQuestion={deleteQuestion} />
                            </Suspense>
                        </Card>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-card/10 rounded-[2.5rem] border-2 border-dashed border-muted/50">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-6 rotate-3 transform transition-transform hover:rotate-6">
                            <LayoutGrid className="h-8 w-8 md:h-10 md:w-10 text-primary opacity-30" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black mb-2 tracking-tight">Select a Job Role</h2>
                        <p className="text-xs md:text-sm text-muted-foreground text-center max-w-[240px] md:max-w-sm font-medium leading-relaxed opacity-60">
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
                            className="rounded-2xl h-12 flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
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