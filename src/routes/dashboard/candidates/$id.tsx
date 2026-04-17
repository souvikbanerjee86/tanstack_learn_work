import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createFileRoute, Link, useLocation } from '@tanstack/react-router'
import { Briefcase, Calendar, ChevronLeft, FileText, Hash, User, Globe, Share2 } from 'lucide-react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getDownloadURL } from '@/lib/server-function'
import { candidate } from '@/lib/types'
import { Suspense } from 'react'
import { CandidateDetailSkeleton } from '@/components/web/candidate-detail-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


export const candidatesCVQueryOptions = (url: string) => queryOptions({
    queryKey: ['candidates', url],
    queryFn: () => getDownloadURL({ data: { bucket_name: "cv_bucket_project-project-e7c52c57-c7d4-407d-b4b", file_path: url } })
})


export const Route = createFileRoute('/dashboard/candidates/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const candidate = location.state as any;

    if (!candidate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                    <User className="h-12 w-12" />
                </div>
                <p className="text-slate-500 font-medium tracking-tight">Candidate information not found.</p>
                <Link to="/dashboard/candidates">
                    <Button variant="outline" className="rounded-xl">Return to Candidates</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30 overflow-hidden p-4 md:p-10 lg:p-14 pb-20">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto space-y-8">
                {/* Navigation Header */}
                <div className="flex items-center justify-between">
                    <Link to='/dashboard/candidates'>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group gap-2 px-4 text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-zinc-900/50 backdrop-blur-sm rounded-full transition-all"
                        >
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span className="font-semibold tracking-tight">Return to Pool</span>
                        </Button>
                    </Link>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 gap-2 px-4 rounded-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 font-bold transition-all">
                            <Share2 className="h-3.5 w-3.5" />
                            Share Profile
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Summary Card */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 dark:shadow-none rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50">
                            <CardContent className="p-8 pt-10 text-center">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-110" />
                                    {candidate.candidate_image ? (
                                        <Avatar className="h-32 w-32 rounded-3xl flex items-center justify-center mx-auto border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 overflow-hidden">
                                            <AvatarImage src={candidate.candidate_image} alt={candidate.name} className="object-cover" />
                                            <AvatarFallback className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                                <User className="h-12 w-12" />
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="h-32 w-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center mx-auto border-4 border-white dark:border-slate-800 shadow-2xl relative z-10">
                                            <User className="h-14 w-14 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight mb-1">{candidate.name}</h2>
                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-80 mb-6">{candidate.email}</p>

                                <Badge className="px-5 py-1.5 rounded-full bg-slate-900 dark:bg-indigo-500/20 text-white dark:text-indigo-300 font-bold text-[10px] uppercase tracking-widest border-none">
                                    Candidate ID: {candidate.id?.substring(0, 8) || "N/A"}
                                </Badge>

                                <Separator className="my-10 bg-slate-200/50 dark:bg-slate-800/50" />

                                <div className="space-y-6 text-left">
                                    <ProfileMetricItem
                                        icon={Briefcase}
                                        label="Application Role"
                                        value={candidate.job_name}
                                    />
                                    <ProfileMetricItem
                                        icon={Hash}
                                        label="Target Job ID"
                                        value={candidate.job_id}
                                    />
                                    <ProfileMetricItem
                                        icon={Calendar}
                                        label="Submission Date"
                                        value={candidate.uploaded_at}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Metadata Section */}
                        <div className="p-8 rounded-[2rem] bg-indigo-600 dark:bg-indigo-950/40 shadow-xl shadow-indigo-600/20 space-y-4">
                            <h4 className="text-white font-black tracking-tight text-lg mb-2 flex items-center gap-2">
                                <Globe className="h-4 w-4 text-indigo-200" />
                                Source Insights
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200/70 mb-1">Acquisition Method</p>
                                    <p className="text-sm font-bold text-white">Direct Platform Upload</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200/70 mb-1">System status</p>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Verified Documents
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Suspense fallback={<CandidateDetailSkeleton />}>
                        <CVContent candidate={candidate} />
                    </Suspense>

                </div>
            </div>
        </div>
    )

}


function CVContent({ candidate }: { candidate: candidate }) {
    var fileUrl = ""
    const cleanedPath = candidate.resume_url.substring(candidate.resume_url.indexOf("uploads"));
    const { data: { download_url } } = useSuspenseQuery(candidatesCVQueryOptions(cleanedPath))

    if (download_url) {
        fileUrl = encodeURIComponent(download_url)
    }

    return (
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-none bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-indigo-500/5 dark:shadow-none rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50 h-full flex flex-col">
                <CardHeader className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800/50 mx-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <CardTitle className="text-lg font-black tracking-tighter text-slate-900 dark:text-white leading-tight">Master Portfolio</CardTitle>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Candidate Resume / CV Preview</p>
                            </div>
                        </div>

                    </div>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col min-h-[700px]">
                    <div className="relative flex-1 rounded-3xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-inner-sm">
                        {fileUrl ? (
                            <iframe
                                src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                                className="w-full h-full min-h-[600px] border-none"
                                title="Candidate Resume"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-4">
                                <div className="p-6 rounded-full bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Preview Unavailable</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                                        The document couldn't be loaded directly. Please try opening it in a new window.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Internal Reference</p>
                            <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">{candidate.id}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Doc Integrity</p>
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Validated PDF</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ProfileMetricItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 group-hover:scale-110 transition-transform">
                <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{value}</p>
            </div>
        </div>
    );
}
