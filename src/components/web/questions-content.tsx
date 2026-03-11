import { MessageSquarePlus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { JobQuestion } from "@/lib/types";

export function QuestionsContent({ questions, deleteQuestion }: { questions: JobQuestion[], deleteQuestion: (question_id: string) => void }) {
    return <CardContent className="p-0 flex-1 overflow-hidden">

        <ScrollArea className="h-full max-h-[60vh] md:max-h-none">
            {
                questions.length > 0 ? (
                    <div className="divide-y divide-muted/50">
                        {questions.map((q, idx) => (
                            <div key={idx} className="group flex items-start justify-between p-4 hover:bg-muted/20 transition-colors">
                                <div className="flex gap-4">
                                    <span className="text-muted-foreground font-mono text-xs pt-1">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <p className="text-sm leading-relaxed">{q.question}</p>
                                </div>
                                <Button
                                    onClick={() => deleteQuestion(q.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) :
                    (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <MessageSquarePlus className="h-12 w-12 mb-4 opacity-20" />
                            <p>No questions added for this role yet.</p>
                        </div>
                    )}
        </ScrollArea>
    </CardContent>
}