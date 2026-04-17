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
import { createFileRoute, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Briefcase, Calendar, ChevronDown, ChevronLeft, Files, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/jobs/$id/edit')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
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
            status: (jobInfo?.status as "Active" | "Inactive") || "Active",
        },
        validators: {
            onSubmit: jobPostSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    await editJob({ data: { id: jobInfo.id, jobId: value.jobId, jobTitle: value.jobTitle, jobType: value.jobType, locations: value.locations, jobDescription: value.jobDescription, startDate: value.startDate, endDate: value.endDate, experience: value.experience, status: value.status } });
                    toast.success("Job updated successfully")
                    queryClient.invalidateQueries({ queryKey: ['jobs'] })
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
        <div className="relative min-h-screen w-full bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30 overflow-hidden p-4 md:p-10 lg:p-14 pb-20">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-start">
                    <Link to='/dashboard/jobs'>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group gap-2 px-4 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-900/50 backdrop-blur-sm rounded-full transition-all"
                        >
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span className="font-semibold tracking-tight">Return to Jobs</span>
                        </Button>
                    </Link>
                </div>

                <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 dark:shadow-none sm:rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                    <CardHeader className="relative p-8 sm:p-12 mb-6 bg-linear-to-br from-indigo-50/50 via-transparent to-transparent dark:from-indigo-900/10 dark:via-transparent dark:to-transparent border-b border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3.5 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/20 text-white">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                                    Edit Job Post
                                </CardTitle>
                                <CardDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
                                    Refine the listing details for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{jobInfo?.job_title}</span>
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 sm:p-12 pt-0">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-12"
                        >
                            <FieldGroup className="space-y-12">
                                {/* Section 1: Role Essentials */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            <Briefcase className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase text-[11px] opacity-70">Role Essentials</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <form.Field
                                            name="jobId"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-2.5">
                                                        <FieldLabel htmlFor={field.name} className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Reference ID</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. DATA-ENGINEER-001"
                                                            className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl focus:ring-indigo-500/20"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} className="animate-in fade-in slide-in-from-top-1 duration-200" />}
                                                    </Field>
                                                );
                                            }}
                                        />
                                        <form.Field
                                            name="jobTitle"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-2.5">
                                                        <FieldLabel htmlFor={field.name} className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Job Designation</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. Senior Systems Engineer"
                                                            className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl focus:ring-indigo-500/20"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} className="animate-in fade-in slide-in-from-top-1 duration-200" />}
                                                    </Field>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Logistics & Experience */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[11px] opacity-70">Logistics & Experience</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <form.Field
                                            name="jobType"
                                            children={(field) => (
                                                <Field className="space-y-2.5">
                                                    <FieldLabel className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Employment Type</FieldLabel>
                                                    <Select
                                                        value={field.state.value?.toString() || ""}
                                                        onValueChange={(value: any) => field.handleChange(value)}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-800">
                                                            <SelectItem value="fulltime">Full-time</SelectItem>
                                                            <SelectItem value="parttime">Part-time</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        />

                                        <form.Field
                                            name="status"
                                            children={(field) => (
                                                <Field className="space-y-2.5">
                                                    <FieldLabel className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Deployment Status</FieldLabel>
                                                    <Select
                                                        value={field.state.value?.toString() || ""}
                                                        onValueChange={(value: any) => field.handleChange(value)}
                                                    >
                                                        <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-800">
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        />

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
                                                    <Field data-invalid={isInvalid} className="space-y-2.5">
                                                        <FieldLabel className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Target Regions (States)</FieldLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-between h-auto min-h-12 px-4 py-2 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl hover:bg-white/80 dark:hover:bg-slate-950/80 transition-all"
                                                                >
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {selectedValues.size > 0 ? (
                                                                            indianStates
                                                                                .filter(s => selectedValues.has(s))
                                                                                .map(s => (
                                                                                    <Badge key={s} variant="secondary" className="font-bold text-[10px] uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 ring-1 ring-indigo-200/50 dark:ring-indigo-800/50">
                                                                                        {s}
                                                                                    </Badge>
                                                                                ))
                                                                        ) : (
                                                                            <span className="text-slate-400 font-medium italic">Select hiring states</span>
                                                                        )}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-slate-200/60 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-slate-900/95">
                                                                <Command>
                                                                    <CommandInput placeholder="Search states..." className="h-12 border-none ring-0" />
                                                                    <CommandList className="max-h-[300px]">
                                                                        <CommandEmpty>No state found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {indianStates.map((state) => (
                                                                                <CommandItem
                                                                                    key={state}
                                                                                    onSelect={() => toggleLocation(state)}
                                                                                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                                                                >
                                                                                    <span className={cn("text-sm font-medium", selectedValues.has(state) && "text-indigo-600 dark:text-indigo-400 font-bold")}>{state}</span>
                                                                                    {selectedValues.has(state) && <Sparkles className="h-3 text-indigo-500" />}
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
                                </div>

                                {/* Section 3: Content & Requirements */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                <Files className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase text-[11px] opacity-70">Job Description</h3>
                                        </div>

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => getAddedJobDescription(e)}
                                            disabled={isGenerating}
                                            className="h-9 px-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 shadow-sm transition-all text-xs font-bold gap-2"
                                        >
                                            {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                                            AI Compose
                                        </Button>
                                    </div>

                                    <form.Field
                                        name="jobDescription"
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                            return (
                                                <Field data-invalid={isInvalid} className="relative group/textarea">
                                                    <Textarea
                                                        id={field.name}
                                                        value={field.state.value}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        placeholder="Describe responsibilities and requirements..."
                                                        className="min-h-[220px] bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 text-[15px] focus:ring-indigo-500/20 leading-relaxed shadow-inner-sm transition-all"
                                                    />
                                                    <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-focus-within/textarea:opacity-100 transition-opacity">
                                                        {field.state.value.length} chars
                                                    </div>
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} className="mt-2" />}
                                                </Field>
                                            )
                                        }}
                                    />
                                </div>

                                {/* Section 4: Timeline */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase text-[11px] opacity-70">Timeline & Tenure</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <form.Field
                                            name="startDate"
                                            children={(field) => (
                                                <Field className="space-y-2.5">
                                                    <FieldLabel className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Listing Start</FieldLabel>
                                                    <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl" />
                                                </Field>
                                            )}
                                        />
                                        <form.Field
                                            name="endDate"
                                            children={(field) => (
                                                <Field className="space-y-2.5">
                                                    <FieldLabel className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Listing Expiry</FieldLabel>
                                                    <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl" />
                                                </Field>
                                            )}
                                        />
                                        <form.Field
                                            name="experience"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-2.5">
                                                        <FieldLabel htmlFor={field.name} className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Experience Level</FieldLabel>
                                                        <Select
                                                            value={field.state.value?.toString() || "0"}
                                                            onValueChange={(value) => field.handleChange(Number(value))}
                                                        >
                                                            <SelectTrigger className="h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800 rounded-xl">
                                                                <SelectValue placeholder="Experience" />
                                                            </SelectTrigger>
                                                            <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-800">
                                                                <SelectGroup>
                                                                    <SelectLabel className="text-xs uppercase tracking-widest font-bold opacity-70">Years of Experience</SelectLabel>
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
                                </div>
                            </FieldGroup>

                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50">
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                    className="w-full h-14 text-base font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 text-white transition-all active:scale-[0.98]"
                                >
                                    {isPending ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Synchronizing Updates...
                                        </span>
                                    ) : "Save Listing Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
