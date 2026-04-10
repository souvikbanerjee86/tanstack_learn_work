
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "@tanstack/react-form";
import { evaluationSchema } from "@/schemas/evaluate";
import { CheckCircle2, ClipboardCheck, Loader2, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";

interface EvaluationDialogProps {
    confirmEvaluation: (data: { verdict: string, feedback: string }) => void;
    isPending: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    evaluation: string;
}

export function EvaluationDialog({ confirmEvaluation, isPending, open, setOpen, evaluation }: EvaluationDialogProps) {
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
            {evaluation == "EVALUATED" ? <Badge variant={"default"} >Evaluated</Badge> : <DialogTrigger asChild>
                <Button variant="default">Evaluate</Button>
            </DialogTrigger>}

            <DialogContent className="sm:max-w-md border-none bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10 dark:ring-white/5">
                {/* Move the form here */}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <DialogHeader className="relative -mx-6 -mt-6 p-6 mb-4 bg-linear-to-br from-primary/10 via-background to-background border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm">
                                <ClipboardCheck className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5 text-left">
                                <DialogTitle className="text-xl font-semibold tracking-tight">Submit Evaluation</DialogTitle>
                                <DialogDescription className="text-sm font-medium opacity-70">
                                    Finalize your assessment for this candidate.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <FieldGroup>
                        <div className="grid gap-6 py-4">
                            <form.Field
                                name="verdict"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Verdict</FieldLabel>
                                            <Select
                                                value={field.state.value.toString()}
                                                onValueChange={(value) => {
                                                    field.handleChange((value))
                                                }}
                                            >
                                                <SelectTrigger className="w-full bg-background/50 hover:bg-accent/50 transition-colors border-border/50">
                                                    <SelectValue placeholder="Select Verdict" />
                                                </SelectTrigger>
                                                <SelectContent className="backdrop-blur-lg bg-background/95 border-border/50">
                                                    <SelectGroup>
                                                        <SelectLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                                            Select Verdict
                                                        </SelectLabel>
                                                        <SelectItem value="ACCEPT" className="focus:bg-green-500/10 focus:text-green-600 dark:focus:text-green-400">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                <span className="font-medium">Accept</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="REJECT" className="focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                                <span className="font-medium">Reject</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />
                            <form.Field
                                name="feedback"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid} className="space-y-2.5">
                                            <FieldLabel htmlFor={field.name} className="text-sm font-semibold text-muted-foreground/80 ml-0.5 transition-colors group-data-[invalid=true]/field:text-destructive">
                                                Feedback
                                            </FieldLabel>
                                            <div className="relative group/textarea">
                                                <Textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="Add your detailed feedback here..."
                                                    autoComplete="off"
                                                    className="min-h-[140px] max-h-[300px] bg-background/50 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all resize-none p-4 rounded-xl shadow-inner-sm"
                                                />
                                                <div className="absolute bottom-3 right-3 opacity-0 group-focus-within/textarea:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                                                        {field.state.value.length} characters
                                                    </span>
                                                </div>
                                            </div>
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} className="mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200" />
                                            )}
                                        </Field>
                                    )
                                }}
                            />
                        </div>
                    </FieldGroup>

                    <DialogFooter className="pt-2 gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" className="hover:bg-accent/50 text-muted-foreground hover:text-foreground">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="min-w-[120px] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Submit Verdict
                                    <ClipboardCheck className="h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}