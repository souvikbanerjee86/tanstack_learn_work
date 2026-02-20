import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import { BrainCircuit, Briefcase, Calendar, CheckCircle2, Mail, Quote, User, XCircle } from 'lucide-react'

export const Route = createFileRoute('/dashboard/interview/$id')({
    loaderDeps: ({ search }: any) => ({
        email: search.email,
    }),
    loader: async ({ params, deps }) => {
        const { id } = params
        const { email } = deps
        console.log(id)
        console.log(email)
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
    const data = {
        ai_verdict: "Likely Human",
        answer: "sorry i don't have the answer",
        answer_evaluation: true,
        candidate: "souvik.mlindia@gmail.com",
        createdAt: "February 20, 2026 at 11:04:48 PM UTC+5:30",
        domain: "Software Engineering - Data Streaming/Distributed Systems",
        evaluated_at: "February 20, 2026 at 11:08:05 PM UTC+5:30",
        job_id: "Data-Engineer-001",
        question: "How do you ensure exactly-once processing in a streaming pipeline?",
        reasoning: "The candidate explicitly stated 'sorry i don't have the answer,' which provides no information or demonstration of understanding regarding exactly-once processing in streaming pipelines. This constitutes a complete failure to address the technical question.",
        score: 0,
        text_evaluation: true,
        voice_evaluation: false
    };



    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 text-slate-900 dark:text-zinc-100 transition-colors">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Top Navigation / Breadcrumbs */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        <Briefcase className="w-3 h-3" /> {data.job_id}
                        <span className="opacity-30">/</span>
                        <span>{data.domain}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Technical Response Audit</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Main Content: The Evaluation Card */}
                    <Card className="lg:col-span-3 shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="bg-zinc-900 dark:bg-zinc-800 p-6 text-white flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Question</span>
                                <h2 className="text-lg md:text-xl font-semibold leading-snug leading-tight">
                                    {data.question}
                                </h2>
                            </div>

                            {/* Score Indicator inside the Question Header */}
                            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-3 min-w-[80px] backdrop-blur-sm border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-zinc-300">Score</span>
                                <span className={`text-3xl font-black ${data.score < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.score}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Candidate's Response Section */}
                            <div className="p-6 space-y-4">
                                <div className="relative p-6 rounded-2xl bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-zinc-300 dark:text-zinc-800 -z-0" />
                                    <div className="relative z-10 italic text-lg text-zinc-700 dark:text-zinc-300">
                                        {data.answer}
                                    </div>
                                </div>

                                {/* AI Reasoning Section */}
                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <BrainCircuit className="w-4 h-4" /> AI Feedback Reasoning
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
                                        {data.reasoning}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar: Candidate & Meta */}
                    <div className="space-y-6">
                        <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 pt-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                                        <p className="text-xs font-medium truncate opacity-80">{data.candidate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">AI Verdict</p>
                                        <Badge variant="outline" className="text-[10px] h-5 bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                            {data.ai_verdict}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className="opacity-50" />
                            <CardContent className="pt-4 space-y-3">
                                <CheckItem label="Logic Check" status={data.answer_evaluation} />
                                <CheckItem label="Text Match" status={data.text_evaluation} />
                                <CheckItem label="Voice Match" status={data.voice_evaluation} />
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-tight opacity-60">
                            <Calendar className="w-3 h-3" />
                            <span>Timestamp: {data.evaluated_at.split('at')[1]}</span>
                        </div>
                    </div>

                </div>





                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Main Content: The Evaluation Card */}
                    <Card className="lg:col-span-3 shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="bg-zinc-900 dark:bg-zinc-800 p-6 text-white flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Question</span>
                                <h2 className="text-lg md:text-xl font-semibold leading-snug leading-tight">
                                    {data.question}
                                </h2>
                            </div>

                            {/* Score Indicator inside the Question Header */}
                            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-3 min-w-[80px] backdrop-blur-sm border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-zinc-300">Score</span>
                                <span className={`text-3xl font-black ${data.score < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.score}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Candidate's Response Section */}
                            <div className="p-6 space-y-4">
                                <div className="relative p-6 rounded-2xl bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-zinc-300 dark:text-zinc-800 -z-0" />
                                    <div className="relative z-10 italic text-lg text-zinc-700 dark:text-zinc-300">
                                        {data.answer}
                                    </div>
                                </div>

                                {/* AI Reasoning Section */}
                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <BrainCircuit className="w-4 h-4" /> AI Feedback Reasoning
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
                                        {data.reasoning}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar: Candidate & Meta */}
                    <div className="space-y-6">
                        <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 pt-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                                        <p className="text-xs font-medium truncate opacity-80">{data.candidate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">AI Verdict</p>
                                        <Badge variant="outline" className="text-[10px] h-5 bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                            {data.ai_verdict}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className="opacity-50" />
                            <CardContent className="pt-4 space-y-3">
                                <CheckItem label="Logic Check" status={data.answer_evaluation} />
                                <CheckItem label="Text Match" status={data.text_evaluation} />
                                <CheckItem label="Voice Match" status={data.voice_evaluation} />
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-tight opacity-60">
                            <Calendar className="w-3 h-3" />
                            <span>Timestamp: {data.evaluated_at.split('at')[1]}</span>
                        </div>
                    </div>

                </div>





                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Main Content: The Evaluation Card */}
                    <Card className="lg:col-span-3 shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="bg-zinc-900 dark:bg-zinc-800 p-6 text-white flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Question</span>
                                <h2 className="text-lg md:text-xl font-semibold leading-snug leading-tight">
                                    {data.question}
                                </h2>
                            </div>

                            {/* Score Indicator inside the Question Header */}
                            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-3 min-w-[80px] backdrop-blur-sm border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-zinc-300">Score</span>
                                <span className={`text-3xl font-black ${data.score < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.score}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Candidate's Response Section */}
                            <div className="p-6 space-y-4">
                                <div className="relative p-6 rounded-2xl bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-zinc-300 dark:text-zinc-800 -z-0" />
                                    <div className="relative z-10 italic text-lg text-zinc-700 dark:text-zinc-300">
                                        {data.answer}
                                    </div>
                                </div>

                                {/* AI Reasoning Section */}
                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <BrainCircuit className="w-4 h-4" /> AI Feedback Reasoning
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
                                        {data.reasoning}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar: Candidate & Meta */}
                    <div className="space-y-6">
                        <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 pt-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                                        <p className="text-xs font-medium truncate opacity-80">{data.candidate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">AI Verdict</p>
                                        <Badge variant="outline" className="text-[10px] h-5 bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                            {data.ai_verdict}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className="opacity-50" />
                            <CardContent className="pt-4 space-y-3">
                                <CheckItem label="Logic Check" status={data.answer_evaluation} />
                                <CheckItem label="Text Match" status={data.text_evaluation} />
                                <CheckItem label="Voice Match" status={data.voice_evaluation} />
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-tight opacity-60">
                            <Calendar className="w-3 h-3" />
                            <span>Timestamp: {data.evaluated_at.split('at')[1]}</span>
                        </div>
                    </div>

                </div>





                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Main Content: The Evaluation Card */}
                    <Card className="lg:col-span-3 shadow-xl border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="bg-zinc-900 dark:bg-zinc-800 p-6 text-white flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Question</span>
                                <h2 className="text-lg md:text-xl font-semibold leading-snug leading-tight">
                                    {data.question}
                                </h2>
                            </div>

                            {/* Score Indicator inside the Question Header */}
                            <div className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-3 min-w-[80px] backdrop-blur-sm border border-white/10">
                                <span className="text-[10px] font-bold uppercase text-zinc-300">Score</span>
                                <span className={`text-3xl font-black ${data.score < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {data.score}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Candidate's Response Section */}
                            <div className="p-6 space-y-4">
                                <div className="relative p-6 rounded-2xl bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-zinc-300 dark:text-zinc-800 -z-0" />
                                    <div className="relative z-10 italic text-lg text-zinc-700 dark:text-zinc-300">
                                        {data.answer}
                                    </div>
                                </div>

                                {/* AI Reasoning Section */}
                                <div className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <BrainCircuit className="w-4 h-4" /> AI Feedback Reasoning
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4">
                                        {data.reasoning}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar: Candidate & Meta */}
                    <div className="space-y-6">
                        <Card className="shadow-md border-zinc-200 dark:border-zinc-800">
                            <CardHeader className="pb-3 pt-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Candidate Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pb-4">
                                <div className="flex items-center gap-3 group">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Email</p>
                                        <p className="text-xs font-medium truncate opacity-80">{data.candidate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">AI Verdict</p>
                                        <Badge variant="outline" className="text-[10px] h-5 bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400">
                                            {data.ai_verdict}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                            <Separator className="opacity-50" />
                            <CardContent className="pt-4 space-y-3">
                                <CheckItem label="Logic Check" status={data.answer_evaluation} />
                                <CheckItem label="Text Match" status={data.text_evaluation} />
                                <CheckItem label="Voice Match" status={data.voice_evaluation} />
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-tight opacity-60">
                            <Calendar className="w-3 h-3" />
                            <span>Timestamp: {data.evaluated_at.split('at')[1]}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const CheckItem = ({ label, status }: { label: string; status: boolean }) => (
    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tighter">
        <span className="text-muted-foreground">{label}</span>
        {status ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
            <XCircle className="w-4 h-4 text-rose-500" />
        )}
    </div>
);

