

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createJob } from '@/lib/server-function';
import { jobPostSchema } from '@/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/jobs/add')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        defaultValues: {
            jobId: "",
            jobTitle: "",
            jobType: "fulltime" as "fulltime" | "parttime",
            locations: [] as string[],
            jobDescription: "",
            startDate: "",
            endDate: "",
        },
        validators: {
            onSubmit: jobPostSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    await createJob({ data: { jobId: value.jobId, jobTitle: value.jobTitle, jobType: value.jobType, locations: value.locations, jobDescription: value.jobDescription, startDate: value.startDate, endDate: value.endDate } });
                    toast.success("Job created successfully")
                    navigate({ to: "/dashboard/jobs" })
                } catch (error: any) {
                    toast.error(error.message)
                    console.log(error)
                }
            })
        },
    });


    return (
        <div className="flex justify-center p-4 md:p-10 dark:bg-slate-950 min-h-screen">
            <Card className="max-w-3xl w-full">
                <CardHeader>
                    <CardTitle>Create Job Post</CardTitle>
                    <CardDescription>Fill in the details to list a new opening.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup className="space-y-6">
                            {/* Job Id */}
                            <form.Field
                                name="jobId"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Job Id</FieldLabel>
                                            <Input
                                                id={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="e.g. DATA-ENGINEER-001"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />
                            {/* Job Title */}
                            <form.Field
                                name="jobTitle"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Job Title</FieldLabel>
                                            <Input
                                                id={field.name}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="e.g. Senior Systems Engineer"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    );
                                }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Job Type */}
                                <form.Field
                                    name="jobType"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>Job Type</FieldLabel>
                                            <Select
                                                value={field.state.value.toString()}
                                                onValueChange={(value: any) => field.handleChange(value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fulltime">Full-time</SelectItem>
                                                    <SelectItem value="parttime">Part-time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />

                                {/* Multi-Select Location Dropdown */}
                                <form.Field
                                    name="locations"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

                                        const selectedValues = new Set(field.state.value || []);

                                        const toggleLocation = (location: string) => {
                                            const nextValue = new Set(selectedValues);
                                            if (nextValue.has(location)) {
                                                nextValue.delete(location);
                                            } else {
                                                nextValue.add(location);
                                            }
                                            field.handleChange(Array.from(nextValue));
                                        };

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel>Work Locations (States)</FieldLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-between h-auto min-h-10 px-3 py-2"
                                                        >
                                                            <div className="flex flex-wrap gap-1">
                                                                {selectedValues.size > 0 ? (
                                                                    indianStates
                                                                        .filter(s => selectedValues.has(s))
                                                                        .map(s => (
                                                                            <Badge key={s} variant="secondary" className="font-normal">
                                                                                {s}
                                                                            </Badge>
                                                                        ))
                                                                ) : (
                                                                    <span className="text-muted-foreground">Select States</span>
                                                                )}
                                                            </div>
                                                            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Search states..." />
                                                            {/* IMPORTANT: CommandList MUST be here */}
                                                            <CommandList>
                                                                <CommandEmpty>No state found.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {indianStates.map((state) => (
                                                                        <CommandItem
                                                                            key={state}
                                                                            onSelect={() => toggleLocation(state)}
                                                                        >
                                                                            {state}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                            </Field>
                                        );
                                    }}
                                />
                            </div>

                            {/* Job Description */}
                            <form.Field
                                name="jobDescription"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Job Description</FieldLabel>
                                            <Textarea
                                                id={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="Describe responsibilities and requirements..."
                                                className="min-h-[120px]"
                                            />
                                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                        </Field>
                                    )
                                }}
                            />

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <form.Field
                                    name="startDate"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>Start Date</FieldLabel>
                                            <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                        </Field>
                                    )}
                                />
                                <form.Field
                                    name="endDate"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>End Date</FieldLabel>
                                            <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                        </Field>
                                    )}
                                />
                            </div>

                            <Button disabled={isPending} type="submit" className="w-full">{isPending ? "Creating Job..." : "Post Job"}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
