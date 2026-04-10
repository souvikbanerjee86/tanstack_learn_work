import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createJob, getJobDescription } from '@/lib/server-function';
import { indianStates } from '@/lib/types';
import { jobPostSchema } from '@/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ChevronDown, Loader2, Sparkles, Briefcase, MapPin, Calendar, FileText, ChevronLeft, Zap } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/dashboard/jobs/add')({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()
    const [isGenerating, startGenerating] = useTransition()
    const experienceYears = Array.from({ length: 31 }, (_, i) => i.toString());
    const form = useForm({
        defaultValues: {
            jobId: "",
            jobTitle: "",
            jobType: "fulltime" as "fulltime" | "parttime",
            locations: [] as string[],
            jobDescription: "",
            startDate: "",
            endDate: "",
            experience: 0,
        },
        validators: {
            onSubmit: jobPostSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    await createJob({ data: { jobId: value.jobId, jobTitle: value.jobTitle, jobType: value.jobType, locations: value.locations, jobDescription: value.jobDescription, startDate: value.startDate, endDate: value.endDate, experience: value.experience } });
                    toast.success("Job created successfully")
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
            startGenerating(async () => {
                try {
                    const jobDescription = await getJobDescription({ data: { job_title: jobTitle, experience: experience } })
                    form.setFieldValue("jobDescription", jobDescription)
                    toast.success("AI Description Generated")
                } catch (error: any) {
                    toast.error(error.message)
                    console.log(error)
                }
            })
        } else {
            toast.error("Please fill in the job title and experience")
        }
    }


    return (
        <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-16 transition-colors pb-32 relative overflow-hidden">
            {/* --- Subtle Background Pattern --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/8 dark:bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-500/3 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* --- Page Header / Nav --- */}
                <div className="flex flex-col gap-8 pb-4 border-b border-muted-foreground/10 relative">
                    <Link
                        to="/dashboard/jobs"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group w-fit"
                    >
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Back to Pipeline
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-xl relative overflow-hidden group/icon">
                                <Briefcase className="h-9 w-9 text-primary shrink-0 relative z-10 transition-transform group-hover/icon:scale-110 duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter">Post Opening</h1>
                                <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5 mt-2 opacity-80 uppercase tracking-widest">
                                    <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                    Launch high-intelligence campaign
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="h-7 px-4 rounded-full border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                            New Deployment
                        </Badge>
                    </div>
                </div>

                {/* --- Form Card Container --- */}
                <div className="bg-card border border-border rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 p-8 md:p-12 transition-colors">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-14"
                    >
                        <FieldGroup className="space-y-14">

                            {/* --- Section: Core Information --- */}
                            <section>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Job Essentials</h2>
                                            <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Define the core identification for this position.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <form.Field
                                            name="jobId"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">System Identity (Ref)</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. CORE-ARCH-01"
                                                            className="h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                );
                                            }}
                                        />

                                        <form.Field
                                            name="jobTitle"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Professional Title</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. Lead Backend Engineer"
                                                            className="h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Location & Type --- */}
                            <section>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Logistics & Compliance</h2>
                                            <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Where and how will this talent operate?</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <form.Field
                                            name="jobType"
                                            children={(field) => (
                                                <Field className="space-y-3">
                                                    <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Employment Logic</FieldLabel>
                                                    <Select
                                                        value={field.state.value.toString()}
                                                        onValueChange={(value: any) => field.handleChange(value)}
                                                    >
                                                        <SelectTrigger className="!h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm">
                                                            <SelectValue placeholder="Contract Mode..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-muted-foreground/10 shadow-2xl">
                                                            <SelectItem value="fulltime" className="rounded-xl">Standard Full-time</SelectItem>
                                                            <SelectItem value="parttime" className="rounded-xl">Flexible Part-time</SelectItem>
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
                                                    if (nextValue.has(location)) nextValue.delete(location);
                                                    else nextValue.add(location);
                                                    field.handleChange(Array.from(nextValue));
                                                };

                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Active Hubs (Locations)</FieldLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-between h-auto min-h-14 px-5 py-3 rounded-2xl bg-card border-muted-foreground/10 hover:bg-muted/30 transition-all shadow-sm"
                                                                >
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedValues.size > 0 ? (
                                                                            indianStates
                                                                                .filter(s => selectedValues.has(s))
                                                                                .map(s => (
                                                                                    <Badge key={s} variant="secondary" className="font-bold text-[10px] uppercase tracking-tighter bg-primary/10 text-primary border-primary/10 px-2 h-5">
                                                                                        {s}
                                                                                    </Badge>
                                                                                ))
                                                                        ) : (
                                                                            <span className="text-muted-foreground text-sm opacity-40 italic font-medium">Identify target regions...</span>
                                                                        )}
                                                                    </div>
                                                                    <ChevronDown className="h-4 w-4 opacity-30 shrink-0 ml-4" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-1 rounded-3xl overflow-hidden shadow-2xl border-muted-foreground/10 backdrop-blur-xl bg-card/90">
                                                                <Command className="bg-transparent">
                                                                    <CommandInput placeholder="Discovery Search..." className="h-12 border-none bg-muted/50" />
                                                                    <CommandList className="max-h-[300px] p-1">
                                                                        <CommandEmpty className="p-6 text-center text-xs text-muted-foreground font-semibold">No sectors identified.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {indianStates.map((state) => (
                                                                                <CommandItem
                                                                                    key={state}
                                                                                    onSelect={() => toggleLocation(state)}
                                                                                    className="rounded-xl h-10 text-xs font-bold transition-all data-[selected=true]:bg-primary/5 cursor-pointer"
                                                                                >
                                                                                    <div className={cn(
                                                                                        "h-3.5 w-3.5 rounded-full mr-3 border-2 transition-all duration-300",
                                                                                        selectedValues.has(state) ? "bg-primary border-primary scale-110 shadow-[0_0_12px_hsl(var(--primary))]" : "border-muted-foreground/20"
                                                                                    )} />
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
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Analysis & Requirements --- */}
                            <section>
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                                <Sparkles className="h-5 w-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">Intelligence Parameters</h2>
                                                <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Synthesize the expectations for this campaign.</p>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={(e) => getAddedJobDescription(e)}
                                            disabled={isGenerating}
                                            variant="secondary"
                                            className="h-12 px-6 rounded-2xl gap-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/5 transition-all hover:scale-[1.02] active:scale-95 bg-muted border border-border"
                                        >
                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />}
                                            {isGenerating ? "Synthesizing AI Grid..." : "Generate Description"}
                                        </Button>
                                    </div>

                                    <form.Field
                                        name="jobDescription"
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                            return (
                                                <Field data-invalid={isInvalid} className="space-y-3">
                                                    <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Analytical Scope (JD)</FieldLabel>
                                                    <div className="relative">
                                                        <Textarea
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="Define mission objectives and technical spectrum..."
                                                            className="min-h-[200px] rounded-[2rem] bg-card border-muted-foreground/10 focus:ring-primary/20 focus:border-primary/30 p-6 leading-relaxed text-sm font-medium shadow-sm transition-all"
                                                        />
                                                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary/20 animate-pulse" />
                                                    </div>
                                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                </Field>
                                            )
                                        }}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                        <form.Field
                                            name="experience"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Expertise Depth</FieldLabel>
                                                        <Select
                                                            value={field.state.value.toString()}
                                                            onValueChange={(value) => field.handleChange(Number(value))}
                                                        >
                                                            <SelectTrigger className="!h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm">
                                                                <SelectValue placeholder="Years Threshold..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-muted-foreground/10 shadow-2xl max-h-[250px] overflow-y-auto">
                                                                {experienceYears.map((year) => (
                                                                    <SelectItem key={year} value={year} className="rounded-xl">
                                                                        {year} {year === "1" ? "Strategic Year" : "Years"}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                );
                                            }}
                                        />

                                        <form.Field
                                            name="startDate"
                                            children={(field) => (
                                                <Field className="space-y-3">
                                                    <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Deployment Start</FieldLabel>
                                                    <div className="relative group/input">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 transition-opacity group-focus-within/input:opacity-100 pointer-events-none" />
                                                        <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-14 pl-12 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm" />
                                                    </div>
                                                </Field>
                                            )}
                                        />
                                        <form.Field
                                            name="endDate"
                                            children={(field) => (
                                                <Field className="space-y-3">
                                                    <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Deployment Termination</FieldLabel>
                                                    <div className="relative group/input">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 transition-opacity group-focus-within/input:opacity-100 pointer-events-none" />
                                                        <Input type="date" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} className="h-14 pl-12 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm" />
                                                    </div>
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>
                        </FieldGroup>

                        {/* --- Action Footer --- */}
                        <div className="pt-8 flex items-center justify-end gap-6 border-t border-border">
                            <Link to="/dashboard/jobs" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-4">
                                Cancel
                            </Link>
                            <Button
                                disabled={isPending}
                                type="submit"
                                className="h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span className="text-xs font-black uppercase tracking-widest">{isPending ? "Creating..." : "Publish Job"}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
