import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, FileUp, ImageIcon, Send, Trash2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { addCandidate, getJobDetails } from '@/lib/server-function'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm } from '@tanstack/react-form'
import { candidateAddSchema } from '@/schemas/profile-search'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const jobsQueryOptions = queryOptions({
    queryKey: ['jobs'],
    queryFn: () => getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
})
export const Route = createFileRoute('/dashboard/candidates/add')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useSuspenseQuery(jobsQueryOptions)
    const navigator = useNavigate()
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
            try {
                setIsUploading(true)
                await addCandidate({ data: formData })
                toast("Candidate Added Successfully")
                navigator({ to: '/dashboard/candidates' })
            } catch (e) {
                console.log(e)
                toast.error("Something went wrong")
            } finally {
                setIsUploading(false)
            }


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
        <div className="w-full max-w-3xl mx-auto space-y-4">
            {/* 1. Back Button - Positioned Top Left */}
            <div className="flex items-center justify-start">
                <Link to='/dashboard/candidates'>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 pl-2 text-muted-foreground hover:text-foreground"

                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <Card className="shadow-md border-muted/60 dark:bg-card">
                <CardHeader>
                    <CardTitle className="text-xl">Candidate Application</CardTitle>
                    <CardDescription>Upload candidate details and CV for processing.</CardDescription>
                </CardHeader>

                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <FieldGroup>
                        <CardContent className="space-y-6">
                            {/* Main Info Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <form.Field
                                        name="jobId"
                                        children={(field) => {
                                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Job Title</FieldLabel>
                                                    <Select
                                                        value={field.state.value.toString()}
                                                        onValueChange={(value) => {
                                                            field.handleChange((value))
                                                            const jobName = jobDetails.data.find((job) => job.job_id === value)?.job_title as string
                                                            form.setFieldValue("jobName", jobName)
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full max-w-48">
                                                            <SelectValue placeholder="Select Job" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Job Title</SelectLabel>
                                                                {jobDetails.data.map((job) => (
                                                                    <SelectItem key={job.job_id} value={job.job_id}>
                                                                        {job.job_title}
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
                                <div className="space-y-2">
                                    <form.Field
                                        name="jobName"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Job Name</FieldLabel>
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
                                </div>
                                <div className="space-y-2">
                                    <form.Field
                                        name="candidateName"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Candidate Name</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="e.g. Souvik Banerjee"
                                                        autoComplete="off"

                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <form.Field
                                        name="candidateEmail"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Candidate Name</FieldLabel>
                                                    <Input
                                                        id={field.name}
                                                        name={field.name}
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="e.g. [EMAIL_ADDRESS]"
                                                        type="email"
                                                        autoComplete="off"

                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            <hr className="border-muted/50" />

                            {/* File Upload Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image to Base64 Field */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" /> Profile Image (Base64)
                                    </Label>
                                    <div className="relative">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 border-input transition-colors">
                                            {imgBase64 ? (
                                                <img src={imgBase64} alt="Preview" className="h-full w-auto object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <FileUp className="w-8 h-8 mb-2" />
                                                    <p className="text-[10px] uppercase font-bold tracking-tighter">Upload Image</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {imgBase64 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                onClick={() => setImgBase64(null)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* CV File Upload Field */}
                                <div className="space-y-3">

                                    <form.Field
                                        name="candidateCv"
                                        children={(field) => {
                                            const isInvalid =
                                                field.state.meta.isTouched && !field.state.meta.isValid
                                            return (
                                                <Field data-invalid={isInvalid}>
                                                    <FieldLabel htmlFor={field.name}>Candidate  Resume / CV</FieldLabel>
                                                    <Input
                                                        type='file'
                                                        id={field.name}
                                                        name={field.name}
                                                        // value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.files?.[0] || null)}
                                                        // onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                                        aria-invalid={isInvalid}
                                                        placeholder="e.g. Souvik Banerjee"
                                                        autoComplete="off"

                                                    />
                                                    {isInvalid && (
                                                        <FieldError errors={field.state.meta.errors} />
                                                    )}
                                                </Field>
                                            )
                                        }}
                                    />


                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-1">
                                        Accepted: PDF, DOCX
                                    </p>

                                </div>
                            </div>
                        </CardContent>
                    </FieldGroup>
                    <CardFooter className="bg-muted/10 border-t py-4 flex justify-between items-center">
                        <p className="text-xs text-muted-foreground italic">
                            Check all fields before submitting.
                        </p>
                        <Button type="submit" disabled={isUploading} className="min-w-[120px]">
                            {isUploading ? "Processing..." : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> Submit
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
