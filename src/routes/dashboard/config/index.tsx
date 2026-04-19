import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, Clock, Calendar, HelpCircle, Settings2, Sparkles, ShieldCheck } from 'lucide-react'
import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'
import { configSchema } from '@/schemas/evaluate'
import { getSiteConfig, saveSiteConfig } from '@/lib/server-function'
import { ConfigSkeleton } from '@/components/web/config-skeleton'
import { format, parseISO } from 'date-fns'

export const siteConfigQueryOptions = queryOptions({
  queryKey: ['site-config'],
  queryFn: () => getSiteConfig(),
})
export const Route = createFileRoute('/dashboard/config/')({
  component: RouteComponent,
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(siteConfigQueryOptions)
  },
})

type ConfigForm = z.infer<typeof configSchema>

function RouteComponent() {
  return (
    <Suspense fallback={<ConfigSkeleton />}>
      <ConfigSuspenseWrapper />
    </Suspense>
  )
}

function ConfigSuspenseWrapper() {
  const queryClient = useQueryClient()
  const { data }: { data: any } = useSuspenseQuery(siteConfigQueryOptions)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      interviewTime: data?.data?.interviewTime ?? '',
      linkValidity: data?.data?.linkValidity ?? '',
      questionsCount: data?.data?.questionsCount ?? '',
    } as ConfigForm,
    validators: {
      onChange: configSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        await saveSiteConfig({ data: value })
        toast.success('Configuration saved successfully!')
        queryClient.invalidateQueries({ queryKey: ['site-config'] })
      } catch (e) {
        toast.error('Failed to save configuration!')
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-10 lg:p-16 relative overflow-hidden flex items-center justify-center">
      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 blur-[80px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* --- Header Section --- */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3" />
            System Parameters
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Interview Engine
          </h1>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            Fine-tune your candidate assessment logic with precision-balanced configurations.
          </p>
        </div>

        {/* --- Main Configuration Card --- */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 md:p-12 pb-4 border-b border-border/10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                <Settings2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-black tracking-tight">Global Settings</CardTitle>
                <CardDescription className="text-xs font-semibold uppercase tracking-widest opacity-60">Session Control Protocol</CardDescription>
              </div>
            </div>
          </CardHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <CardContent className="p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* --- Interview Duration --- */}
                <form.Field
                  name="interviewTime"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
                    return (
                      <Field data-invalid={isInvalid} className="space-y-4 group">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          <FieldLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Interview Time</FieldLabel>
                        </div>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-muted-foreground/10 bg-muted/30 focus:ring-primary/20 transition-all hover:bg-muted/50">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/50 backdrop-blur-2xl">
                            {[15, 30, 45, 60, 75, 90].map((min) => (
                              <SelectItem key={min} value={min.toString()} className="rounded-xl focus:bg-primary/10">
                                {min} Minutes
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} className="text-[10px] font-bold uppercase tracking-tighter px-2" />}
                      </Field>
                    )
                  }}
                />

                {/* --- Link Validity --- */}
                <form.Field
                  name="linkValidity"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
                    return (
                      <Field data-invalid={isInvalid} className="space-y-4 group">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          <FieldLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Validity Period</FieldLabel>
                        </div>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-muted-foreground/10 bg-muted/30 focus:ring-primary/20 transition-all hover:bg-muted/50">
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/50 backdrop-blur-2xl">
                            {[3, 5, 7].map((days) => (
                              <SelectItem key={days} value={days.toString()} className="rounded-xl focus:bg-primary/10">
                                {days} Days Active
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} className="text-[10px] font-bold uppercase tracking-tighter px-2" />}
                      </Field>
                    )
                  }}
                />

                {/* --- Question Count --- */}
                <form.Field
                  name="questionsCount"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
                    return (
                      <Field data-invalid={isInvalid} className="space-y-4 group">
                        <div className="flex items-center gap-2 mb-1">
                          <HelpCircle className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                          <FieldLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Question Density</FieldLabel>
                        </div>
                        <Select
                          value={field.state.value}
                          onValueChange={(val) => field.handleChange(val)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-muted-foreground/10 bg-muted/30 focus:ring-primary/20 transition-all hover:bg-muted/50">
                            <SelectValue placeholder="Select quantity" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/50 backdrop-blur-2xl">
                            {Array.from({ length: 11 }, (_, i) => i + 5).map((num) => (
                              <SelectItem key={num} value={num.toString()} className="rounded-xl focus:bg-primary/10">
                                {num} Questions
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} className="text-[10px] font-bold uppercase tracking-tighter px-2" />}
                      </Field>
                    )
                  }}
                />
              </div>

              {/* --- Informational Footer (Mobile Only or Both) --- */}
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold tracking-tight">System Reliability Notice</h4>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80 mt-1">
                    These settings are global and will apply to all newly generated interview sessions. Existing links will retain their original validity.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 md:p-12 pt-0 flex flex-col md:flex-row gap-6 justify-between items-center group/footer">
              <div className="flex flex-col items-center md:items-start gap-1">
                <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-[0.2em]">
                  Configuration Sync
                </p>
                <p className="text-[11px] text-muted-foreground font-bold group-hover/footer:text-primary transition-colors duration-500">
                  Last updated: {data?.data?.lastModified
                    ? format(parseISO(data.data.lastModified), 'dd MMM yyyy • hh:mm a')
                    : "Unsynchronized"}
                </p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 gap-3 hover:scale-[1.02] active:scale-95 transition-all text-xs font-black uppercase tracking-[0.2em]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 fill-white/20" />
                )}
                {isSubmitting ? 'Synchronizing...' : 'Save Configuration'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Mobile Design Note: In the grid, I used lg:grid-cols-3 and md:grid-cols-2. 
          On mobile it will be a single column stack which is standard and clean.
          For a "different" mobile design, I could adjust the padding and card rounding.
      */}
    </div>
  )
}
