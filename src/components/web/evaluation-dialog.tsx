
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "@tanstack/react-form";
import { evaluationSchema } from "@/schemas/evaluate";

export function EvaluationDialog({ confirmEvaluation }: { confirmEvaluation: (data: { verdict: string, feedback: string }) => void }) {

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Evaluate</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                {/* Move the form here */}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <DialogHeader>
                        <DialogTitle>Submit Evaluation</DialogTitle>
                        <DialogDescription>
                            Make changes to your Evaluation.Once Done Click Save Changes.
                        </DialogDescription>
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
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select Verdict" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select Verdict</SelectLabel>

                                                        <SelectItem value="ACCEPT">Accept</SelectItem>
                                                        <SelectItem value="REJECT">Reject</SelectItem>

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
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Feedback</FieldLabel>
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                placeholder="Add Your Feedback"
                                                autoComplete="off"
                                                className="min-h-[100px] max-h-[300px] overflow-y-auto"

                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }}
                            />
                        </div>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}