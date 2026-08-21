import { useState, useMemo } from "react";
import { MessageSquarePlus, Trash2, HelpCircle, Copy, Check, Search, X, Sparkles, Eye, Download } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { JobQuestion } from "@/lib/types";
import { toast } from "sonner";
import { QuestionSimulatorDialog } from "./question-simulator-dialog";
import { exportToCSV } from "@/lib/export-utils";

export function QuestionsContent({
    questions,
    deleteQuestion,
    onOpenAiModal,
    jobTitle,
}: {
    questions: JobQuestion[],
    deleteQuestion: (question_id: string) => void,
    onOpenAiModal?: () => void,
    jobTitle?: string,
}) {
    const [searchQuery, setSearchQuery] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [simulatedQuestion, setSimulatedQuestion] = useState<string | null>(null)
    const [simulatorOpen, setSimulatorOpen] = useState(false)

    const filteredQuestions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return questions
        return questions.filter((item) => item.question?.toLowerCase().includes(q))
    }, [questions, searchQuery])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Question copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    }

    const handleOpenSimulator = (text: string) => {
        setSimulatedQuestion(text);
        setSimulatorOpen(true);
    };

    const handleExportCSV = () => {
        if (!questions.length) {
            toast.error("No questions in this bank to export");
            return;
        }
        const exportData = questions.map((q, idx) => ({
            "Question Number": idx + 1,
            "Question ID": q.id,
            "Position": jobTitle || "Target Role",
            "Question Text": q.question,
        }));
        exportToCSV(exportData, `question-bank-${jobTitle ? jobTitle.toLowerCase().replace(/\s+/g, '-') : 'export'}`);
        toast.success(`Exported ${exportData.length} questions to CSV`);
    };

    return (
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Questions Inner Toolbar */}
            {questions.length > 0 && (
                <div className="p-3 sm:p-4 border-b border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter questions in this bank..."
                            className="pl-9 pr-8 h-8.5 rounded-xl bg-background/80 border-border/60 text-xs focus:bg-background transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCSV}
                            className="h-8 px-2.5 rounded-lg text-xs font-bold gap-1 border-border/60"
                            title="Export Questions to CSV"
                        >
                            <Download className="h-3 w-3 text-indigo-500" />
                            <span>Export CSV</span>
                        </Button>
                        <span className="text-xs font-medium text-muted-foreground">
                            Showing <strong className="text-foreground">{filteredQuestions.length}</strong> of {questions.length}
                        </span>
                    </div>
                </div>
            )}

            <ScrollArea className="flex-1 h-full min-h-75">
                {filteredQuestions.length > 0 ? (
                    <div className="p-3 sm:p-6 space-y-3.5">
                        {filteredQuestions.map((q, idx) => (
                            <div
                                key={q.id || idx}
                                className="group relative flex items-start gap-3 sm:gap-4 p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-border/60 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-200"
                            >
                                <div className="flex-none pt-0.5">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <HelpCircle className="h-3 w-3 text-indigo-500 opacity-80" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                            Interview Evaluation
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm leading-relaxed text-foreground font-medium select-text">
                                        {q.question}
                                    </p>
                                </div>

                                <div className="flex-none flex items-center gap-1">
                                    <Button
                                        onClick={() => handleOpenSimulator(q.question)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 transition-all"
                                        title="Preview as Candidate"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        onClick={() => copyToClipboard(q.question, q.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                                        title="Copy question"
                                    >
                                        {copiedId === q.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button
                                        onClick={() => deleteQuestion(q.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all"
                                        title="Delete question"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : questions.length > 0 && searchQuery ? (
                    <div className="flex flex-col items-center justify-center min-h-62.5 p-8 text-center space-y-2">
                        <p className="text-sm font-semibold text-foreground">No questions match "{searchQuery}"</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchQuery("")}
                            className="h-8 rounded-xl text-xs"
                        >
                            Clear search
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-80 text-center p-6 sm:p-10 space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                            <MessageSquarePlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                            <h3 className="text-base font-bold text-foreground">No questions yet for this role</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Add interview questions manually using the input above, or use the AI Assistant to generate tailored questions.
                            </p>
                        </div>
                        {onOpenAiModal && (
                            <Button
                                onClick={onOpenAiModal}
                                className="h-9 px-4 rounded-xl text-xs font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Draft Questions with AI</span>
                            </Button>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Candidate Simulator Modal */}
            <QuestionSimulatorDialog
                questionText={simulatedQuestion || ""}
                jobName={jobTitle}
                open={simulatorOpen}
                onOpenChange={setSimulatorOpen}
            />
        </CardContent>
    );
}