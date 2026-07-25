import { PDFDownloadLink } from '@react-pdf/renderer';
import { InterviewPDFReport } from './pdf-evaluation-report';
import { Button } from '../ui/button';
import { Download, Loader2, Sparkles, FileCheck2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EvaluationData, InterviewRecord, UserMovementData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PDFDownloadButtonProps {
    email: string;
    id: string;
    evaluation?: string;
    feedback?: string;
    answers?: EvaluationData[];
    voiceAnswers?: InterviewRecord[];
    movementData?: UserMovementData[];
}

export function PDFDownloadButton({
    email,
    id,
    evaluation,
    feedback,
    answers = [],
    voiceAnswers = [],
    movementData = [],
}: PDFDownloadButtonProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-primary/20 bg-muted/30"
            >
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Preparing PDF Engine...
            </Button>
        );
    }

    const document = (
        <InterviewPDFReport
            email={email}
            id={id}
            evaluation={evaluation}
            feedback={feedback}
            answers={answers}
            voiceAnswers={voiceAnswers}
            movementData={movementData}
        />
    );

    const safeEmail = email.replace(/[@.]/g, '_');
    const fileName = `Interview_Evaluation_${safeEmail}_${id}.pdf`;

    return (
        <PDFDownloadLink document={document} fileName={fileName}>
            {({ loading, error }) => (
                <Button
                    variant="default"
                    size="sm"
                    disabled={loading || Boolean(error)}
                    className={cn(
                        "relative group gap-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] px-4 py-2.5 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden border border-indigo-400/30",
                        "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white hover:scale-[1.03] hover:shadow-indigo-500/25",
                        (loading || error) && "opacity-75 cursor-not-allowed hover:scale-100"
                    )}
                >
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-white shrink-0" />
                            <span>Generating Report PDF...</span>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1.5">
                                <FileCheck2 className="h-4 w-4 text-indigo-200 group-hover:scale-110 transition-transform duration-300" />
                                <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
                            </div>
                            <span className="font-extrabold">Download Audit PDF</span>
                            <Download className="h-3.5 w-3.5 text-white/80 group-hover:translate-y-0.5 transition-transform duration-300 ml-0.5" />
                        </>
                    )}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
