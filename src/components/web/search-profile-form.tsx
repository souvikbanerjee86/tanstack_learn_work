import { PlusCircle, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useForm } from "@tanstack/react-form";
import { profileSearchSchema } from "@/schemas/profile-search";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { useState } from "react";
import { ProfileSearchCritieria } from "@/lib/types";

interface ChildProps {
    onProfileSearchSubmit: (data: ProfileSearchCritieria) => void;
}

export function SearchProfileForm({ onProfileSearchSubmit }: ChildProps) {
    const [open, setOpen] = useState(false);
    const experienceYears = Array.from({ length: 31 }, (_, i) => i.toString());
    const thresholds = Array.from({ length: 9 }, (_, i) => (40 + i * 5).toString());

    const form = useForm({
        defaultValues: {
            jobDescription: "",
            preferedDomain: "",
            skills: "",
            experience: 0
        },
        validators: {
            onSubmit: profileSearchSchema,
        },
        onSubmit: async ({ value }) => {
            onProfileSearchSubmit(value as ProfileSearchCritieria)
            setOpen(false)

        },
    })

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Search Matching Profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Job Matching Criteria
                        </DialogTitle>
                    </DialogHeader>
                    <>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}>
                            <FieldGroup>
                                <div className="grid gap-6 py-4">

                                    <form.Field
                                        name="jobDescription"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Job Description</FieldLabel>
                                                    <Textarea
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="Add Job Description"
                                                        autoComplete="off"
                                                        className="min-h-[100px]"
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />

                                    <form.Field
                                        name="preferedDomain"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Prefered Domain</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="e.g. Fintech, E-commerce, Healthcare"
                                                        autoComplete="off"
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />

                                    <form.Field
                                        name="skills"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Required Skills (comma separated)</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="React, TypeScript, Node.js"
                                                        autoComplete="off"
                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Experience Dropdown */}
                                        <div className="grid gap-2">
                                            <form.Field
                                                name="experience"
                                                children={(field) => {
                                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                    return (
                                                        <Field data-invalid={isInvalid}>
                                                            <FieldLabel htmlFor={field.name}>Experience</FieldLabel>
                                                            <Select
                                                                value={field.state.value.toString()}
                                                                onValueChange={(value) => field.handleChange(Number(value))}
                                                            >
                                                                <SelectTrigger className="w-full max-w-48">
                                                                    <SelectValue placeholder="Select Years" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>Years of Experience</SelectLabel>
                                                                        {experienceYears.map((year) => (
                                                                            <SelectItem key={year} value={year}>
                                                                                {year} {year === "1" ? "Year" : "Years"}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                        </Field>
                                                    );
                                                }}
                                            />

                                        </div>

                                        {/* Threshold Dropdown */}
                                        <div className="grid gap-2">
                                            <Label>Matching Threshold</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select %" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {thresholds.map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {t}% Match
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="submit" className="w-full">Search Profile</Button>
                                </DialogFooter>
                            </FieldGroup>
                        </form>
                    </>
                </DialogContent>
            </Dialog>

        </>
    )
}