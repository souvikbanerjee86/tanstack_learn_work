import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { editJob, getJobDescription } from '@/lib/server-function';
import { indianStates } from '@/lib/types';
import { jobPostSchema } from '@/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard/jobs/$id/edit')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const jobInfo = (location.state as any) || {};
    const locationInfo = jobInfo?.location ? jobInfo.location.split(", ") : []
    const navigate = useNavigate()

    const [isPending, startTransition] = useTransition()
    const [isGenerating, startGenerating] = useTransition()
    const experienceYears = Array.from({ length: 31 }, (_, i) => i.toString());
    const form = useForm({
        defaultValues: {
            jobId: jobInfo?.job_id || "",
            jobTitle: jobInfo?.job_title || "",
            jobType: (jobInfo?.job_type as "fulltime" | "parttime") || "fulltime",
            locations: locationInfo as string[],
            jobDescription: jobInfo?.job_description || "",
            startDate: jobInfo?.start_date || "",
            endDate: jobInfo?.end_date || "",
            experience: jobInfo?.experience || 0,
        },
        validators: {
            onSubmit: jobPostSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    await editJob({ data: { id: jobInfo.id, jobId: value.jobId, jobTitle: value.jobTitle, jobType: value.jobType, locations: value.locations, jobDescription: value.jobDescription, startDate: value.startDate, endDate: value.endDate, experience: value.experience } });
                    toast.success("Job updated successfully")
                    navigate({ to: "/dashboard/jobs" })
                } catch (error: any) {
                    toast.error(error.message)
                    console.log(error)
                }
            })
        },
    });


    const getAddedJobDescription = async (e: any) => {
        e.preventDefault();
        const jobTitle = form.getFieldValue("jobTitle")
        const experience = form.getFieldValue("experience")
        if (jobTitle && experience) {
            try {
                startGenerating(async () => {
                    const jobDescription = await getJobDescription({ data: { job_title: jobTitle, experience: experience } })
                    form.setFieldValue("jobDescription", jobDescription)
                })
            } catch (e) {
                toast.error("Something went wrong")
            }

        } else {
            toast.error("Please fill in the job title and experience")
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-start">
                <Link to='/dashboard/jobs'>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 pl-2 text-muted-foreground hover:text-foreground"

                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Jobs
                    </Button>
                </Link>
            </div>
            <Card className="max-w-3xl w-full">
                <CardHeader>
                    <CardTitle>Edit Job Post</CardTitle>
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
                                                value={field.state.value?.toString() || ""}
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
                            <div className='flex flex-row items-end justify-end'>
                                <div></div>
                                <div>

                                    <Button onClick={(e) => getAddedJobDescription(e)} disabled={isGenerating}>
                                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        Generate Job Description</Button>

                                </div>
                            </div>

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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


                                <form.Field
                                    name="experience"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Experience</FieldLabel>
                                                <Select
                                                    value={field.state.value?.toString() || "0"}
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

                            <Button disabled={isPending} type="submit" className="w-full">{isPending ? "Updating Job..." : "Edit Job"}</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}