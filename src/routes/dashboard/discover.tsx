import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CandidateResultCard } from '@/components/web/candidate-result-card';
import { EmptyState } from '@/components/web/empty-state';
import { MultiStepLoader } from '@/components/web/multi-step-loader';
import { SearchProfileForm } from '@/components/web/search-profile-form';
import { getDownloadURL, getJobDetails, getProcessedIndexFilesId, getSearchProfileDetails, jobInterviewCandidates } from '@/lib/server-function';
import { PaginatedJobResponse, ProfileSearchCritieria, ProfileSearchResponse, RagProcessRecord } from '@/lib/types';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { toast } from 'sonner';
import { Compass, Database, Mail, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/dashboard/discover')({
    component: RouteComponent,
    loader: async () => {
        const data: RagProcessRecord[] = await getProcessedIndexFilesId();
        const jobDetails: PaginatedJobResponse = await getJobDetails({ data: { limit: null, status: null, last_doc_id: null } })
        return { data, jobDetails };
    }
})

function RouteComponent() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [fileUrl, setFileUrl] = useState<string>("");
    const [downloading, setDownloading] = useState<boolean>(false);
    const { data, jobDetails } = Route.useLoaderData()
    const [results, setResults] = useState<ProfileSearchResponse | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [documentId, setDocumentId] = useState<string>('')
    const [selectedJobId, setSelectedJobId] = useState<string>('')
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    const handleCheckedChange = (id: string, checked: boolean) => {
        setSelectedItems((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        )
    }

    const onProfileSearchSubmit = async (formData: ProfileSearchCritieria) => {
        let fileIds: string[] | null = null
        try {
            if (documentId.length > 0) {
                const filteredData = data.filter((item) => item.id === documentId)
                const ragPaths = filteredData[0].rag_file_ids
                fileIds = ragPaths.map(path => path.split('/').pop() ?? null).filter(item => item !== null);
            }
            setIsSubmitting(true)
            setSelectedJobId(formData.jobId)
            const jobDescription = formData.jobDescription;
            const preferedDomain = formData.preferedDomain;
            const skills = formData.skills;
            const experience = formData.experience;
            const searchResults: ProfileSearchResponse = await getSearchProfileDetails({ data: { jobDescription, preferedDomain, skills, experience, fileIds } })
            setResults(searchResults)
            setIsSubmitting(false)
        } catch (e) {
            console.log(e)
            setIsSubmitting(false)
        }
    }

    const bucketChangeHandler = (id: string) => {
        setDocumentId(id)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const results: { success: boolean, message: string } = await jobInterviewCandidates({ data: { job_id: selectedJobId, candidates: selectedItems } })
            if (results.success) {
                toast.success(results.message)
            } else {
                toast.error(results.message)
            }
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setIsSubmitting(false)
            setSelectedItems([])
        }
    }

    const downlaodUrl = async (url: string) => {
        try {
            setDownloading(true)
            setFileUrl("")
            setIsOpen(false)
            const response = await getDownloadURL({ data: { bucket_name: "cv_bucket_project-716b1c69-ee04-40fd-ba6", file_path: url } })
            if (response.download_url) {
                setFileUrl(encodeURIComponent(response.download_url))
                setIsOpen(true)
            }
        } catch (e) {
            toast.error("Download failed")
        } finally {
            setDownloading(false)
        }
    }

    const hasResults = results && results.matches && results.matches.length > 0;

    return (
        <div className="flex flex-col gap-8 md:gap-14 p-4 md:p-10 lg:p-14 pb-20 bg-transparent">
            {/* --- Hero Header Section --- */}
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-muted/40 border border-muted-foreground/10 p-6 sm:p-12 text-foreground shadow-sm group">
                {/* Background Decorative Blur - Muted */}
                <div className="absolute top-0 right-0 -m-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px] group-hover:bg-primary/10 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                                <Compass className="h-5 w-5 text-primary" />
                            </div>
                            <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">
                                AI Powered Discovery
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">
                            Discover Elite Talent
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed opacity-80">
                            Search through your indexed resumes using intelligent semantic matching to find candidates that perfectly align with your job requirements.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/50 backdrop-blur-xl p-4 rounded-[1.5rem] sm:rounded-3xl border shadow-sm w-full xl:w-auto">
                        <div className="flex flex-col gap-1.5 px-2 w-full sm:w-auto items-start">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 ml-1">
                                <Database className="h-3 w-3" /> Source Archive
                            </Label>
                            <Select onValueChange={(value) => bucketChangeHandler(value)}>
                                <SelectTrigger className="w-full sm:w-[220px] h-11 bg-background border-muted-foreground/10 rounded-xl focus:ring-primary/20">
                                    <SelectValue placeholder="Select Data Source" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-muted-foreground/10 shadow-2xl">
                                    <SelectGroup>
                                        {data.map((item, idx) => (
                                            <SelectItem key={idx} value={item.id} className="rounded-xl my-1">
                                                Archive: {item.date}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator orientation="vertical" className="hidden sm:block h-12 bg-muted-foreground/10" />
                        <div className="w-full sm:w-auto">
                            <SearchProfileForm onProfileSearchSubmit={onProfileSearchSubmit} jobDetails={jobDetails} />
                        </div>
                    </div>
                </div>
            </div>

            {isSubmitting && <MultiStepLoader isLoading={isSubmitting} />}

            {/* --- Results Section --- */}
            <div className="w-full max-w-7xl mx-auto px-1 sm:px-0">
                {!hasResults ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 px-2">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    Matching Candidates
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
                                    AI found {results.matches.length} profiles matching your criteria
                                </p>
                            </div>

                            {/* Floating / Sticky Action Bar for Selection */}
                            <div className={cn(
                                "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl shadow-black/20 border border-white/10 w-[min(90%,400px)] sm:w-auto",
                                selectedItems.length > 0 ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95 pointer-events-none"
                            )}>
                                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">
                                        {selectedItems.length}
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold tracking-tight hidden xs:inline">Selected</span>
                                </div>
                                <Separator orientation="vertical" className="h-6 bg-white/20 dark:bg-black/20" />
                                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                    <Button
                                        onClick={handleSubmit}
                                        size="sm"
                                        className="h-9 sm:h-10 px-4 sm:px-5 flex-1 sm:flex-none rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2 text-xs sm:text-sm"
                                        disabled={isSubmitting}
                                    >
                                        <Mail className="h-3.5 w-3.5" />
                                        Invite
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-white/10 dark:hover:bg-black/10 shrink-0"
                                        onClick={() => setSelectedItems([])}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {results.matches.map((candidate, idx) => (
                                <CandidateResultCard
                                    key={idx}
                                    data={candidate}
                                    selectedItems={selectedItems}
                                    handleCheckedChange={handleCheckedChange}
                                    downlaodUrl={downlaodUrl}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                    isDownloading={downloading}
                                    fileUrl={fileUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
