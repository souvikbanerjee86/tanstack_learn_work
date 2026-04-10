import { SearchCode, Sparkles } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-center border-2 border-dashed rounded-3xl bg-muted/5 shadow-inner relative overflow-hidden group">
            {/* Background Decorative Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-500" />
            
            <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5 group-hover:scale-105 transition-transform duration-500">
                    <SearchCode className="w-12 h-12 text-primary animate-pulse" />
                </div>
                {/* Floaties */}
                <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 shadow-md border animate-bounce delay-700">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
            </div>

            <h3 className="mt-8 text-2xl font-black text-foreground tracking-tight">
                No Data Found
            </h3>
            <p className="max-w-md mt-4 text-base text-muted-foreground leading-relaxed">
                Start your discovery journey by initiating a profile search. Our <span className="text-primary font-bold">AI assistant</span> will analyze your criteria to find the perfect matches for your team.
            </p>
            
            <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                <div className="h-px w-8 bg-muted" />
                Select a store date and click search
                <div className="h-px w-8 bg-muted" />
            </div>
        </div>
    );
}