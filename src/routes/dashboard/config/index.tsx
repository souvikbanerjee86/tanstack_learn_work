import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import {
  Calendar,
  Check,
  Clock,
  HelpCircle,
  Hourglass,
  Loader2,
  Settings2,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react'
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { configSchema } from '@/schemas/evaluate'
import { getSiteConfig, saveSiteConfig } from '@/lib/server-function'
import { ConfigSkeleton } from '@/components/web/config-skeleton'
import { cn } from '@/lib/utils'

export const siteConfigQueryOptions = queryOptions({
  queryKey: ['site-config'],
  queryFn: () => getSiteConfig(),
})

export const Route = createFileRoute('/dashboard/config/')({
  beforeLoad: ({ context }) => {
    return { role: context.role?.role }
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(siteConfigQueryOptions)
  },
  component: RouteComponent,
})

type ConfigForm = z.infer<typeof configSchema>

function RouteComponent() {
  return (
    <Suspense fallback={<ConfigSkeleton />}>
      <ConfigSuspenseWrapper />
    </Suspense>
  )
}

const DURATION_OPTIONS = ['15', '30', '45', '60', '75', '90']
const VALIDITY_OPTIONS = ['3', '5', '7', '10', '14']
const QUESTION_OPTIONS = ['5', '6', '8', '10', '12', '15']

function ConfigSuspenseWrapper() {
  const queryClient = useQueryClient()
  const { data }: { data: any } = useSuspenseQuery(siteConfigQueryOptions)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialInterviewTime = data?.data?.interviewTime
    ? String(data.data.interviewTime)
    : '45'
  const initialLinkValidity = data?.data?.linkValidity
    ? String(data.data.linkValidity)
    : '5'
  const initialQuestionsCount = data?.data?.questionsCount
    ? String(data.data.questionsCount)
    : '8'

  const form = useForm({
    defaultValues: {
      interviewTime: initialInterviewTime,
      linkValidity: initialLinkValidity,
      questionsCount: initialQuestionsCount,
    } as ConfigForm,
    validators: {
      onChange: configSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        await saveSiteConfig({ data: value })
        toast.success('Configuration saved and applied to interview engine!')
        queryClient.invalidateQueries({ queryKey: ['site-config'] })
      } catch {
        toast.error('Failed to save system configuration')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-14 pb-24 relative overflow-hidden flex flex-col items-center justify-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Glow --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="w-full max-w-5xl space-y-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Settings2 className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Interview Engine Parameters
                </h1>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-2 py-0.5"
                >
                  Global
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                Configure evaluation session duration, token lifespan, and
                prompt density.
              </p>
            </div>
          </div>
        </div>

        {/* 1-Click Assessment Presets */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-border/60 backdrop-blur-xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              1-Click Recommended Presets
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Instantly populate best-practice values
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                form.setFieldValue('interviewTime', '60')
                form.setFieldValue('linkValidity', '3')
                form.setFieldValue('questionsCount', '10')
                toast.success("Applied 'Strict High-Security' preset")
              }}
              className="flex flex-col items-start p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  🛡️ Strict High-Security
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 font-mono">
                60 mins • 10 questions • 3 days
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                form.setFieldValue('interviewTime', '45')
                form.setFieldValue('linkValidity', '5')
                form.setFieldValue('questionsCount', '8')
                toast.success("Applied 'Standard Balanced' preset")
              }}
              className="flex flex-col items-start p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  ⚡ Standard Balanced
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 font-mono">
                45 mins • 8 questions • 5 days
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                form.setFieldValue('interviewTime', '15')
                form.setFieldValue('linkValidity', '7')
                form.setFieldValue('questionsCount', '5')
                toast.success("Applied 'Rapid Screening' preset")
              }}
              className="flex flex-col items-start p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  🚀 Rapid Tech Screening
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 font-mono">
                15 mins • 5 questions • 7 days
              </span>
            </button>
          </div>
        </div>

        {/* --- Configuration Form --- */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-8"
        >
          {/* Main 3 Parameter Dimension Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Interview Duration */}
            <form.Field
              name="interviewTime"
              children={(field) => {
                const currentVal = field.state.value
                return (
                  <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-indigo-500/40 group">
                    <CardHeader className="p-6 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
                          <Clock className="h-5 w-5" />
                        </div>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 border-indigo-500/20"
                        >
                          {currentVal} Mins
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-base font-black tracking-tight text-foreground">
                          Session Duration
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                          Time allotted to complete all questions
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {DURATION_OPTIONS.map((min) => {
                          const isSelected = currentVal === min
                          return (
                            <button
                              key={min}
                              type="button"
                              onClick={() => field.handleChange(min)}
                              className={cn(
                                'h-11 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center',
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                                  : 'bg-muted/40 text-muted-foreground border-border/60 hover:border-indigo-500/30 hover:text-foreground',
                              )}
                            >
                              <span>{min}</span>
                              <span className="text-[9px] font-normal opacity-80">
                                mins
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        <Timer className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          Candidate has {currentVal}m countdown upon starting
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              }}
            />

            {/* 2. Link Validity */}
            <form.Field
              name="linkValidity"
              children={(field) => {
                const currentVal = field.state.value
                return (
                  <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-violet-500/40 group">
                    <CardHeader className="p-6 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-500/20 group-hover:scale-105 transition-transform">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-500/5 border-violet-500/20"
                        >
                          {currentVal} Days
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-base font-black tracking-tight text-foreground">
                          Link Lifespan
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                          Invitation token validity window
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {VALIDITY_OPTIONS.map((days) => {
                          const isSelected = currentVal === days
                          return (
                            <button
                              key={days}
                              type="button"
                              onClick={() => field.handleChange(days)}
                              className={cn(
                                'h-11 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center',
                                isSelected
                                  ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
                                  : 'bg-muted/40 text-muted-foreground border-border/60 hover:border-violet-500/30 hover:text-foreground',
                              )}
                            >
                              <span>{days}</span>
                              <span className="text-[9px] font-normal opacity-80">
                                days
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400">
                        <Hourglass className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          Link expires automatically after {currentVal} days
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              }}
            />

            {/* 3. Question Density */}
            <form.Field
              name="questionsCount"
              children={(field) => {
                const currentVal = field.state.value
                return (
                  <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-teal-500/40 group">
                    <CardHeader className="p-6 pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-105 transition-transform">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/5 border-teal-500/20"
                        >
                          {currentVal} Prompts
                        </Badge>
                      </div>
                      <div>
                        <CardTitle className="text-base font-black tracking-tight text-foreground">
                          Question Density
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground font-medium mt-0.5">
                          Total questions presented to candidate
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {QUESTION_OPTIONS.map((count) => {
                          const isSelected = currentVal === count
                          return (
                            <button
                              key={count}
                              type="button"
                              onClick={() => field.handleChange(count)}
                              className={cn(
                                'h-11 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center',
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                                  : 'bg-muted/40 text-muted-foreground border-border/60 hover:border-teal-500/30 hover:text-foreground',
                              )}
                            >
                              <span>{count}</span>
                              <span className="text-[9px] font-normal opacity-80">
                                prompts
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-400">
                        <Zap className="h-3.5 w-3.5 shrink-0" />
                        <span>Balanced technical & behavioral density</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              }}
            />
          </div>

          {/* Engine Preview & Reliability Card */}
          <Card className="rounded-[2.5rem] border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>System Reliability & Scope Notice</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Changes take effect immediately for all new candidate
                    interview links. Active in-flight sessions will continue
                    using their issued expiration tokens.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Engine Operational
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Form Footer Action Strip */}
            <CardFooter className="p-6 sm:p-8 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col items-center sm:items-start gap-0.5 text-center sm:text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                  Synchronization State
                </span>
                <span className="text-xs font-bold text-foreground">
                  Last saved:{' '}
                  {data?.data?.lastModified
                    ? format(
                        parseISO(data.data.lastModified),
                        'dd MMM yyyy • hh:mm a',
                      )
                    : 'Default Configuration'}
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Save Engine Configuration</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
