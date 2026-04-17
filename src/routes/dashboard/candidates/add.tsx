import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, FileUp, ImageIcon, Loader2, Send, Trash2, Zap, Users, Sparkles, FileText } from 'lucide-react'
import { ChangeEvent, useState, useTransition, Suspense } from 'react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { addCandidate, getJobDetails } from '@/lib/server-function'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from '@tanstack/react-form'
import { candidateAddSchema } from '@/schemas/profile-search'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { CandidateAddSkeleton } from '@/components/web/candidate-add-skeleton'

export const jobsQueryOptions = queryOptions({
    queryKey: ['jobs'],
    queryFn: () => getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
})

export const Route = createFileRoute('/dashboard/candidates/add')({
    loader: ({ context }) => {
        void context.queryClient.prefetchQuery(jobsQueryOptions)
    },
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <Suspense fallback={<CandidateAddSkeleton />}>
            <CandidateAddContent />
        </Suspense>
    )
}

function CandidateAddContent() {
    const { data } = useSuspenseQuery(jobsQueryOptions)
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()
    const jobDetails = data
    const [imgBase64, setImgBase64] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const form = useForm({
        defaultValues: {
            jobId: "",
            jobName: "",
            candidateName: "",
            candidateEmail: "",
            candidateCv: null as File | null
        },
        validators: {
            onSubmit: candidateAddSchema,
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData();
            if (value.candidateCv) {
                formData.append('file', value.candidateCv);
            }
            formData.append('job_id', value.jobId);
            formData.append('job_name', value.jobName);
            formData.append('candidate_name', value.candidateName);
            formData.append('candidate_email', value.candidateEmail);
            if (imgBase64)
                formData.append('candidate_image', imgBase64)

            setIsUploading(true)
            startTransition(async () => {
                try {
                    await addCandidate({ data: formData })
                    toast.success("Candidate Added Successfully")
                    navigate({ to: '/dashboard/candidates' })
                } catch (e) {
                    console.log(e)
                    toast.error("Something went wrong")
                } finally {
                    setIsUploading(false)
                }
            })
        },
    })

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImgBase64(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-16 transition-colors pb-32 relative overflow-hidden">
            {/* --- Subtle Background Pattern --- */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff06_1px,transparent_1px)] bg-size-[24px_24px]" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/8 dark:bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-500/3 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* --- Page Header / Nav --- */}
                <div className="flex flex-col gap-8 pb-4 border-b border-muted-foreground/10 relative">
                    <Link
                        to="/dashboard/candidates"
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group w-fit"
                    >
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Back to Pipeline
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-[2rem] bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-xl relative overflow-hidden group/icon">
                                <Users className="h-9 w-9 text-primary shrink-0 relative z-10 transition-transform group-hover/icon:scale-110 duration-500" />
                                <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter">Onboard Talent</h1>
                                <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5 mt-2 opacity-80 uppercase tracking-widest">
                                    <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                    Add new candidate to intelligent pipeline
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline" className="h-7 px-4 rounded-full border-primary/20 text-primary bg-primary/5 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                            New Profile
                        </Badge>
                    </div>
                </div>

                {/* --- Form Card Container --- */}
                <div className="bg-card border border-border rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 p-8 md:p-12 transition-colors">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }} className="space-y-14">
                        <FieldGroup className="space-y-14">

                            {/* --- Section: Application Link --- */}
                            <section>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Assignment Essentials</h2>
                                            <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Link candidate to an active job opening.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <form.Field
                                            name="jobId"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Target Position</FieldLabel>
                                                        <Select
                                                            value={field.state.value.toString()}
                                                            onValueChange={(value) => {
                                                                field.handleChange((value))
                                                                const jobName = jobDetails.data.find((job) => job.job_id === value)?.job_title as string
                                                                form.setFieldValue("jobName", jobName)
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-14! rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm">
                                                                <SelectValue placeholder="Select Position..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-muted-foreground/10 shadow-2xl">
                                                                {jobDetails.data.map((job) => (
                                                                    <SelectItem key={job.job_id} value={job.job_id} className="rounded-xl">
                                                                        {job.job_title}
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
                                            name="jobName"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Pipeline Tag (Job Name)</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. Engineering, Product, etc."
                                                            className="h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Personal Details --- */}
                            <section>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Candidate Identity</h2>
                                            <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Basic professional contact information.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <form.Field
                                            name="candidateName"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Full Legal Name</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. Jane Doe"
                                                            className="h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                )
                                            }}
                                        />

                                        <form.Field
                                            name="candidateEmail"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Intelligence Hub (Email)</FieldLabel>
                                                        <Input
                                                            id={field.name}
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="e.g. [EMAIL_ADDRESS]"
                                                            type="email"
                                                            className="h-14 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm"
                                                        />
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <Separator className="opacity-40" />

                            {/* --- Section: Media & Documentation --- */}
                            <section>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Profile Assets</h2>
                                            <p className="text-xs text-muted-foreground font-medium opacity-60 italic">Visual and technical documentation.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Profile Image</FieldLabel>
                                            <div className="relative">
                                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer bg-card hover:bg-muted/30 border-muted-foreground/10 transition-all group/upload relative overflow-hidden">
                                                    {imgBase64 ? (
                                                        <img src={imgBase64} alt="Preview" className="h-full w-full object-cover p-1 rounded-[1.5rem]" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-muted-foreground/40 gap-3">
                                                            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                                                <ImageIcon className="w-6 h-6" />
                                                            </div>
                                                            <p className="text-xs font-bold uppercase tracking-widest">Select Image</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                                {imgBase64 && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
                                                        onClick={() => setImgBase64(null)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <form.Field
                                            name="candidateCv"
                                            children={(field) => {
                                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                                return (
                                                    <Field data-invalid={isInvalid} className="space-y-3">
                                                        <FieldLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Professional Resume (CV)</FieldLabel>
                                                        <div className="relative group/cv">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-30 group-hover/cv:text-primary transition-colors">
                                                                <FileUp className="h-full w-full" />
                                                            </div>
                                                            <Input
                                                                type='file'
                                                                id={field.name}
                                                                onBlur={field.handleBlur}
                                                                onChange={(e) => field.handleChange(e.target.files?.[0] || null)}
                                                                className="h-14 pl-12 rounded-2xl bg-card border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm flex items-center pt-4"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-40 px-1 mt-1">
                                                            Accepted: PDF, DOCX
                                                        </p>
                                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                    </Field>
                                                )
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>
                        </FieldGroup>

                        {/* --- Action Footer --- */}
                        <div className="pt-8 flex items-center justify-end gap-6 border-t border-border">
                            <Link
                                to="/dashboard/candidates"
                                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-4"
                            >
                                Cancel
                            </Link>
                            <Button
                                disabled={isUploading || isPending}
                                type="submit"
                                className="h-12 px-10 rounded-2xl shadow-lg shadow-primary/20 gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                {isUploading || isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {isUploading || isPending ? "Uploading..." : "Onboard Candidate"}
                                </span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
