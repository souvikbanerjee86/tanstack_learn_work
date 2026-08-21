import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, HelpCircle, Loader2, Plus, Sparkles, LayoutGrid, Info, CornerDownLeft } from 'lucide-react'
import { Suspense, useState } from 'react'
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { addInterviewQuestion, addQuestionUsingAI, deleteInterviewQuestion, getInterviewQuestions, getJobDetails } from '@/lib/server-function'
import { QuestionsSkeleton } from '@/components/web/questions-skeleton'
import { QuestionsContent } from '@/components/web/questions-content'
import { JobContent } from '@/components/web/job-content'
import { toast } from 'sonner'
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
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
    const [isOpen, setIsOpen] = useState(false)
    const [questionCount, setQuestionCount] = useState(5)
    const [newQuestion, setNewQuestion] = useState("")
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()
    const selectedJob = jobs.find((j) => j.job_id === selectedJobId)

    const addQuestion = async () => {
        if (!newQuestion.trim() || !selectedJobId) return
        try {
            setLoading(true)
            await addInterviewQuestion({ data: { job_id: selectedJobId, question: newQuestion.trim() } })
            toast.success("Question added to bank")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
            setNewQuestion("")
        } catch {
            toast.error("Failed to add question")
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
            toast.success("Question removed from bank")
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
        } catch {
            toast.error("Failed to delete question")
        }
    }

    const createAIQuestion = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (questionCount < 1 || !selectedJobId) {
            toast.error("Please select a valid question quantity")
            return
        }
        try {
            setLoading(true)
            await addQuestionUsingAI({ data: { job_id: selectedJobId, num_of_questions: questionCount } })
            toast.success(`Generated ${questionCount} questions with AI`)
            queryClient.invalidateQueries({ queryKey: ['questions', selectedJobId] });
            setIsOpen(false)
        } catch {
            toast.error("AI question generation failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex flex-col gap-6 md:gap-8 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- Ambient Background Elements --- */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 dark:bg-violet-500/5 blur-[80px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            {/* --- Executive Header --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-sm text-indigo-600 dark:text-indigo-400">
                        <HelpCircle className="h-6 w-6 md:h-7 md:w-7" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Interview Questions</h1>
                            <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-2 py-0.5">
                                {jobs.length} Positions
                            </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            Curate role-specific evaluation criteria and draft questions with AI.
                        </p>
                    </div>
                </div>

                {selectedJobId && (
                    <div className="hidden sm:flex items-center gap-2">
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger asChild>
                                <Button className="h-10 px-4 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
                                    <Sparkles className="h-4 w-4" />
                                    <span>AI Question Assistant</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertComponent
                                createAIQuestion={createAIQuestion}
                                questionCount={questionCount}
                                setQuestionCount={setQuestionCount}
                                loading={loading}
                            />
                        </AlertDialog>
                    </div>
                )}
            </div>

            {/* --- Main Two-Column Layout --- */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Sidebar: Job List */}
                <JobContent selectedJobId={selectedJobId} jobs={jobs} getQuestions={getQuestions} />

                {/* Right Area: Selected Role & Questions Bank */}
                <div className={cn(
                    "flex-1 w-full flex flex-col gap-5 min-w-0",
                    !selectedJobId && "hidden lg:flex"
                )}>
                    {selectedJobId ? (
                        <>
                            {/* Role Context Bar & Mobile Actions */}
                            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="lg:hidden shrink-0 rounded-xl h-9 w-9 border-border/60"
                                        onClick={() => getQuestions(null)}
                                        title="Back to roles"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                            <h2 className="text-lg md:text-xl font-black tracking-tight truncate text-foreground">
                                                {selectedJob?.job_title}
                                            </h2>
                                            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 font-mono text-[10px] uppercase px-1.5 py-0">
                                                {selectedJob?.job_id}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                                            <Info className="h-3 w-3 text-indigo-500 shrink-0" />
                                            <span>Evaluation rubric for candidates applying to this requisition.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex sm:hidden w-full items-center gap-2">
                                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button className="w-full h-10 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
                                                <Sparkles className="h-4 w-4" />
                                                <span>AI Draft Assistant</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertComponent
                                            createAIQuestion={createAIQuestion}
                                            questionCount={questionCount}
                                            setQuestionCount={setQuestionCount}
                                            loading={loading}
                                        />
                                    </AlertDialog>
                                </div>
                            </div>

                            {/* Add Custom Question Box */}
                            <div className="p-4 rounded-2xl sm:rounded-3xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-md space-y-3">
                                <Textarea
                                    placeholder="Type a new interview question for this role..."
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                            e.preventDefault();
                                            addQuestion();
                                        }
                                    }}
                                    className="min-h-[60px] max-h-[140px] resize-none border-border/40 focus-visible:ring-indigo-500/30 bg-muted/30 text-xs sm:text-sm rounded-xl p-3"
                                />
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-[11px] text-muted-foreground/70 hidden sm:inline-flex items-center gap-1 font-mono">
                                        <CornerDownLeft className="h-3 w-3" /> Press <strong>⌘ + Enter</strong> to quickly submit
                                    </span>
                                    <Button
                                        size="sm"
                                        onClick={addQuestion}
                                        className="ml-auto h-9 px-4 rounded-xl gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                                        disabled={loading || !newQuestion.trim()}
                                    >
                                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                                        <span>Add Question</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Questions Content Card */}
                            <Card className="flex-1 flex flex-col shadow-xl shadow-black/5 border-border/60 overflow-hidden rounded-[2rem] bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
                                <CardHeader className="bg-muted/30 border-b border-border/40 px-5 py-3.5">
                                    <CardTitle className="text-xs font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                                        <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                                        <span>Current Question Bank</span>
                                    </CardTitle>
                                </CardHeader>
                                <Suspense fallback={<div className="p-8"><QuestionsSkeleton /></div>}>
                                    <Questions 
                                        job_id={selectedJobId} 
                                        deleteQuestion={deleteQuestion} 
                                        onOpenAiModal={() => setIsOpen(true)}
                                        jobTitle={selectedJob?.job_title}
                                    />
                                </Suspense>
                            </Card>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 bg-white/40 dark:bg-zinc-950/40 rounded-[2.5rem] border-2 border-dashed border-border/60 text-center space-y-3">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <LayoutGrid className="h-8 w-8" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground">Select a Job Role</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
                                Choose a role from the sidebar to inspect, manage, or generate interview evaluation questions.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Questions({ 
    job_id, 
    deleteQuestion,
    onOpenAiModal,
    jobTitle, 
}: { 
    job_id: string | null, 
    deleteQuestion: (question_id: string) => void,
    onOpenAiModal: () => void,
    jobTitle?: string,
}) {
    const { data } = useSuspenseQuery(questionsQueryOptions(job_id!))
    const questions = data.questions || []
    return (
        <QuestionsContent 
            questions={questions} 
            deleteQuestion={deleteQuestion} 
            onOpenAiModal={onOpenAiModal}
            jobTitle={jobTitle} 
        />
    )
}

function AlertComponent({ 
    createAIQuestion, 
    questionCount, 
    setQuestionCount, 
    loading 
}: { 
    createAIQuestion: (e: React.MouseEvent<HTMLButtonElement>) => void, 
    questionCount: number, 
    setQuestionCount: (value: number) => void, 
    loading: boolean 
}) {
    const counts = [3, 5, 8, 10, 15]

    return (
        <AlertDialogContent className="rounded-3xl border-border/60 max-w-md bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl">
            <form>
                <AlertDialogHeader>
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2 text-indigo-600 dark:text-indigo-400">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <AlertDialogTitle className="text-xl font-black tracking-tight text-foreground">
                        AI Question Assistant
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        Our AI analyzes the job description and requirements to generate tailored, technical and behavioral interview questions.
                    </AlertDialogDescription>

                    <div className="pt-4 space-y-2 text-left">
                        <label className="text-xs font-bold text-foreground block">
                            Select quantity to draft:
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {counts.map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setQuestionCount(num)}
                                    className={cn(
                                        "h-10 rounded-xl font-bold text-xs transition-all border",
                                        questionCount === num
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                                            : "bg-muted/40 text-muted-foreground border-border/60 hover:border-indigo-500/40 hover:text-foreground"
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 gap-2 sm:gap-3">
                    <AlertDialogCancel className="rounded-xl h-10 border-border/60 font-semibold text-xs">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            type="submit"
                            className="rounded-xl h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs shadow-md shadow-indigo-500/20"
                            onClick={(e) => createAIQuestion(e)}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            <span>{loading ? "Drafting..." : `Draft ${questionCount} Questions`}</span>
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </form>
        </AlertDialogContent>
    );
}