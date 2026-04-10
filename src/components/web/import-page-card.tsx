import { RagProcessRecord } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { format } from 'date-fns'
import { Database, FileCheck, History, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImportPageCard({ cardDescription, processedCount, footerDescription, processedIndexFiles }:
    { cardDescription: string, processedCount: number, footerDescription: string, processedIndexFiles: RagProcessRecord[] }) {

    const isLastIndex = cardDescription === "Last Processed Index";
    const isTotalFiles = cardDescription === "Total Processed Files";
    
    return (
        <Card className="relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 border-muted-foreground/10 rounded-2xl">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -m-4 h-16 w-16 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 {isLastIndex ? <History className="h-full w-full" /> : isTotalFiles ? <FileCheck className="h-full w-full" /> : <Database className="h-full w-full" />}
            </div>

            <CardHeader className="space-y-4 pb-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                    {isLastIndex ? <History className="h-3 w-3" /> : isTotalFiles ? <FileCheck className="h-3 w-3" /> : <Database className="h-3 w-3" />}
                    {cardDescription}
                </div>
                
                <div className="space-y-1">
                    <CardTitle className="text-3xl font-black tracking-tighter tabular-nums">
                        {isLastIndex ? (processedIndexFiles[0]?.date || "N/A") : processedCount}
                    </CardTitle>
                    
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted/30 w-fit px-2 py-0.5 rounded-full border border-muted-foreground/5">
                        <Info className="h-2.5 w-2.5 opacity-50" />
                        {footerDescription} {processedIndexFiles && processedIndexFiles[0] ? format(new Date(processedIndexFiles[0].processed_at), "MMM d, h:mm a") : "Never"}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}