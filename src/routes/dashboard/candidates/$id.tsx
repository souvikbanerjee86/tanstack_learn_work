import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createFileRoute, Link, useLocation } from '@tanstack/react-router'
import { ArrowLeft, Briefcase, Calendar, FileText, Hash, User } from 'lucide-react'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getDownloadURL } from '@/lib/server-function'
import { candidate } from '@/lib/types'
import { Suspense } from 'react'
import { CandidateDetailSkeleton } from '@/components/web/candidate-detail-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const candidatesCVQueryOptions = (url: string) => queryOptions({
    queryKey: ['candidates', url],
    queryFn: () => getDownloadURL({ data: { bucket_name: "cv_bucket_project-716b1c69-ee04-40fd-ba6", file_path: url } })
})


export const Route = createFileRoute('/dashboard/candidates/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const candidate = location.state as any;
    return (
        <div className="max-w-6xl p-4 md:p-8 space-y-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <Link to='/dashboard/candidates'><Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Candidates
                </Button></Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile Summary Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-muted/60 shadow-sm">
                        <CardContent className="pt-6 text-center">
                            {candidate.candidate_image ? (<Avatar className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                                <AvatarImage src={candidate.candidate_image} alt="@shadcn" />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>) : (<div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">

                                <User className="h-12 w-12 text-primary" />

                            </div>)}
                            <h2 className="text-xl font-bold">{candidate.name}</h2>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                            <Badge variant="secondary" className="mt-4 px-4 py-1">
                                Candidate
                            </Badge>

                            <Separator className="my-6" />

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Job Applied</p>
                                        <p className="text-sm font-medium">{candidate.job_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Job ID</p>
                                        <p className="text-sm font-medium">{candidate.job_id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Applied On</p>
                                        <p className="text-sm font-medium">{candidate.uploaded_at}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <Suspense fallback={<CandidateDetailSkeleton />}>
                    <CVContent candidate={candidate} />
                </Suspense>

            </div>
        </div>
    )

}


function CVContent({ candidate }: { candidate: candidate }) {
    var fileUrl = ""
    const cleanedPath = candidate.resume_url.substring(candidate.resume_url.indexOf("uploads"));
    const { data: { download_url } } = useSuspenseQuery(candidatesCVQueryOptions(cleanedPath))
    console.log(download_url)
    if (download_url) {
        fileUrl = encodeURIComponent(download_url)
    }
    return <div className="lg:col-span-2 space-y-6">
        <Card className="border-muted/60 shadow-sm h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Resume / CV
                </CardTitle>
                <CardDescription>
                    Review candidate documents and history.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* This mimics the resume list style in your images */}
                <div className="rounded-lg border bg-muted/20 p-8 flex flex-col items-center justify-center border-dashed min-h-[400px]">
                    {fileUrl ? (<iframe
                        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                        style={{ width: "100%", height: "600px" }}
                        frameBorder="0">
                    </iframe>) : (<><FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                            Click the link below to open the original document in a new tab.
                        </p></>)}



                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-3">Application Metadata</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-md bg-muted/30 border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Document ID</p>
                            <p className="text-xs truncate font-mono">{candidate.id}</p>
                        </div>
                        <div className="p-3 rounded-md bg-muted/30 border">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Source</p>
                            <p className="text-xs">Direct Upload</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>

}
