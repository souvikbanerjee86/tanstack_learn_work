import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { BrainCircuit, Sparkles } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface SkillDimension {
  competency: string
  candidateScore: number
  benchmarkTarget: number
}

const DEFAULT_SKILL_DATA: Array<SkillDimension> = [
  { competency: 'Problem Solving', candidateScore: 88, benchmarkTarget: 80 },
  { competency: 'System Architecture', candidateScore: 78, benchmarkTarget: 75 },
  { competency: 'Code Quality', candidateScore: 92, benchmarkTarget: 85 },
  { competency: 'Cloud & Security', candidateScore: 74, benchmarkTarget: 70 },
  { competency: 'Communication', candidateScore: 85, benchmarkTarget: 80 },
  { competency: 'Framework Depth', candidateScore: 90, benchmarkTarget: 85 },
]

export function CandidateSkillRadar({
  data = DEFAULT_SKILL_DATA,
  candidateName = 'Candidate Profile',
}: {
  data?: Array<SkillDimension>
  candidateName?: string
}) {
  return (
    <Card className="rounded-[2.5rem] border border-border/60 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
      <CardHeader className="p-6 pb-2 border-b border-border/40 bg-muted/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-black tracking-tight text-foreground">
                Competency Radar & Skill Fit
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground font-medium">
                Candidate capabilities benchmarked against position baseline
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 px-2.5 py-0.5"
          >
            <Sparkles className="h-3 w-3" />
            <span>High Alignment</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="rgba(150, 150, 150, 0.2)" />
              <PolarAngleAxis
                dataKey="competency"
                tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 600 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: 'currentColor' }}
                className="text-muted-foreground/40"
              />
              <Radar
                name="Candidate Fit"
                dataKey="candidateScore"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.4}
              />
              <Radar
                name="Role Target"
                dataKey="benchmarkTarget"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-2 border-t border-border/40 w-full">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm" />
            <span className="text-foreground">Candidate Capability</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 shadow-sm" />
            <span className="text-muted-foreground">Target Role Baseline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
