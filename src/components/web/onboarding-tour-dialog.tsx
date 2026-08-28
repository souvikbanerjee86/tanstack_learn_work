import { useEffect, useState } from 'react'
import {
  Activity,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Layers,
  Mic,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'eazyai_feature_tour_completed_v1'

export interface TourSlide {
  id: string
  category: string
  title: string
  subtitle: string
  description: string
  icon: any
  color: string
  accentBg: string
  accentText: string
  borderAccent: string
  highlights: Array<{
    icon: any
    label: string
    desc: string
  }>
}

const TOUR_SLIDES: Array<TourSlide> = [
  {
    id: 'overview',
    category: 'Autonomous Intelligence',
    title: 'Welcome to EazyAI Talent Engine',
    subtitle: 'The future of autonomous recruitment and candidate assessment',
    description:
      'Accelerate your entire hiring lifecycle. From intelligent requisition architecture to autonomous voice interviews and deep forensic rubrics.',
    icon: Sparkles,
    color: 'from-indigo-600 to-violet-600',
    accentBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-500/30',
    highlights: [
      {
        icon: Zap,
        label: 'Real-Time Insights',
        desc: 'Live telemetry, candidate pipelines, and scoring overview in one unified dashboard.',
      },
      {
        icon: Search,
        label: 'Global ⌘K Command Center',
        desc: 'Instant keyboard navigation across jobs, candidate pools, questions, and system settings.',
      },
      {
        icon: ShieldCheck,
        label: 'Enterprise Governance',
        desc: 'Granular role administration, permission tiers, and secure token lifecycle.',
      },
    ],
  },
  {
    id: 'jobs',
    category: 'Pipeline Management',
    title: 'Intelligent Job Requisitions',
    subtitle: 'Formulate roles with custom evaluation rubrics',
    description:
      'Create multi-parameter job listings with target experience, domain criteria, and location preferences. Filter with instant multi-token search.',
    icon: Briefcase,
    color: 'from-blue-600 to-cyan-600',
    accentBg: 'bg-blue-500/10 dark:bg-blue-500/15',
    accentText: 'text-blue-600 dark:text-blue-400',
    borderAccent: 'border-blue-500/30',
    highlights: [
      {
        icon: Layers,
        label: 'Requisition Builder',
        desc: 'Define custom candidate criteria, required competencies, and validity windows.',
      },
      {
        icon: Search,
        label: 'Multi-Field Search',
        desc: 'Instant keyword search across titles, locations, statuses, and descriptions.',
      },
      {
        icon: Users,
        label: 'Direct Ingestion',
        desc: 'Add candidates directly to any open job requisition with auto-linking.',
      },
    ],
  },
  {
    id: 'discovery',
    category: 'Vector RAG Search',
    title: 'AI Talent Discovery & Side-by-Side CV Compare',
    subtitle:
      'Surface the best talent from your archive bank with vector matching',
    description:
      'Our semantic matching engine evaluates candidates by context and aptitude rather than mere keyword repetition. Compare CVs directly against job descriptions.',
    icon: Compass,
    color: 'from-violet-600 to-purple-600',
    accentBg: 'bg-violet-500/10 dark:bg-violet-500/15',
    accentText: 'text-violet-600 dark:text-violet-400',
    borderAccent: 'border-violet-500/30',
    highlights: [
      {
        icon: Sparkles,
        label: 'Match Score Matrix',
        desc: 'Calculates precision % score, key alignments, and focus areas to clarify in interviews.',
      },
      {
        icon: FileText,
        label: 'Side-by-Side Comparison',
        desc: '2-column comparison modal inspecting job requirements against candidate CV profiles.',
      },
      {
        icon: CheckCircle2,
        label: 'Multi-Candidate Dispatch',
        desc: 'Batch select matching candidates and issue automated interview invitations in 1 click.',
      },
    ],
  },
  {
    id: 'interviews',
    category: 'Autonomous Assessment',
    title: 'Adaptive Conversational Voice & Video Interviews',
    subtitle: '24/7 AI-conducted sessions with zero scheduling delays',
    description:
      'Candidates receive time-boxed magic links to complete interactive spoken interviews with an adaptive AI evaluator that listens, transcribes, and probes deeper.',
    icon: Mic,
    color: 'from-fuchsia-600 to-pink-600',
    accentBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/15',
    accentText: 'text-fuchsia-600 dark:text-fuchsia-400',
    borderAccent: 'border-fuchsia-500/30',
    highlights: [
      {
        icon: Bot,
        label: 'Conversational Evaluator',
        desc: 'Dynamically adapts question prompts in real-time based on candidate responses.',
      },
      {
        icon: Activity,
        label: 'Acoustic Voice Biometrics',
        desc: 'Forensic detection of synthetic AI voice generation vs human authentic speech.',
      },
      {
        icon: ShieldCheck,
        label: 'Proctoring Telemetry',
        desc: 'Tracks face orientation, window focus loss, and anomaly incidents during sessions.',
      },
    ],
  },
  {
    id: 'outcomes',
    category: 'Decision Rubrics',
    title: 'Objective Audits & PDF Decision Reports',
    subtitle:
      'Comprehensive scorecards, reasoning analysis, and verdict submissions',
    description:
      'Review aggregate scores, candidate speech audio samples, question-by-question AI reasoning, and generate beautiful exportable PDF reports for hiring committees.',
    icon: FileText,
    color: 'from-emerald-600 to-teal-600',
    accentBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-500/30',
    highlights: [
      {
        icon: CheckCircle2,
        label: 'Aggregate Fit Scoring',
        desc: 'Automated 1-10 scoring per question prompt with weighted alignment ratings.',
      },
      {
        icon: FileText,
        label: '1-Click PDF Report',
        desc: 'Generate professional candidate dossier with complete interview transcripts.',
      },
      {
        icon: ShieldCheck,
        label: 'Recruiter Verdict Capture',
        desc: 'Record definitive ACCEPT / REJECT decisions with structured feedback notes.',
      },
    ],
  },
]

interface OnboardingTourDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  forceShow?: boolean
}

export function OnboardingTourDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  forceShow = false,
}: OnboardingTourDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = (openState: boolean) => {
    if (!openState) {
      // User closed or skipped tour -> mark in localStorage
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch (e) {
        // Ignore storage errors
      }
    }
    if (isControlled) {
      setControlledOpen?.(openState)
    } else {
      setInternalOpen(openState)
    }
  }

  // First time auto-popup check
  useEffect(() => {
    if (forceShow) {
      handleOpenChange(true)
      return
    }

    try {
      const hasSeenTour = localStorage.getItem(STORAGE_KEY)
      if (!hasSeenTour) {
        const timer = setTimeout(() => {
          handleOpenChange(true)
        }, 800)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      // Ignore
    }
  }, [forceShow])

  const handleNext = () => {
    if (currentStep < TOUR_SLIDES.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch (e) {
      // Ignore
    }
    handleOpenChange(false)
  }

  const currentSlide = TOUR_SLIDES[currentStep]
  const progressPercent = ((currentStep + 1) / TOUR_SLIDES.length) * 100
  const SlideIcon = currentSlide.icon

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-2xl md:max-w-3xl border border-border/60 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-0 overflow-hidden"
        aria-describedby="tour-description"
      >
        {/* Header Strip with category & step counter */}
        <div className="p-6 sm:p-8 pb-4 bg-muted/20 border-b border-border/40 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5',
                  currentSlide.accentBg,
                  currentSlide.accentText,
                  currentSlide.borderAccent,
                )}
              >
                {currentSlide.category}
              </Badge>
              <span className="text-xs font-mono font-bold text-muted-foreground">
                Step {currentStep + 1} of {TOUR_SLIDES.length}
              </span>
            </div>

            <button
              onClick={handleComplete}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-linear-to-r transition-all duration-300 rounded-full',
                currentSlide.color,
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Slide Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Hero Title & Description */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'h-14 w-14 rounded-2xl flex items-center justify-center border shadow-md shrink-0 transition-transform duration-300',
                currentSlide.accentBg,
                currentSlide.accentText,
                currentSlide.borderAccent,
              )}
            >
              <SlideIcon className="h-7 w-7" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
                {currentSlide.subtitle}
              </p>
            </div>
          </div>

          <p
            id="tour-description"
            className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium bg-muted/20 p-4 rounded-2xl border border-border/40"
          >
            {currentSlide.description}
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {currentSlide.highlights.map((highlight, idx) => {
              const HIcon = highlight.icon
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-border/60 space-y-1.5 hover:border-border transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'p-1.5 rounded-lg shrink-0',
                        currentSlide.accentBg,
                        currentSlide.accentText,
                      )}
                    >
                      <HIcon className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {highlight.label}
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium leading-snug">
                    {highlight.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-6 sm:p-8 pt-4 pb-6 bg-muted/20 border-t border-border/40 flex items-center justify-between gap-4">
          {/* Slide Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'h-2 rounded-full transition-all cursor-pointer',
                  index === currentStep
                    ? 'w-6 bg-indigo-600 dark:bg-indigo-400'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
                )}
                title={`Jump to ${slide.category}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="h-10 px-4 rounded-xl text-xs font-bold border-border/60 bg-white/60 dark:bg-zinc-900/60"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="h-10 px-6 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 gap-1.5 transition-all hover:scale-105"
            >
              <span>
                {currentStep === TOUR_SLIDES.length - 1
                  ? 'Launch Workspace'
                  : 'Next Feature'}
              </span>
              {currentStep === TOUR_SLIDES.length - 1 ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Utility helper to reset tour state in local storage so user can view it again on demand
 */
export function resetTourStatus() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // Ignore
  }
}
