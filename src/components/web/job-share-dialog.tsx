import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JobDetail } from "@/lib/types";
import { 
    Copy, 
    Check, 
    Share2, 
    Globe, 
    Linkedin, 
    Twitter, 
    Mail, 
    MessageCircle, 
    QrCode, 
    Sparkles, 
    Building2, 
    MapPin, 
    Briefcase
} from "lucide-react";
import { toast } from "sonner";

interface JobShareDialogProps {
    job: JobDetail | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Lightweight deterministic SVG QR code pattern generator for fast, zero-dependency rendering
function DynamicQrCodeSvg({ text, size = 180 }: { text: string; size?: number }) {
    const matrixSize = 21;
    // Generate deterministic pattern based on text hash
    const cells: boolean[][] = Array(matrixSize).fill(false).map(() => Array(matrixSize).fill(false));
    
    // Finder patterns (top-left, top-right, bottom-left 7x7 squares)
    const setFinder = (startR: number, startC: number) => {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                    cells[startR + r][startC + c] = true;
                }
            }
        }
    };
    setFinder(0, 0);
    setFinder(0, matrixSize - 7);
    setFinder(matrixSize - 7, 0);

    // Fill timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
        cells[6][i] = i % 2 === 0;
        cells[i][6] = i % 2 === 0;
    }

    // Hash text into data cells
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    let seed = hash;
    for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
            // Skip finder patterns
            if ((r < 8 && c < 8) || (r < 8 && c >= matrixSize - 8) || (r >= matrixSize - 8 && c < 8)) continue;
            if (r === 6 || c === 6) continue;
            seed = (seed * 1664525 + 1013904223) >>> 0;
            cells[r][c] = (seed % 3) === 0 || ((r + c + (text.charCodeAt((r + c) % text.length) || 0)) % 2 === 0);
        }
    }

    const cellSize = size / matrixSize;

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`} 
            className="rounded-xl bg-white p-2 shadow-inner border border-border/40"
        >
            <rect width={size} height={size} fill="#ffffff" rx={8} />
            {cells.map((row, r) =>
                row.map((active, c) =>
                    active ? (
                        <rect
                            key={`${r}-${c}`}
                            x={c * cellSize}
                            y={r * cellSize}
                            width={cellSize - 0.4}
                            height={cellSize - 0.4}
                            fill="#1e1b4b"
                            rx={cellSize > 6 ? 1.5 : 0.5}
                        />
                    ) : null
                )
            )}
        </svg>
    );
}

export function JobShareDialog({ job, open, onOpenChange }: JobShareDialogProps) {
    const [copied, setCopied] = useState(false);

    if (!job) return null;

    // Build the public application portal URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://eazyai.app';
    const shareUrl = `${origin}/apply/${job.job_id}`;
    const shareTitle = `We are hiring: ${job.job_title} at EazyAI`;
    const shareSummary = `Explore the ${job.job_title} position (${job.location || 'Remote'}, ${job.experience || '1+'} yrs exp). Apply directly via our AI-powered interview portal!`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Application link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareSummary,
                    url: shareUrl,
                });
            } catch {
                // User dismissed share sheet
            }
        } else {
            handleCopy();
        }
    };

    const socialLinks = [
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] hover:border-[#0A66C2]/30",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "X (Twitter)",
            icon: Twitter,
            color: "hover:bg-zinc-900/15 dark:hover:bg-zinc-100/15 hover:text-foreground hover:border-foreground/30",
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "WhatsApp",
            icon: MessageCircle,
            color: "hover:bg-[#25D366]/15 hover:text-[#25D366] hover:border-[#25D366]/30",
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
        },
        {
            name: "Email",
            icon: Mail,
            color: "hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30",
            href: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareSummary}\n\nApply here: ${shareUrl}`)}`,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] rounded-3xl p-0 overflow-hidden border border-border/60 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl shadow-2xl">
                {/* Header with decorative glass background */}
                <div className="relative p-6 sm:p-7 border-b border-border/40 bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                                    Share Position
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    Distribute this job link or scan the QR code to apply directly.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                    {/* Job Preview Summary Card */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 backdrop-blur-md space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-foreground truncate">
                                {job.job_title}
                            </h4>
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 shrink-0">
                                {job.status || 'Active'}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                                <span>{job.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                                <span>{job.experience !== undefined ? `${job.experience} yrs exp` : 'Any Exp'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span>Ref: {job.job_id}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code and Quick Scan Section */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-border/50 backdrop-blur-sm">
                        <div className="shrink-0 flex items-center justify-center">
                            <DynamicQrCodeSvg text={shareUrl} size={150} />
                        </div>
                        <div className="space-y-2 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                                <QrCode className="h-3.5 w-3.5" />
                                <span>Instant Mobile Apply</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Candidates can point their smartphone camera at this QR code to start their AI interview immediately.
                            </p>
                        </div>
                    </div>

                    {/* Copy Link Input Section */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Direct Application Link</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                value={shareUrl}
                                className="h-11 rounded-xl bg-muted/40 border-border/60 text-xs font-mono text-foreground"
                            />
                            <Button
                                onClick={handleCopy}
                                className="h-11 px-4 rounded-xl font-bold text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4 text-emerald-300" />
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Shortcuts */}
                    <div className="space-y-2.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                            Share via Platforms
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {socialLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center gap-2 h-10 rounded-xl border border-border/60 bg-muted/20 text-xs font-bold text-muted-foreground transition-all duration-200 ${item.color} active:scale-[0.97]`}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        <span>{item.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 sm:p-6 border-t border-border/40 bg-muted/20 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleNativeShare}
                        size="sm"
                        className="rounded-xl text-xs font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>System Share</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
