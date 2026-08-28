import { Link } from '@tanstack/react-router'
import { onAuthStateChanged } from 'firebase/auth'
import {
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  Compass,
  CpuIcon,
  LineChartIcon,
  LogInIcon,
  MailIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { User} from 'firebase/auth';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

// Reusable GlowCard wrapper — tracks mouse position and applies CSS custom properties
function GlowCard({
  children,
  className = '',
  variant = 'default',
}: {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'sm'
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--glow-x', `${x}%`)
    el.style.setProperty('--glow-y', `${y}%`)
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        'glow-card transition-all duration-300',
        variant === 'sm' ? 'glow-card-sm' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ComponentExample() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="w-full min-h-screen text-foreground py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* --- Ambient Background Glows --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-175 md:w-250 h-125 bg-linear-to-tr from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 dark:from-indigo-500/10 dark:via-violet-500/5 dark:to-fuchsia-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] right-[-10%] w-125 h-125 bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-112.5 h-112.5 bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:4s]" />
      </div>

      {/* --- Hero Section --- */}
      <section className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10 mb-20 md:mb-32 relative">
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="px-4 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-black uppercase tracking-widest rounded-full border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-950/30 backdrop-blur-md shadow-sm gap-2 transition-all hover:border-indigo-500/40 hover:scale-105"
          >
            <SparklesIcon className="w-3.5 h-3.5" /> Next-Gen Autonomous Hiring
            Engine
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] sm:leading-[0.95]">
          The Future of
          <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
            Intelligent Hiring
          </span>
        </h1>

        <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
          Empowering modern enterprises with autonomous semantic candidate
          discovery, adaptive AI video interviews, and objective evaluation
          rubrics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-md sm:max-w-none mx-auto">
          {!user ? (
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 sm:h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 sm:px-10 text-sm sm:text-base font-bold shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 sm:h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 sm:px-10 text-sm sm:text-base font-bold shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Go to Workspace</span>
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          )}

          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 sm:h-14 rounded-2xl px-8 sm:px-10 text-sm sm:text-base font-bold border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:bg-muted/70 transition-all shadow-sm"
            >
              Explore Platform
            </Button>
          </Link>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-border/60 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              99.4%
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Semantic Match Score
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-border/60 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              10x
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Faster Screening
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-border/60 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              24/7
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Adaptive Sessions
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-border/60 flex flex-col items-center justify-center text-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Zero Bias
            </span>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Objective Rubrics
            </span>
          </div>
        </div>
      </section>

      {/* --- Main Dual-View Showcase --- */}
      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 relative z-10 mb-24">
        {/* Enterprise & Hiring Teams Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-3.5 sm:p-4 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-2xl border border-indigo-500/20 shadow-sm text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-300">
              <BuildingIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                For Enterprises
              </h2>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                End-to-End Orchestration
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <GlowCard>
              <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 p-6">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                    <BriefcaseIcon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Job Requisitions & Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Create comprehensive job profiles instantly. Define
                    experience brackets, core skills, location protocols, and
                    evaluation rubrics with intuitive ease.
                  </CardDescription>
                </CardContent>
              </Card>
            </GlowCard>

            <GlowCard>
              <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 p-6">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Semantic AI Talent Discovery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Surface elite candidates using intelligent vector matching.
                    Contextual RAG matching evaluates depth beyond mere resume
                    keywords.
                  </CardDescription>
                </CardContent>
              </Card>
            </GlowCard>

            <div className="grid sm:grid-cols-2 gap-5">
              <GlowCard variant="sm">
                <Card className="rounded-2xl border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg shadow-black/5 overflow-hidden p-5 space-y-2 hover:border-violet-500/30">
                  <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                    <MailIcon className="w-4 h-4" />
                    <CardTitle className="text-base font-bold">
                      Magic Invitations
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Dispatch time-limited token links to shortlisted candidates
                    with one click. Automated and secure.
                  </CardDescription>
                </Card>
              </GlowCard>

              <GlowCard variant="sm">
                <Card className="rounded-2xl border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg shadow-black/5 overflow-hidden p-5 space-y-2 hover:border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <LineChartIcon className="w-4 h-4" />
                    <CardTitle className="text-base font-bold">
                      Instant Analytics
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    Review automated speech analysis, response fidelity scoring,
                    and downloadable PDF evaluation reports.
                  </CardDescription>
                </Card>
              </GlowCard>
            </div>
          </div>
        </div>

        {/* Candidate Experience Column */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 group cursor-default">
            <div className="p-3.5 sm:p-4 bg-fuchsia-500/10 dark:bg-fuchsia-500/15 rounded-2xl border border-fuchsia-500/20 shadow-sm text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-105 transition-transform duration-300">
              <UserIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-0.5 text-left">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                For Candidates
              </h2>
              <p className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-widest">
                Seamless Assessment
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <GlowCard>
              <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-fuchsia-500/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 p-6">
                  <div className="p-2.5 bg-fuchsia-500/10 rounded-xl text-fuchsia-600 dark:text-fuchsia-400 shrink-0">
                    <LogInIcon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Zero-Friction Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Access your personalized interview session instantly via
                    secure magic link or authenticated access without complex
                    onboarding hurdles.
                  </CardDescription>
                </CardContent>
              </Card>
            </GlowCard>

            <GlowCard>
              <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-purple-500/30 relative">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 p-6">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 shrink-0">
                    <CpuIcon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Conversational AI Evaluator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Experience structured, interactive voice & video interview
                    sessions with an AI agent that adapts questions in real-time
                    to your answers.
                  </CardDescription>
                </CardContent>
              </Card>
            </GlowCard>

            <GlowCard>
              <Card className="rounded-[2rem] border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300 hover:border-pink-500/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2 p-6">
                  <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-600 dark:text-pink-400 shrink-0">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    Interview On Your Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Complete your evaluation when you are at your peak
                    readiness. Eliminate timezone friction, scheduling delays,
                    and interview anxiety.
                  </CardDescription>
                </CardContent>
              </Card>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* --- Interactive 3-Step Flow --- */}
      <section className="max-w-5xl mx-auto mb-24 space-y-10">
        <div className="text-center space-y-2">
          <Badge
            variant="outline"
            className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 border-indigo-500/20"
          >
            Workflow Architecture
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            How The Intelligence Engine Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-border/60 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-foreground">
              Ingest & Vectorize
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Archive bank ingests candidate resumes from cloud storage and
              automatically chunks, indexes, and vectorizes content.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-border/60 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-foreground">
              Match & Align
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Semantic AI evaluates job criteria against candidate CVs,
              producing ranked match scores, alignment points, and clarification
              notes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-border/60 space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-foreground">
              Assess & Score
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated AI sessions conduct technical interviews, providing
              synthesized audio timelines, transcripts, and decision reports.
            </p>
          </div>
        </div>
      </section>

      {/* --- Footer CTA & Status --- */}
      <section className="max-w-4xl mx-auto rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-violet-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Modernize Your Hiring Pipeline?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
            Experience the next era of autonomous talent acquisition with
            streamlined workflows and transparent assessment rubrics.
          </p>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pt-2">
          <Link to={user ? '/dashboard' : '/login'}>
            <Button
              size="lg"
              className="h-12 sm:h-13 bg-white text-indigo-700 hover:bg-white/90 rounded-2xl px-8 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105"
            >
              <span>{user ? 'Open Dashboard' : 'Get Started Now'}</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* --- Footer Signature --- */}
      <div className="mt-16 sm:mt-24 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto border-t border-border/40 pt-8 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Talent Engine Core Operational</span>
        </div>
        <p className="text-center sm:text-right">
          © {new Date().getFullYear()} Intelligent Hiring Protocol. All rights
          reserved.
        </p>
      </div>
    </div>
  )
}
