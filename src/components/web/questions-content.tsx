import { MessageSquarePlus, Trash2, HelpCircle, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { JobQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuestionsContent({ questions, deleteQuestion }: { questions: JobQuestion[], deleteQuestion: (question_id: string) => void }) {
    return (
        <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
                {questions.length > 0 ? (
                    <div className="p-3 md:p-6 space-y-4">
                        {questions.map((q, idx) => (
                            <div 
                                key={q.id || idx} 
                                className="group relative flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-[1.5rem] md:rounded-2xl bg-card border border-muted/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex-none pt-1">
                                    <div className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 rounded-full bg-muted/50 text-muted-foreground font-mono text-[10px] border border-transparent group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                         <HelpCircle className="h-3 w-3 text-indigo-500 opacity-60" />
                                         <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500/70">Question</span>
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-foreground/90 font-medium">
                                        {q.question}
                                    </p>
                                </div>
                                <div className="flex-none flex items-center gap-1 self-center md:self-start">
                                    <Button
                                        onClick={() => deleteQuestion(q.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-muted-foreground md:opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="h-8 w-px bg-muted mx-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-muted-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-30 hover:opacity-100 transition-all hidden sm:flex"
                                    >
                                        <GripVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center p-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative bg-card border-2 border-dashed border-muted rounded-full p-8">
                                <MessageSquarePlus className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/40" />
                            </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-2">No questions yet</h3>
                        <p className="text-muted-foreground max-w-[280px] text-xs md:text-sm leading-relaxed">
                            Create your first interview question manually or use AI to generate a set of professional questions.
                        </p>
                        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                            <div className="h-px w-8 bg-muted" />
                            Smart Suggestions Available
                            <div className="h-px w-8 bg-muted" />
                        </div>
                    </div>
                )}
            </ScrollArea>
        </CardContent>
    );
}