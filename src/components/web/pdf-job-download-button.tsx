import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download, FileCheck2, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { JobPDFReport } from './pdf-job-report'
import type { JobDetail } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PDFJobDownloadButtonProps {
  job: JobDetail
  variant?: 'default' | 'outline' | 'secondary'
  className?: string
}

export function PDFJobDownloadButton({
  job,
  variant = 'default',
  className,
}: PDFJobDownloadButtonProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className={cn(
          'gap-2 rounded-xl text-xs font-bold border-border/60 bg-muted/30 h-9',
          className,
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        Preparing PDF...
      </Button>
    )
  }

  const document = <JobPDFReport job={job} />
  const safeTitle = (job.job_title || 'Position').replace(/[^a-zA-Z0-9]/g, '_')
  const fileName = `Job_Requisition_${safeTitle}_${job.job_id || 'REQ'}.pdf`

  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading, error }) => (
        <Button
          variant={variant}
          size="sm"
          disabled={loading || Boolean(error)}
          className={cn(
            'relative group gap-2 rounded-xl text-xs font-bold px-3.5 h-9 transition-all duration-300 shadow-md cursor-pointer overflow-hidden border border-indigo-500/30',
            'bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white hover:scale-[1.02] hover:shadow-indigo-500/25',
            (loading || error) &&
              'opacity-75 cursor-not-allowed hover:scale-100',
            className,
          )}
        >
          {/* Ambient Hover Shine */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white shrink-0" />
              <span>Building PDF...</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <FileCheck2 className="h-3.5 w-3.5 text-indigo-200 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="h-2.5 w-2.5 text-amber-300 animate-pulse" />
              </div>
              <span>Download Requisition PDF</span>
              <Download className="h-3.5 w-3.5 text-white/80 group-hover:translate-y-0.5 transition-transform duration-300 ml-0.5" />
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
