import { SearchCode } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-primary/10">
                <SearchCode className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
                No Profiles Found
            </h3>
            <p className="max-w-sm mt-2 text-sm text-muted-foreground">
                Ready to find your next hire? Please initiate a profile search using the
                criteria above to start matching CVs with your job requirements.
            </p>
        </div>
    );
}