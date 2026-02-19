

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { jobPostSchema } from '@/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/jobs/add')({
    component: RouteComponent,
})

function RouteComponent() {

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
        "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    const form = useForm({
        defaultValues: {
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
            console.log(value)

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
                                            <Select value={field.state.value.toString()}
                                                onValueChange={(value: any) => {
                                                    field.handleChange((value))
                                                }}>
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

                                {/* Location Dropdown (India States) */}
                                <form.Field
                                    name="locations"
                                    children={(field) => {
                                        const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel>Work Location (State)</FieldLabel>
                                                <Select value={field.state.value.toString()}
                                                    onValueChange={(value: any) => {
                                                        field.handleChange((value))
                                                    }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select State" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {indianStates.map((state) => (
                                                            <SelectItem key={state} value={state}>
                                                                {state}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                    return (<Field>
                                        <FieldLabel htmlFor={field.name}>Job Description</FieldLabel>
                                        <Textarea
                                            id={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Describe responsibilities and requirements..."
                                            className="min-h-[120px]"
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>)
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

                            <Button type="submit" className="w-full">Post Job</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
