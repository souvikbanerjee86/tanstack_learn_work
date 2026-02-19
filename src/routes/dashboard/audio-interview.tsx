import { interactWithAgent } from '@/lib/dialogflow-server';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react';
import { Send, Mic, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from '@/components/ui/scroll-area';
export const Route = createFileRoute('/dashboard/audio-interview')({
    component: RouteComponent,
})

function RouteComponent() {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sessionId, setSessionId] = useState('');

    // Refs for Audio
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    useEffect(() => {
        setSessionId(crypto.randomUUID())
    }, [])

    const handleResponse = (response: { text: string; audio: string | null }) => {

        if (response.text) {
            setMessages((prev) => [...prev, { role: 'bot', text: response.text }]);
        }
        // Play Audio
        if (response.audio) {
            const audioSrc = `data:audio/mp3;base64,${response.audio}`;
            const audio = new Audio(audioSrc);
            audio.play().catch(e => console.log("Autoplay blocked:", e));
        }
    };

    const handleTextSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isProcessing) return;

        const textToSend = inputText;
        setInputText(''); // Clear input immediately
        setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('text', textToSend);
        formData.append('sessionId', sessionId); // Use real session ID in prod

        try {
            const response = await interactWithAgent({ data: formData });
            handleResponse(response);
        } catch (error) {
            console.error('Text Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- MODE 2: AUDIO RECORDING ---
    const startRecording = async () => {
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

        // UI Update
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

    return (
        <div className="flex flex-col h-[90dvh] w-[60dvw] overflow-y-auto mx-auto bg-background shadow-2xl border-x">
            {/* --- Header --- */}
            <header className="p-4 border-b bg-card flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-bold text-sm tracking-tight">AI Interviewer</h1>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">Live Session</span>
                    </div>
                </div>
            </header>

            {/* --- Chat Area --- */}
            <ScrollArea className="flex-1 w-full bg-muted/30">
                <div className="p-4 flex flex-col gap-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    // Use max-w-[85%] and break-words to prevent horizontal overflow
                                    "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-card border text-card-foreground rounded-bl-none"
                                )}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* --- Input Area --- */}
            <footer className="p-4 bg-background border-t">
                <div className="flex items-center gap-2">
                    <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your answer..."
                            disabled={isProcessing || isRecording}
                            className="rounded-full bg-muted/50 border-none focus-visible:ring-primary h-11 px-5"
                        />

                        {/* Send Button */}
                        {inputText.trim() && (
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isProcessing}
                                className="rounded-full shrink-0 h-11 w-11 transition-all"
                            >
                                <Send className="w-5 h-5" />
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
                            disabled={isProcessing}
                            variant={isRecording ? "destructive" : "secondary"}
                            size="icon"
                            className={cn(
                                "rounded-full shrink-0 h-11 w-11 transition-all duration-300",
                                isRecording && "scale-125 animate-pulse ring-4 ring-destructive/20"
                            )}
                        >
                            <Mic className={cn("w-5 h-5", isRecording && "fill-current")} />
                        </Button>
                    )}
                </div>

                {/* Feedback text */}
                <div className="h-6 flex items-center justify-center mt-1">
                    {isRecording && (
                        <span className="text-[10px] font-bold text-destructive animate-bounce uppercase tracking-widest">
                            Recording Audio...
                        </span>
                    )}
                </div>
            </footer>
        </div>
    )
}
