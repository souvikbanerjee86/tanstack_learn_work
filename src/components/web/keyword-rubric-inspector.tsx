import { useMemo } from 'react'
import { BrainCircuit, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface KeywordRubricInspectorProps {
  candidateAnswers: Array<string>
  questions: Array<{
    question?: string
    sample_answer?: string
    keywords?: Array<string>
  }>
}

export function KeywordRubricInspector({
  candidateAnswers,
  questions,
}: KeywordRubricInspectorProps) {
  const analysis = useMemo(() => {
    const combinedAnswerText = candidateAnswers.join(' ').toLowerCase()

    // Standard common high-value tech keywords to extract from sample answers or question text
    const defaultTechnicalKeywords = [
      'architecture',
      'scalability',
      'concurrency',
      'performance',
      'optimization',
      'security',
      'microservices',
      'latency',
      'async',
      'cache',
      'database',
      'indexing',
      'docker',
      'kubernetes',
      'distributed',
      'testing',
      'monitoring',
      'lifecycle',
      'state management',
      'api',
      'rest',
      'graphql',
      'clean code',
      'tradeoffs',
      'reliability',
      'ci/cd',
      'observability',
      'data integrity',
    ]

    // Collect custom keywords extracted from questions
    const extractedKeywords = new Set<string>()
    questions.forEach((q) => {
      if (q.keywords && Array.isArray(q.keywords)) {
        q.keywords.forEach((k) => extractedKeywords.add(k.toLowerCase().trim()))
      }
      if (q.sample_answer) {
        const words = q.sample_answer
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 5)
        words.slice(0, 5).forEach((w) => extractedKeywords.add(w))
      }
    })

    const targetKeywords = Array.from(
      new Set([...Array.from(extractedKeywords), ...defaultTechnicalKeywords]),
    ).slice(0, 16)

    const matched: Array<string> = []
    const missing: Array<string> = []

    targetKeywords.forEach((kw) => {
      if (combinedAnswerText.includes(kw)) {
        matched.push(kw)
      } else {
        missing.push(kw)
      }
    })

    const matchRatio = Math.round(
      (matched.length / Math.max(1, targetKeywords.length)) * 100,
    )

    return {
      matched,
      missing,
      matchRatio,
      totalEvaluated: targetKeywords.length,
    }
  }, [candidateAnswers, questions])

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-foreground">
                Technical Keyword & Concept Alignment
              </h4>
              <Badge
                variant="outline"
                className="text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
              >
                {analysis.matchRatio}% Depth Fit
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Semantic keyword presence detected across spoken & transcribed
              responses.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Concepts */}
        <div className="space-y-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Concepts Mentioned ({analysis.matched.length})
            </span>
            <span className="text-[10px] font-medium text-emerald-600/80">
              Spoken in Answers
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.matched.length > 0 ? (
              analysis.matched.map((kw) => (
                <Badge
                  key={kw}
                  variant="outline"
                  className="text-[11px] font-semibold capitalize bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-2.5 py-1"
                >
                  ✓ {kw}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground italic">
                No primary domain keywords matched.
              </span>
            )}
          </div>
        </div>

        {/* Untouched Concepts */}
        <div className="space-y-3 p-4 rounded-2xl bg-zinc-500/5 dark:bg-zinc-500/10 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-muted-foreground/60" />
              Unmentioned Keywords ({analysis.missing.length})
            </span>
            <span className="text-[10px] font-medium text-muted-foreground/60">
              Expected in Senior Scope
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {analysis.missing.slice(0, 8).map((kw) => (
              <Badge
                key={kw}
                variant="outline"
                className="text-[11px] font-medium capitalize bg-muted/40 text-muted-foreground border-border/60 px-2.5 py-1"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
