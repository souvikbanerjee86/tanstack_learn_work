import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "@tanstack/react-form";
import { evaluationSchema } from "@/schemas/evaluate";
import { CheckCircle2, ClipboardCheck, Loader2, XCircle, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

interface EvaluationDialogProps {
    confirmEvaluation: (data: { verdict: string, feedback: string }) => void;
    isPending: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    evaluation: string;
}

export function EvaluationDialog({ confirmEvaluation, isPending, open, setOpen, evaluation }: EvaluationDialogProps) {
    const isEvaluated = evaluation === "EVALUATED"

    const form = useForm({
        defaultValues: {
            verdict: "",
            feedback: "",
        },
        validators: {
            onSubmit: evaluationSchema,
        },
        onSubmit: async ({ value }) => {
            await confirmEvaluation(value)
        },
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {isEvaluated ? (
                <Badge variant="outline" className="h-10 px-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold text-xs gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Evaluated</span>
                </Badge>
            ) : (
                <DialogTrigger asChild>
                    <Button className="h-10 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95">
                        <ClipboardCheck className="h-4 w-4" />
                        <span>Submit Verdict</span>
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-lg border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 overflow-hidden">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <DialogHeader className="p-6 pb-4 bg-muted/20 border-b border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5 text-left">
                                <DialogTitle className="text-lg font-black tracking-tight text-foreground">
                                    Candidate Hiring Verdict
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground font-medium">
                                    Record your definitive recruitment decision and structured feedback.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <FieldGroup className="p-6 space-y-5">
                        <form.Field
                            name="verdict"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                return (
                                    <Field data-invalid={isInvalid} className="space-y-2">
                                        <FieldLabel className="text-xs font-bold text-foreground">
                                            Recruitment Decision
                                        </FieldLabel>
                                        <Select
                                            value={field.state.value}
                                            onValueChange={(value) => field.handleChange(value)}
                                        >
                                            <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/60 focus:ring-indigo-500/20">
                                                <SelectValue placeholder="Select verdict decision" />
                                            </SelectTrigger>
                                            <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border-border/60 rounded-xl">
                                                <SelectGroup>
                                                    <SelectLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                                        Verdict Options
                                                    </SelectLabel>
                                                    <SelectItem value="ACCEPT" className="rounded-lg focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                            <span className="font-bold text-xs">ACCEPT Candidate</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="REJECT" className="rounded-lg focus:bg-rose-500/10 focus:text-rose-600 dark:focus:text-rose-400">
                                                        <div className="flex items-center gap-2">
                                                            <XCircle className="h-4 w-4 text-rose-500" />
                                                            <span className="font-bold text-xs">REJECT Candidate</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {isInvalid && <FieldError errors={field.state.meta.errors} className="text-xs font-semibold text-rose-500" />}
                                    </Field>
                                );
                            }}
                        />

                        <form.Field
                            name="feedback"
                            children={(field) => {
                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                return (
                                    <Field data-invalid={isInvalid} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <FieldLabel className="text-xs font-bold text-foreground">
                                                Evaluation Notes & Justification
                                            </FieldLabel>
                                            <span className="text-[10px] font-medium text-muted-foreground font-mono">
                                                {field.state.value.length}/50 min chars
                                            </span>
                                        </div>
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Provide constructive assessment reasoning, core competencies verified, and next steps..."
                                            className="min-h-[120px] max-h-[250px] rounded-xl bg-muted/30 border-border/60 focus-visible:ring-indigo-500/20 text-xs leading-relaxed p-3.5"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} className="text-xs font-semibold text-rose-500" />}
                                    </Field>
                                );
                            }}
                        />
                    </FieldGroup>

                    <DialogFooter className="p-6 pt-2 pb-6 flex items-center justify-end gap-3 border-t border-border/40 bg-muted/10">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="h-10 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-10 px-6 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Confirm Decision</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}