import { createFileRoute, Link, useLocation } from '@tanstack/react-router'
import {
    Calendar,
    MapPin,
    Briefcase,
    ArrowLeft,
    Share2,
    Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export const Route = createFileRoute('/dashboard/jobs/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const location = useLocation()
    const jobInfo = location.state as any;

    const job = jobInfo;
    return <div className="min-h-screen bg-background/50 pb-12 transition-colors duration-300">

        <div className="bg-card border-b">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
                    <Link to='/dashboard/jobs'>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                    </Link>
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {/* Changed text-slate-900 to text-foreground */}
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{job.job_title}</h1>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 capitalize">
                                {job.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium text-sm">Job ID: {job.job_id}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Apply Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <main className="max-w-6xl mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-card text-card-foreground shadow-sm">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-semibold mb-6">Job Description</h2>
                            {/* Using muted-foreground for better readability in dark mode */}
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {job.job_description}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-card text-card-foreground shadow-sm sticky top-8">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-6">Job Overview</h3>

                            <div className="space-y-6">
                                {/* Item wrapper using secondary/primary-light colors */}
                                <div className="flex gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Location</p>
                                        <p className="text-sm font-semibold">{job.location}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Job Type</p>
                                        <p className="text-sm font-semibold">{job.job_type}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg h-fit">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                                        <p className="text-sm font-semibold">Starts: {job.start_date}</p>
                                        <p className="text-[10px] text-muted-foreground/70">Ends: {job.end_date}</p>
                                    </div>
                                </div>

                                <Separator />

                                <Button className="w-full">
                                    Start Application
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary text-secondary-foreground border-none">
                        <CardContent className="p-6">
                            <h3 className="font-medium mb-2">Need Help?</h3>
                            <p className="text-secondary-foreground/80 text-sm mb-4">
                                Check out our FAQ or download the full job spec.
                            </p>
                            <Button variant="secondary" size="sm" className="w-full">
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    </div>
}
