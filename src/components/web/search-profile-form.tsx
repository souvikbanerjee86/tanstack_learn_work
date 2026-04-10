import { Sparkles, Wand2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { useForm } from "@tanstack/react-form";
import { profileSearchSchema } from "@/schemas/profile-search";
import { useState } from "react";
import { PaginatedJobResponse, ProfileSearchCritieria } from "@/lib/types";
import { Badge } from "../ui/badge";

interface ChildProps {
    onProfileSearchSubmit: (data: ProfileSearchCritieria) => void;
    jobDetails: PaginatedJobResponse;
}

export function SearchProfileForm({ onProfileSearchSubmit, jobDetails }: ChildProps) {
    const [open, setOpen] = useState(false);
    const experienceYears = Array.from({ length: 31 }, (_, i) => i.toString());
    const thresholds = Array.from({ length: 9 }, (_, i) => (40 + i * 5).toString());

    const form = useForm({
        defaultValues: {
            jobDescription: "",
            preferedDomain: "",
            skills: "",
            experience: 0,
            jobId: ""
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 gap-2 group">
                    <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold tracking-tight">Smart Profile Search</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary/5 p-8 border-b border-primary/10">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight">Search Parameters</DialogTitle>
                                <p className="text-sm text-muted-foreground font-medium">Fine-tune the AI match criteria for this role.</p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8 no-scrollbar max-h-[70vh] overflow-y-auto">
                    <form id="profile-search-form" onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}>
                        <div className="grid gap-8">
                            {/* Job Selection */}
                            <form.Field
                                name="jobId"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <div className="space-y-3">
                                            <Label htmlFor={field.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <Search className="h-3 w-3" /> Targeted Role
                                            </Label>
                                            <Select
                                                value={field.state.value.toString()}
                                                onValueChange={(value) => {
                                                    field.handleChange((value))
                                                    const jobDescription = jobDetails.data.find((job) => job.job_id === value)?.job_description as string
                                                    form.setFieldValue("jobDescription", jobDescription)
                                                }}
                                            >
                                                <SelectTrigger className="h-12 w-full rounded-2xl bg-muted/30 border-muted-foreground/10 focus:ring-primary/20">
                                                    <SelectValue placeholder="Select a job position" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    <SelectGroup>
                                                        {jobDetails.data.map((job) => (
                                                            <SelectItem key={job.job_id} value={job.job_id} className="rounded-xl my-1">
                                                                {job.job_title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {isInvalid && field.state.meta.errors[0] && (
                                                <p className="text-[10px] text-destructive font-bold">
                                                    {field.state.meta.errors[0]?.toString()}
                                                </p>
                                            )}
                                        </div>
                                    );
                                }}
                            />

                            {/* Job Description (AI Knowledge) */}
                            <form.Field
                                name="jobDescription"
                                children={(field) => (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contextual Requirements</Label>
                                            <Badge variant="outline" className="text-[9px] font-bold tracking-tighter bg-primary/5 text-primary">AI ANALYZABLE</Badge>
                                        </div>
                                        <Textarea
                                            id={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Paste detailed requirements here..."
                                            className="min-h-[120px] rounded-2xl bg-muted/30 border-muted-foreground/10 focus-visible:ring-primary/20 p-4 scrollbar-hide"
                                        />
                                    </div>
                                )}
                            />

                            <div className="grid sm:grid-cols-2 gap-6">
                                <form.Field
                                    name="preferedDomain"
                                    children={(field) => (
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Specialized Domain</Label>
                                            <Input
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder="e.g. Fintech"
                                                className="h-12 rounded-2xl bg-muted/30 border-muted-foreground/10"
                                            />
                                        </div>
                                    )}
                                />
                                <form.Field
                                    name="experience"
                                    children={(field) => (
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min. Experience</Label>
                                            <Select
                                                value={field.state.value.toString()}
                                                onValueChange={(value) => field.handleChange(Number(value))}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-muted-foreground/10">
                                                    <SelectValue placeholder="Any" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    {experienceYears.map((year) => (
                                                        <SelectItem key={year} value={year} className="rounded-xl">
                                                            {year}+ Years
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>

                            <form.Field
                                name="skills"
                                children={(field) => (
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Expertise (Comma Separated)</Label>
                                        <Input
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="React, AWS, Python..."
                                            className="h-12 rounded-2xl bg-muted/30 border-muted-foreground/10 uppercase font-mono text-xs tracking-wider"
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </form>
                </div>

                <div className="p-8 bg-muted/20 border-t border-muted-foreground/5">
                    <DialogFooter>
                        <Button
                            form="profile-search-form"
                            type="submit"
                            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            Launch Intelligent Search
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}