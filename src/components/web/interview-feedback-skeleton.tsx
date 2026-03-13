import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Info, Mail, User, Clock } from "lucide-react"

export default function InterviewFeedbackSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 p-6 font-sans">
            {/* Header Actions */}
            <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm hover:bg-zinc-800 transition-colors">
                    <Info size={16} />
                    VIEW AUDIO OUTCOME
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-zinc-900/40 border-zinc-800 text-zinc-100 overflow-hidden">
                        <CardContent className="p-0">
                            {/* Question Header */}
                            <div className="p-8 flex justify-between items-start border-b border-zinc-800/50">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Current Question</p>
                                    <h2 className="text-2xl font-semibold">When would you choose Dataflow over Dataproc, and vice versa?</h2>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-zinc-800/50 rounded-xl p-4 min-w-[80px] border border-zinc-700/50">
                                    <span className="text-xs text-zinc-500 font-bold uppercase">Score</span>
                                    <span className="text-4xl font-bold text-red-500">0</span>
                                </div>
                            </div>

                            {/* Candidate Transcript Section */}
                            <div className="p-8">
                                <div className="bg-zinc-950/50 rounded-2xl p-8 border border-zinc-800/30 italic text-zinc-300 leading-relaxed relative">
                                    <span className="absolute top-4 left-4 text-6xl text-zinc-800 font-serif leading-none select-none">“</span>
                                    here is the breakdown of when to choose which one the high level perspective data flow diagrams dfd choose a dfd
                                </div>
                            </div>

                            {/* AI Feedback Reasoning */}
                            <div className="p-8 bg-zinc-900/20 border-t border-zinc-800/50">
                                <div className="flex items-center gap-2 mb-4 text-zinc-100">
                                    <div className="p-1 bg-zinc-800 rounded">
                                        <Info size={14} className="text-zinc-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">AI Feedback Reasoning</span>
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    The candidate completely misunderstands the question. They confuse Google Cloud Dataflow
                                    (a big data processing service) with 'data flow diagrams' (DFD), a concept used in software design.
                                    Their answer is entirely irrelevant and demonstrates no knowledge of the actual services mentioned in the question.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Candidate Data */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-zinc-900/40 border-zinc-800 text-zinc-100 h-full">
                        <CardContent className="p-8 space-y-8">
                            <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Candidate Data</h3>

                            {/* Profile Info */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500">
                                        <Mail size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase font-bold text-zinc-500">Email</p>
                                        <p className="text-sm truncate font-medium">souvik.mlindia@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-500">AI Verdict</p>
                                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-none hover:bg-orange-500/20 mt-1">
                                            Likely Human
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-zinc-800" />

                            {/* Status Checks */}
                            <div className="space-y-4">
                                <StatusRow label="Logic Check" active />
                                <StatusRow label="Text Match" active />
                                <StatusRow label="Voice Match" active />
                            </div>

                            <div className="pt-8 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                                <Clock size={12} />
                                TIMESTAMP: 2026-02-20T17:37:13.709000Z
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function StatusRow({ label, active }: { label: string; active?: boolean }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-tighter text-zinc-400">{label}</span>
            <CheckCircle2 size={18} className={active ? "text-emerald-500" : "text-zinc-700"} />
        </div>
    )
}