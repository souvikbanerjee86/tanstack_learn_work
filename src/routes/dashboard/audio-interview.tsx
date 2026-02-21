import { interactWithAgent } from '@/lib/dialogflow-server';
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Mic, Bot, User, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserFn } from '@/lib/auth';
import { NavUserProps } from '@/lib/types';

export const Route = createFileRoute('/dashboard/audio-interview')({
    loader: async () => {
        const user = await getUserFn()
        return { user }
    },
    component: RouteComponent,
})

const TOTAL_INTERVIEW_TIME = 45 * 60; // 45 minutes in seconds
const WARNING_THRESHOLD = 5 * 60; // 5 minutes in seconds

/* ─── Circular Timer Ring ─── */
function TimerRing({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / totalTime;
    const strokeDashoffset = circumference * (1 - progress);
    const isWarning = timeLeft <= WARNING_THRESHOLD && timeLeft > 0;
    const isExpired = timeLeft <= 0;

    const minutes = Math.max(0, Math.floor(timeLeft / 60));
    const seconds = Math.max(0, timeLeft % 60);

    return (
        <div className="relative flex items-center justify-center">
            <svg
                className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90"
                viewBox="0 0 100 100"
            >
                {/* Background track */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="6"
                />
                {/* Progress arc */}
                <circle
                    cx="50" cy="50" r={radius}
                    fill="none"
                    className={cn(
                        "transition-all duration-1000 ease-linear",
                        isExpired
                            ? "stroke-destructive"
                            : isWarning
                                ? "stroke-destructive animate-pulse"
                                : "stroke-primary"
                    )}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            {/* Timer text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className={cn(
                        "text-lg sm:text-xl font-bold tabular-nums tracking-tight",
                        isExpired
                            ? "text-destructive"
                            : isWarning
                                ? "text-destructive animate-pulse"
                                : "text-foreground"
                    )}
                >
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                    remaining
                </span>
            </div>
        </div>
    );
}

/* ─── Video Avatar Circle ─── */
function VideoCircle({
    label,
    sublabel,
    gradientFrom,
    gradientTo,
    icon: Icon,
    isActive = false,
}: {
    label: string;
    sublabel: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ElementType;
    isActive?: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            {/* Outer glow ring */}
            <div
                className={cn(
                    "relative rounded-full p-1 transition-all duration-500",
                    isActive
                        ? "bg-linear-to-br from-primary/40 to-primary/10 shadow-[0_0_24px_rgba(var(--primary),0.25)]"
                        : "bg-linear-to-br from-border to-border/50"
                )}
            >
                {/* Inner circle with gradient placeholder */}
                <div
                    className={cn(
                        "w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center relative overflow-hidden",
                        "shadow-inner"
                    )}
                    style={{
                        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                    }}
                >
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white/90 drop-shadow-lg" />

                    {/* Active pulse ring */}
                    {isActive && (
                        <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    )}
                </div>
            </div>

            {/* Label */}
            <div className="text-center">
                <p className="text-xs sm:text-sm font-semibold text-foreground">{label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{sublabel}</p>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "w-2 h-2 rounded-full",
                        isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"
                    )}
                />
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
                    {isActive ? "Live" : "Standby"}
                </span>
            </div>
        </div>
    );
}

/* ─── Time's Up Banner ─── */
function TimesUpBanner() {
    return (
        <div className="mx-4 mt-2 mb-1 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="shrink-0 rounded-full bg-destructive/20 p-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
                <p className="text-sm font-semibold text-destructive">Time's Up!</p>
                <p className="text-xs text-muted-foreground">
                    The interview session has ended. Thank you for participating.
                </p>
            </div>
        </div>
    );
}

/* ─── Main Route Component ─── */
function RouteComponent() {
    const { user }: { user: NavUserProps } = Route.useLoaderData()
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [timeLeft, setTimeLeft] = useState(TOTAL_INTERVIEW_TIME);
    const [isTimeUp, setIsTimeUp] = useState(false);

    // Refs for Audio
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Set session ID
    useEffect(() => {
        setSessionId(user.user_id.concat("#").concat(user.email))
    }, [user])

    // ─── Countdown Timer ───
    const handleTimeUp = useCallback(() => {
        setIsTimeUp(true);
        setIsProcessing(false);

        // Stop any active recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }

        // Add system message
        setMessages((prev) => [
            ...prev,
            { role: 'system', text: '⏰ Interview time has ended. The session is now closed.' },
        ]);
    }, []);

    useEffect(() => {
        if (isTimeUp) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isTimeUp, handleTimeUp]);

    // ─── Response Handler ───
    const handleResponse = (response: { text: string; audio: string | null }) => {
        if (response.text) {
            setMessages((prev) => [...prev, { role: 'bot', text: response.text }]);
        }
        if (response.audio) {
            const audioSrc = `data:audio/mp3;base64,${response.audio}`;
            const audio = new Audio(audioSrc);
            audio.play().catch(e => console.log("Autoplay blocked:", e));
        }
    };

    // ─── Text Submit ───
    const handleTextSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isProcessing || isTimeUp) return;

        const textToSend = inputText;
        setInputText('');
        setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('text', textToSend);
        formData.append('sessionId', sessionId);

        try {
            const response = await interactWithAgent({ data: formData });
            handleResponse(response);
        } catch (error) {
            console.error('Text Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // ─── Audio Recording ───
    const startRecording = async () => {
        if (isTimeUp) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = handleAudioStop;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Mic Error:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleAudioStop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        setMessages((prev) => [...prev, { role: 'user', text: '🎤 (Voice Message)' }]);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'input.webm');
        formData.append('sessionId', sessionId);

        try {
            const response = await interactWithAgent({ data: formData });
            handleResponse(response);
        } catch (error) {
            console.error('Audio Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const isInputDisabled = isProcessing || isRecording || isTimeUp;

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-background overflow-hidden">

            {/* ─── Top Panel: Video Avatars + Timer ─── */}
            <div className="shrink-0 border-b bg-card/50 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-sm tracking-tight text-foreground">AI Interview Session</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] text-muted-foreground uppercase font-medium tracking-wide">
                                    {isTimeUp ? 'Session Ended' : 'Live Session'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-medium tracking-wider">45 Min</span>
                    </div>
                </div>

                {/* Avatars + Timer Row */}
                <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-16 px-4 py-5 sm:py-6">
                    <VideoCircle
                        label="AI Interviewer"
                        sublabel="Powered by AI"
                        gradientFrom="#6366f1"
                        gradientTo="#8b5cf6"
                        icon={Bot}
                        isActive={!isTimeUp}
                    />

                    <TimerRing timeLeft={timeLeft} totalTime={TOTAL_INTERVIEW_TIME} />

                    <VideoCircle
                        label="You"
                        sublabel={user.email?.split('@')[0] || 'Candidate'}
                        gradientFrom="#f59e0b"
                        gradientTo="#ef4444"
                        icon={User}
                        isActive={isRecording}
                    />
                </div>
            </div>

            {/* ─── Time's Up Banner ─── */}
            {isTimeUp && <TimesUpBanner />}

            {/* ─── Chat Area ─── */}
            <ScrollArea className="flex-1 w-full bg-linear-to-b from-muted/20 to-background">
                <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-base font-semibold text-foreground mb-1">Ready to Begin</h2>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Type a message or hold the mic button to start your interview.
                            </p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === 'user'
                                    ? 'justify-end'
                                    : msg.role === 'system'
                                        ? 'justify-center'
                                        : 'justify-start'
                            )}
                        >
                            {msg.role === 'system' ? (
                                <div className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                                    {msg.text}
                                </div>
                            ) : (
                                <div className="flex items-end gap-2 max-w-[85%]">
                                    {/* Bot avatar */}
                                    {msg.role === 'bot' && (
                                        <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                                            <Bot className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "px-4 py-2.5 rounded-2xl text-sm shadow-sm wrap-break-word",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-card border text-card-foreground rounded-bl-sm"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    {/* User avatar */}
                                    {msg.role === 'user' && (
                                        <div className="shrink-0 w-7 h-7 rounded-full bg-linear-to-br from-amber-500 to-red-500 flex items-center justify-center shadow-sm">
                                            <User className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* ─── Input Area ─── */}
            <footer className="shrink-0 border-t bg-card/80 backdrop-blur-md">
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isTimeUp ? "Session ended" : "Type your answer..."}
                                disabled={isInputDisabled}
                                className="rounded-full bg-muted/50 border-none focus-visible:ring-primary h-11 px-5 text-sm"
                            />
                            {/* Send Button */}
                            {inputText.trim() && (
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isInputDisabled}
                                    className="rounded-full shrink-0 h-11 w-11 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            )}
                        </form>

                        {/* Mic Button */}
                        {!inputText.trim() && (
                            <Button
                                onMouseDown={startRecording}
                                onMouseUp={stopRecording}
                                onTouchStart={startRecording}
                                onTouchEnd={stopRecording}
                                disabled={isProcessing || isTimeUp}
                                variant={isRecording ? "destructive" : "secondary"}
                                size="icon"
                                className={cn(
                                    "rounded-full shrink-0 h-11 w-11 transition-all duration-300 shadow-md",
                                    isRecording && "scale-125 animate-pulse ring-4 ring-destructive/20"
                                )}
                            >
                                <Mic className={cn("w-4 h-4", isRecording && "fill-current")} />
                            </Button>
                        )}
                    </div>

                    {/* Feedback text */}
                    <div className="h-5 flex items-center justify-center mt-1">
                        {isRecording && (
                            <span className="text-[10px] font-bold text-destructive animate-bounce uppercase tracking-widest">
                                Recording Audio...
                            </span>
                        )}
                        {isProcessing && !isRecording && (
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest animate-pulse">
                                Processing...
                            </span>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    )
}
