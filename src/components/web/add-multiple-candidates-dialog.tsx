import { useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileText,
  Files,
  Loader2,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import type { ChangeEvent, DragEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { addMultipleCandidates, getJobDetails } from '@/lib/server-function'

export interface ResumeFileItem {
  id: string
  file: File
  status: 'idle' | 'uploading' | 'success' | 'error'
  errorMessage?: string
}

interface AddMultipleCandidatesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMultipleCandidatesDialog({
  open,
  onOpenChange,
}: AddMultipleCandidatesDialogProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Job selection
  const [selectedJobId, setSelectedJobId] = useState<string>('')

  // Resume files list
  const [resumeFiles, setResumeFiles] = useState<Array<ResumeFileItem>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Query jobs
  const { data: jobDetails, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () =>
      getJobDetails({ data: { limit: null, status: null, last_doc_id: null } }),
  })

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId)
  }

  const processFiles = (files: FileList | Array<File>) => {
    const newItems: Array<ResumeFileItem> = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file: file,
      status: 'idle' as const,
    }))

    setResumeFiles((prev) => [...prev, ...newItems])
    toast.info(
      `Added ${newItems.length} resume file${newItems.length > 1 ? 's' : ''}`,
    )
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveFile = (id: string) => {
    setResumeFiles((prev) => prev.filter((item) => item.id !== id))
  }

  const handleClearAll = () => {
    setResumeFiles([])
  }

  const handleStartBatchUpload = async () => {
    if (!selectedJobId) {
      toast.error('Please select a target position first')
      return
    }

    if (resumeFiles.length === 0) {
      toast.error('Please select at least one resume file')
      return
    }

    setIsProcessing(true)

    // Set all idle/error items to uploading
    setResumeFiles((prev) =>
      prev.map((f) => ({ ...f, status: 'uploading', errorMessage: undefined })),
    )

    try {
      const formData = new FormData()
      formData.append('job_id', selectedJobId)
      resumeFiles.forEach((item) => {
        formData.append('files', item.file)
      })

      const response = await addMultipleCandidates({ data: formData })

      const uploadedSet = new Set(response.uploaded_files || [])
      const failedMap = new Map(
        (response.failed_files || []).map((f) => [f.filename, f.reason]),
      )

      setResumeFiles((prev) =>
        prev.map((item) => {
          if (uploadedSet.has(item.file.name)) {
            return { ...item, status: 'success' }
          } else if (failedMap.has(item.file.name)) {
            return {
              ...item,
              status: 'error',
              errorMessage: failedMap.get(item.file.name),
            }
          } else {
            return { ...item, status: 'success' }
          }
        }),
      )

      if (response.uploaded_files && response.uploaded_files.length > 0) {
        await queryClient.invalidateQueries({ queryKey: ['candidates'] })
        toast.success(
          `Successfully uploaded ${response.uploaded_files.length} resume${response.uploaded_files.length > 1 ? 's' : ''}!`,
        )
      }

      if (response.failed_files && response.failed_files.length > 0) {
        toast.error(
          `${response.failed_files.length} file${response.failed_files.length > 1 ? 's' : ''} failed to upload`,
        )
      } else {
        // Auto close on complete success
        setTimeout(() => {
          onOpenChange(false)
          handleClearAll()
        }, 1200)
      }
    } catch (err: any) {
      console.error('Batch CV upload error:', err)
      toast.error(err?.message || 'Failed to upload resumes')
      setResumeFiles((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'error',
          errorMessage: err?.message || 'Upload failed',
        })),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const allCompleted =
    resumeFiles.length > 0 && resumeFiles.every((f) => f.status === 'success')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[94vw] md:w-[75vw] lg:w-[50vw] lg:max-w-[50vw] max-h-[92vh] flex flex-col p-0 gap-0 rounded-3xl border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* --- Ambient Background Glow --- */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* --- Dialog Header --- */}
        <DialogHeader className="p-6 md:p-8 pb-5 border-b border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-inner relative overflow-hidden group">
                <Files className="h-6 w-6 text-indigo-600 dark:text-indigo-400 relative z-10" />
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">
                    Upload Multiple Resumes
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 text-[9px] font-black uppercase tracking-widest"
                  >
                    Bulk Upload
                  </Badge>
                </div>
                <DialogDescription className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  Select the job position and attach candidate resumes for bulk
                  processing.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* --- Dialog Main Content Area --- */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Position Selection */}
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                <Briefcase className="h-4 w-4 text-indigo-500" />
                Target Job Opening <span className="text-destructive">*</span>
              </div>
              {selectedJobId && (
                <Badge variant="secondary" className="text-[10px] font-bold">
                  ID: {selectedJobId}
                </Badge>
              )}
            </div>

            <Select
              value={selectedJobId}
              onValueChange={handleSelectJob}
              disabled={isProcessing}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background border-border/60 focus:ring-indigo-500/20">
                <SelectValue
                  placeholder={
                    isLoadingJobs
                      ? 'Loading active positions...'
                      : 'Select position for these resumes...'
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-xl max-h-60">
                {jobDetails?.data && jobDetails.data.length > 0 ? (
                  jobDetails.data.map((job) => (
                    <SelectItem
                      key={job.job_id}
                      value={job.job_id}
                      className="rounded-lg py-2.5"
                    >
                      <div className="flex items-center justify-between w-full gap-4">
                        <span className="font-semibold">{job.job_title}</span>
                        <span className="text-[10px] opacity-60 uppercase tracking-wider font-mono">
                          {job.job_id}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground italic">
                    No active job postings found.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                : 'border-border/80 hover:border-indigo-500/50 bg-card/50 hover:bg-muted/20'
            } ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform">
              <UploadCloud className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-base font-bold tracking-tight">
              Drop multiple resumes here, or{' '}
              <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4">
                browse files
              </span>
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Supports PDF and DOCX files. Multiple files can be selected at
              once.
            </p>
          </div>

          {/* Selected Resumes List */}
          {resumeFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <Files className="h-4 w-4 text-indigo-500" />
                  Selected Resumes ({resumeFiles.length})
                </div>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-8 px-3 rounded-lg text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="border border-border/60 rounded-2xl overflow-hidden bg-card/40">
                <ScrollArea className="max-h-[260px]">
                  <div className="divide-y divide-border/40">
                    {resumeFiles.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 px-4 transition-colors flex items-center justify-between gap-3 ${
                          item.status === 'success'
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                            : item.status === 'error'
                              ? 'bg-rose-500/5 dark:bg-rose-500/10'
                              : 'hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate">
                              {item.file.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {(item.file.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {item.status === 'uploading' && (
                            <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-medium">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="hidden sm:inline text-[10px]">
                                Uploading
                              </span>
                            </div>
                          )}
                          {item.status === 'success' && (
                            <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="hidden sm:inline text-[10px]">
                                Uploaded
                              </span>
                            </div>
                          )}
                          {item.status === 'error' && (
                            <div
                              className="flex items-center gap-1 text-xs text-rose-500 font-medium"
                              title={item.errorMessage}
                            >
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-[10px]">
                                {item.errorMessage || 'Failed'}
                              </span>
                            </div>
                          )}

                          {item.status !== 'success' && !isProcessing && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleRemoveFile(item.id)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* --- Dialog Footer --- */}
        <DialogFooter className="p-6 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            {resumeFiles.length > 0 ? (
              <span>
                <strong className="text-foreground">
                  {resumeFiles.length}
                </strong>{' '}
                resume{resumeFiles.length !== 1 ? 's' : ''} selected
              </span>
            ) : (
              <span>No resumes selected</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="rounded-xl px-5 h-11 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartBatchUpload}
              disabled={
                isProcessing ||
                resumeFiles.length === 0 ||
                !selectedJobId ||
                allCompleted
              }
              className="h-11 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : allCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Upload Completed
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Upload {resumeFiles.length} Resume
                  {resumeFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
