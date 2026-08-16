import { ShieldAlert, AlertTriangle, MousePointerClick, Clock, Hash, Mail, Calendar, ScanFace, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { getMovementDetectionDetails } from "@/lib/server-function";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const movementDetectionDetailsQueryOptions = (email: string, job_id: string) => queryOptions({
    queryKey: ['movements', email, job_id],
    queryFn: () => getMovementDetectionDetails({ data: { user_email: email, job_id: job_id } })
})

export function MovementOutCome({ email, id }: { email: string, id: string }) {
    const { data: mockMovementData } = useSuspenseQuery(movementDetectionDetailsQueryOptions(email, id))

    if (!mockMovementData?.data?.[0]?.events || mockMovementData.data[0].events.length === 0) {
        return null;
    }

    const sessionData = mockMovementData.data[0];
    const sortedEvents = [...sessionData.events].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 border-border/60 bg-muted/30 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-500/30 transition-all cursor-pointer shadow-xs"
                    >
                        <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> 
                        <span>Security Log ({sessionData.total_events})</span>
                    </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-l border-border/60 flex flex-col p-0 shadow-2xl">
                    <SheetHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/20 shadow-sm">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-black tracking-tight text-foreground">
                                    Candidate Security Audit Log
                                </SheetTitle>
                                <SheetDescription className="text-xs text-muted-foreground font-medium">
                                    Proctoring telemetry, focus shifts, and browser anomaly detection
                                </SheetDescription>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Session Overview Card */}
                        <div className="p-6 rounded-3xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/60 shadow-lg space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                                        Proctoring Flags
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-rose-500 tabular-nums">
                                            {sessionData.total_events}
                                        </span>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                            Infractions Recorded
                                        </span>
                                    </div>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40 text-xs font-medium">
                                <div className="flex items-center gap-2 text-foreground/80 truncate">
                                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <span className="truncate">{sessionData.user_email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                                    <span>
                                        {format(new Date(sessionData.created_at), "dd MMM yyyy • hh:mm a")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Incident Timeline */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 text-orange-500" /> Incident Timeline
                                </h4>
                                <Badge variant="outline" className="text-[10px] font-bold">
                                    {sortedEvents.length} Events
                                </Badge>
                            </div>

                            <div className="relative border-l-2 border-border/50 ml-3 space-y-4 pb-2">
                                {sortedEvents.map((event, index) => {
                                    const isFaceDetection = event.reason.toLowerCase().includes("face");
                                    const isBrowserFocus = event.reason.toLowerCase().includes("browser") || event.reason.toLowerCase().includes("tab");

                                    return (
                                        <div key={index} className="relative pl-6 group">
                                            {/* Timeline Pin */}
                                            <div className={cn(
                                                "absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center shadow-xs transition-transform group-hover:scale-125",
                                                isFaceDetection ? "bg-amber-500" : isBrowserFocus ? "bg-blue-500" : "bg-rose-500"
                                            )} />

                                            {/* Event Content Card */}
                                            <div className="bg-white/60 dark:bg-zinc-900/60 border border-border/60 p-4 rounded-2xl shadow-xs space-y-2 hover:border-orange-500/30 transition-colors">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-muted text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {event.time}
                                                    </span>
                                                    
                                                    <Badge 
                                                        variant="outline" 
                                                        className={cn(
                                                            "text-[9px] font-black uppercase tracking-wider px-2 py-0.5",
                                                            isFaceDetection 
                                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" 
                                                                : isBrowserFocus 
                                                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" 
                                                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                                                        )}
                                                    >
                                                        {isFaceDetection ? "Face Tracking" : isBrowserFocus ? "Window Focus Shift" : "Session Anomaly"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-start gap-2.5 pt-1">
                                                    <div className="mt-0.5 shrink-0">
                                                        {isFaceDetection ? (
                                                            <ScanFace className="w-4 h-4 text-amber-500" />
                                                        ) : isBrowserFocus ? (
                                                            <MousePointerClick className="w-4 h-4 text-blue-500" />
                                                        ) : (
                                                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-semibold text-foreground/90 leading-relaxed">
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
    )
}