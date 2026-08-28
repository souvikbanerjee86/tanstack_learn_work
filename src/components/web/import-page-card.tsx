import { format } from 'date-fns'
import { Database, FileCheck, History } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import type { RagProcessRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ImportPageCardProps {
  cardDescription: string
  processedCount: number | string
  footerDescription: string
  processedIndexFiles: Array<RagProcessRecord>
}

export function ImportPageCard({
  cardDescription,
  processedCount,
  footerDescription,
  processedIndexFiles,
}: ImportPageCardProps) {
  const isLastIndex = cardDescription === 'Last Processed Index'
  const isTotalFiles = cardDescription === 'Total Processed Files'
  const isTotalIndexes = cardDescription === 'Total Processed Indexes'

  const lastRunDate =
    processedIndexFiles && processedIndexFiles[0]
      ? format(new Date(processedIndexFiles[0].processed_at), 'MMM d, h:mm a')
      : 'Never'

  const getTheme = () => {
    if (isTotalIndexes) {
      return {
        icon: Database,
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
        border: 'border-indigo-500/20',
        glow: 'from-indigo-500/10 to-transparent',
        watermark: 'text-indigo-500',
      }
    }
    if (isTotalFiles) {
      return {
        icon: FileCheck,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
        border: 'border-emerald-500/20',
        glow: 'from-emerald-500/10 to-transparent',
        watermark: 'text-emerald-500',
      }
    }
    return {
      icon: History,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10 dark:bg-violet-500/15',
      border: 'border-violet-500/20',
      glow: 'from-violet-500/10 to-transparent',
      watermark: 'text-violet-500',
    }
  }

  const theme = getTheme()
  const Icon = theme.icon

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group">
      {/* Ambient Corner Glow */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-32 h-32 bg-linear-to-br rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none',
          theme.glow,
        )}
      />

      {/* Subtle Watermark Icon */}
      <div
        className={cn(
          'absolute bottom-[-10px] right-[-10px] h-24 w-24 opacity-[0.04] dark:opacity-[0.06] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none',
          theme.watermark,
        )}
      >
        <Icon className="h-full w-full" />
      </div>

      <CardHeader className="p-6 md:p-7 space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'h-9 w-9 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105',
                theme.bg,
                theme.border,
                theme.color,
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground/80">
              {cardDescription}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight text-foreground tabular-nums">
            {isLastIndex
              ? processedIndexFiles[0]?.date || 'None'
              : processedCount}
          </CardTitle>

          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <span className="opacity-80">
              {footerDescription}{' '}
              <strong className="font-semibold text-foreground/80">
                {lastRunDate}
              </strong>
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
