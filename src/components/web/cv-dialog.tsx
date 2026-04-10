import { FileText, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";

export function CVDialog({ isOpen, setIsOpen, fileUrl }: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    fileUrl: string
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-[70vw] h-[90vh] p-0 overflow-hidden rounded-3xl border-none shadow-2xl'>
                <div className="flex flex-col h-full bg-background">
                    <DialogHeader className="p-6 border-b bg-muted/20 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black tracking-tight">Candidate Resume</DialogTitle>
                                <p className="text-xs text-muted-foreground font-medium">Viewing original document</p>
                            </div>
                        </div>
                    </DialogHeader>
                    
                    <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-900 relative">
                        <iframe
                            key={fileUrl}
                            src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                            className="w-full h-full border-none"
                            title="Resume Viewer"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}