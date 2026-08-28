import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Columns,
  ExternalLink,
  FileText,
  Gauge,
  Loader2,
  User,
} from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import type { CandidateMatch } from '@/lib/types'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function CandidateResultCard({
  data,
  selectedItems,
  handleCheckedChange,
  downlaodUrl,
  isDownloading,
  onCompare,
}: {
  data: CandidateMatch
  selectedItems: Array<string>
  handleCheckedChange: (id: string, checked: boolean) => void
  downlaodUrl: (url: string) => void
  isDownloading: boolean
  onCompare?: () => void
}) {
  const isSelected = selectedItems.includes(data.candidate_email)

  return (
    <div className="group relative">
      <Card
        className={cn(
          'w-full border shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl',
          isSelected
            ? 'border-indigo-500/60 bg-indigo-50/20 dark:bg-indigo-950/20 ring-1 ring-indigo-500/30'
            : 'border-border/60 hover:border-indigo-500/30',
        )}
      >
        {/* Visual Match Accent Bar */}
        <div
          className={cn(
            'absolute top-0 left-0 w-1.5 h-full transition-all duration-300',
            data.matched_score > 80
              ? 'bg-emerald-500'
              : data.matched_score > 60
                ? 'bg-amber-500'
                : 'bg-indigo-500',
          )}
        />

        <CardHeader className="pb-4 pt-6 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex gap-4 sm:gap-5 min-w-0">
              <div className="relative shrink-0">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl sm:text-2xl font-black tracking-tight mb-1 truncate text-foreground">
                  {data.candidate_name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="h-3.5 w-3.5" />
                    {data.seniority_level}
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {data.years_of_experience} Years Experience
                  </div>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground/70 font-mono">
                  <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
                  <span className="truncate">
                    {data.source_ref.split('/').pop()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
              <div className="relative">
                <div
                  className={cn(
                    'px-3.5 py-1.5 rounded-2xl backdrop-blur-md border shadow-sm flex items-center gap-2.5',
                    data.matched_score > 80
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : data.matched_score > 60
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
                  )}
                >
                  <Gauge className="h-4 w-4 opacity-80" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                      Match
                    </span>
                    <span className="text-lg font-black tabular-nums">
                      {data.matched_score}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border transition-all duration-300',
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-muted/40 border-border/60 hover:border-indigo-500/30',
                )}
              >
                <Checkbox
                  id={`check-${data.candidate_email}`}
                  className={cn(
                    'h-4 w-4 rounded-md border-2',
                    isSelected && 'bg-white border-white text-indigo-600',
                  )}
                  checked={isSelected}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckedChange(data.candidate_email, checked)
                  }
                />
                <Label
                  htmlFor={`check-${data.candidate_email}`}
                  className="text-xs font-bold uppercase tracking-wider cursor-pointer select-none"
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 sm:px-8 pb-6">
          {/* Summary Section */}
          <div className="relative bg-muted/20 rounded-2xl p-4 sm:p-5 border border-border/40">
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {data.summary}
            </p>
          </div>

          {/* Primary Skills */}
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">
              Core Capabilities & Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {data.primary_skills &&
                data.primary_skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-indigo-500/5 border-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-xl text-xs font-semibold hover:bg-indigo-500/10 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>

          <Separator className="opacity-40" />

          {/* Alignment & Clarification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/15">
              <h4 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Strong Alignment
              </h4>
              <ul className="space-y-1.5">
                {data.matched_criteria &&
                  data.matched_criteria.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground font-medium leading-relaxed"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 opacity-60" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {data.missing_information &&
              data.missing_information.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-500/15">
                  <h4 className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5" /> Areas to Verify
                  </h4>
                  <ul className="space-y-1.5">
                    {data.missing_information.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground font-medium leading-relaxed"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5 opacity-60" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/30 p-4 px-6 sm:px-8 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-border/40">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 opacity-60" />
              <span>
                Notice:{' '}
                <strong className="text-foreground">
                  {data.notice_period || 'Immediate'}
                </strong>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onCompare && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={onCompare}
              >
                <Columns className="h-3.5 w-3.5" />
                <span>Compare with Job</span>
              </Button>
            )}
            <Button
              disabled={isDownloading}
              size="sm"
              variant="outline"
              className="h-8 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                downlaodUrl(
                  data.source_ref.substring(
                    data.source_ref.indexOf('uploads/'),
                  ),
                )
              }}
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              <span>View Resume</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
