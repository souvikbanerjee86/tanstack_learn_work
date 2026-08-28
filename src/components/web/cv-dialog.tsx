import { ExternalLink, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'

export function CVDialog({
  isOpen,
  setIsOpen,
  fileUrl,
  fileName,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  fileUrl: string
  fileName?: string
}) {
  const decodedUrl = fileUrl ? decodeURIComponent(fileUrl) : ''

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[95vw] sm:max-w-[80vw] lg:max-w-[70vw] h-[88vh] p-0 overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-2xl shadow-black/20">
        <div className="flex flex-col h-full bg-background">
          <DialogHeader className="p-4 sm:p-6 border-b border-border/40 bg-muted/30 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-sm">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-black tracking-tight truncate">
                  {fileName || 'Candidate Resume'}
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  Original document preview
                </p>
              </div>
            </div>

            {decodedUrl && (
              <a href={decodedUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-xl text-xs font-bold border-border/60 hover:bg-primary/5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open in New Tab</span>
                </Button>
              </a>
            )}
          </DialogHeader>

          <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950 relative">
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
