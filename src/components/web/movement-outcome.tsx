import { Info, ShieldAlert, AlertTriangle, MousePointerClick, Clock, Hash, Mail, Calendar, ScanFace } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { getMovementDetectionDetails } from "@/lib/server-function";



export const movementDetectionDetailsQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['movements', email, job_id],
    queryFn: () => getMovementDetectionDetails({ data: { user_email: email, job_id: job_id } })
})
export function MovementOutCome({ email, id }: { email: string, id: string }) {
    const { data: mockMovementData } = useSuspenseQuery(movementDetectionDetailsQueryOptions(email, id))

    const sortedEvents = [...mockMovementData.data[0].events].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className='flex flex-row justify-end'>
            <div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full mt-2 text-[10px] font-bold uppercase tracking-tighter hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors dark:hover:bg-orange-900/20 dark:hover:text-orange-400 dark:hover:border-orange-800">
                            <Info className="w-3 h-3 mr-2" /> Movement Detect
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md bg-slate-50 dark:bg-zinc-950 border-l dark:border-zinc-800 flex flex-col p-0 shadow-2xl">
                        <SheetHeader className="p-6 border-b bg-white dark:bg-zinc-900 dark:border-zinc-800">
                            <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                <span className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                                    <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </span>
                                Security Audit Log
                            </SheetTitle>
                            <SheetDescription className="text-sm mt-2 font-medium">
                                Tracking anomalies and focus shifts during the interview session.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Session Summary Card */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <Hash className="w-4 h-4" /> Session Overview
                                </h4>
                                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4">

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Infractions</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-rose-500 dark:text-rose-400">
                                                    {mockMovementData.data[0].total_events}
                                                </span>
                                                <span className="text-xs font-semibold text-rose-500/70 dark:text-rose-400/70 uppercase">flags</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="w-12 h-12 rounded-full border-4 border-rose-100 dark:border-rose-900/40 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20">
                                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full" />

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300 truncate">{mockMovementData.data[0].user_email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-4 h-4 text-zinc-400" />
                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                {new Date(mockMovementData.data[0].created_at).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Timeline of Events */}
                            <div className="space-y-6 pt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <Clock className="w-4 h-4" /> Incident Timeline
                                    </h4>
                                    <span className="text-xs font-semibold px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                                        {mockMovementData.data[0].events.length} Events
                                    </span>
                                </div>

                                <div className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-3 space-y-6 pb-4">
                                    {sortedEvents.map((event, index) => {
                                        const isFaceDetection = event.reason.toLowerCase().includes("face");
                                        const isBrowserFocus = event.reason.toLowerCase().includes("browser");

                                        return (
                                            <div key={index} className="relative pl-6 sm:pl-8 group">
                                                {/* Timeline Line Dot */}
                                                <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center
                                                    ${isFaceDetection ? 'bg-amber-500' : isBrowserFocus ? 'bg-blue-500' : 'bg-rose-500'}
                                                    shadow-sm ring-2 ring-transparent group-hover:ring-rose-200 dark:group-hover:ring-rose-900 transition-all`}
                                                >
                                                </div>

                                                {/* Event Card */}
                                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-300 dark:group-hover:border-zinc-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {event.time}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                                                            ${isFaceDetection ? 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10' :
                                                                isBrowserFocus ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10' :
                                                                    'text-zinc-700 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800'}
                                                        `}>
                                                            {isFaceDetection ? 'Face Tracking' : isBrowserFocus ? 'Focus Lost' : 'Other Violation'}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <div className="mt-0.5">
                                                            {isFaceDetection ? (
                                                                <ScanFace className="w-5 h-5 text-amber-500" />
                                                            ) : isBrowserFocus ? (
                                                                <MousePointerClick className="w-5 h-5 text-blue-500" />
                                                            ) : (
                                                                <AlertTriangle className="w-5 h-5 text-zinc-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                                            {event.reason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}