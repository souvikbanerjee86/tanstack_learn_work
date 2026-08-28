import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Briefcase,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Compass,
  Database,
  Download,
  FileText,
  Mail,
  Sparkles,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import type {
  CandidateMatch,
  PaginatedJobResponse,
  ProfileSearchCritieria,
  ProfileSearchResponse,
  RagProcessRecord,
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CandidateResultCard } from '@/components/web/candidate-result-card'
import { EmptyState } from '@/components/web/empty-state'
import { MultiStepLoader } from '@/components/web/multi-step-loader'
import { SearchProfileForm } from '@/components/web/search-profile-form'
import { CVDialog } from '@/components/web/cv-dialog'
import { CandidateCompareDialog } from '@/components/web/candidate-compare-dialog'
import {
  getDownloadURL,
  getJobDetails,
  getProcessedIndexFilesId,
  getSearchProfileDetails,
  jobInterviewCandidates,
} from '@/lib/server-function'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { exportToCSV } from '@/lib/export-utils'

export const Route = createFileRoute('/dashboard/discover')({
  component: RouteComponent,
  loader: async () => {
    const data: Array<RagProcessRecord> = await getProcessedIndexFilesId()
    const jobDetails: PaginatedJobResponse = await getJobDetails({
      data: { limit: null, status: null, last_doc_id: null },
    })
    return { data, jobDetails }
  },
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [downloading, setDownloading] = useState<boolean>(false)
  const { data, jobDetails } = Route.useLoaderData()
  const [results, setResults] = useState<ProfileSearchResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [documentId, setDocumentId] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [scoreThreshold, setScoreThreshold] = useState<number>(0)
  const [searchCriteria, setSearchCriteria] =
    useState<ProfileSearchCritieria | null>(null)
  const [isJobDescExpanded, setIsJobDescExpanded] = useState<boolean>(false)
  const [comparedCandidate, setComparedCandidate] =
    useState<CandidateMatch | null>(null)

  const handleCheckedChange = (id: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    )
  }

  const onProfileSearchSubmit = async (formData: ProfileSearchCritieria) => {
    let fileIds: Array<string> | null = null
    try {
      if (documentId.length > 0 && documentId !== 'all') {
        const filteredData = data.filter((item) => item.id === documentId)
        const ragPaths = filteredData[0]?.rag_file_ids || []
        fileIds = ragPaths
          .map((path) => path.split('/').pop() ?? null)
          .filter((item): item is string => item !== null)
      }
      setIsSubmitting(true)
      setSelectedJobId(formData.jobId)
      setSearchCriteria(formData)
      const jobDescription = formData.jobDescription
      const preferedDomain = formData.preferedDomain
      const skills = formData.skills
      const experience = formData.experience
      const searchResults: ProfileSearchResponse =
        await getSearchProfileDetails({
          data: { jobDescription, preferedDomain, skills, experience, fileIds },
        })
      setResults(searchResults)
      setIsSubmitting(false)
    } catch {
      toast.error('Failed to perform AI candidate matching')
      setIsSubmitting(false)
    }
  }

  const bucketChangeHandler = (id: string) => {
    setDocumentId(id === 'all' ? '' : id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const outcome: { success: boolean; message: string } =
        await jobInterviewCandidates({
          data: { job_id: selectedJobId, candidates: selectedItems },
        })
      if (outcome.success) {
        toast.success(outcome.message)
      } else {
        toast.error(outcome.message)
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to dispatch interview invitations')
    } finally {
      setIsSubmitting(false)
      setSelectedItems([])
    }
  }

  const downlaodUrl = async (url: string) => {
    try {
      setDownloading(true)
      setFileUrl('')
      setIsOpen(false)
      const response = await getDownloadURL({
        data: {
          bucket_name: 'cv_bucket_project-716b1c69-ee04-40fd-ba6',
          file_path: url,
        },
      })
      if (response.download_url) {
        setFileUrl(encodeURIComponent(response.download_url))
        setIsOpen(true)
      } else {
        toast.error('Could not retrieve resume preview')
      }
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(false)
    }
  }

  // Active target job details
  const activeJob = useMemo(() => {
    const targetId = searchCriteria?.jobId || selectedJobId
    if (!targetId) return undefined
    return jobDetails.data.find((j) => j.job_id === targetId)
  }, [jobDetails.data, searchCriteria, selectedJobId])

  // Filter candidate matches based on score threshold
  const filteredMatches = useMemo(() => {
    if (!results?.matches) return []
    if (scoreThreshold === 0) return results.matches
    return results.matches.filter((m) => m.matched_score >= scoreThreshold)
  }, [results, scoreThreshold])

  const hasResults = results && results.matches && results.matches.length > 0

  const handleSelectAllMatches = () => {
    if (!filteredMatches.length) return
    const allEmails = filteredMatches.map((m) => m.candidate_email)
    const allSelected = allEmails.every((email) =>
      selectedItems.includes(email),
    )

    if (allSelected) {
      setSelectedItems((prev) => prev.filter((id) => !allEmails.includes(id)))
    } else {
      setSelectedItems((prev) => Array.from(new Set([...prev, ...allEmails])))
    }
  }

  const isAllFilteredSelected =
    filteredMatches.length > 0 &&
    filteredMatches.every((m) => selectedItems.includes(m.candidate_email))

  const handleExportDiscoveredCSV = () => {
    if (!filteredMatches.length) {
      toast.error('No candidate matches available to export')
      return
    }

    const exportRows = filteredMatches.map((m, idx) => ({
      Rank: idx + 1,
      'Candidate Email': m.candidate_email,
      'Match Score (%)': m.matched_score,
      'Target Role': activeJob?.job_title || searchCriteria?.jobId || 'N/A',
      'Matched Skills': ((m as any).matched_skills || []).join(', '),
      Summary: (m as any).match_summary || '',
    }))

    exportToCSV(
      exportRows,
      `eazyai-discovered-talent-${format(new Date(), 'yyyyMMdd-HHmm')}`,
    )
    toast.success(`Exported ${exportRows.length} discovered profiles to CSV`)
  }

  const activeJobDescription =
    searchCriteria?.jobDescription || activeJob?.job_description || ''
  const activeSkillsList = searchCriteria?.skills
    ? searchCriteria.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div className="relative min-h-screen flex flex-col gap-8 md:gap-12 p-4 md:p-10 lg:p-14 pb-24 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Glow --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* --- Hero Header & Discovery Controls --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/60 p-6 sm:p-10 md:p-12 text-foreground shadow-2xl shadow-black/5 group">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-sm text-indigo-600 dark:text-indigo-400">
                <Compass className="h-6 w-6" />
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-3 py-1"
              >
                AI Talent Discovery
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              Discover Matching Talent
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              Search indexed candidate resumes with semantic intelligence to
              find top-tier profiles that align with your position criteria.
            </p>
          </div>

          {/* Controls Strip: Archive Source + Search Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 dark:bg-zinc-950/40 backdrop-blur-md p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-border/60 shadow-sm w-full xl:w-auto">
            <div className="flex flex-col gap-1.5 w-full sm:w-auto items-start">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-1.5 ml-1">
                <Database className="h-3.5 w-3.5 text-indigo-500" /> Source
                Archive
              </Label>
              <Select onValueChange={(value) => bucketChangeHandler(value)}>
                <SelectTrigger className="w-full sm:w-[220px] h-11 bg-background border-border/60 rounded-xl focus:ring-indigo-500/20 text-xs font-semibold">
                  <SelectValue placeholder="All Indexed Batches" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/60 shadow-2xl">
                  <SelectGroup>
                    <SelectItem
                      value="all"
                      className="rounded-xl my-1 text-xs font-medium"
                    >
                      All Indexed Batches
                    </SelectItem>
                    {data.map((item, idx) => (
                      <SelectItem
                        key={idx}
                        value={item.id}
                        className="rounded-xl my-1 text-xs font-medium"
                      >
                        Archive: {item.date} ({item.rag_file_ids?.length || 0}{' '}
                        files)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Separator
              orientation="vertical"
              className="hidden sm:block h-10 bg-border/40"
            />

            <div className="w-full sm:w-auto">
              <SearchProfileForm
                onProfileSearchSubmit={onProfileSearchSubmit}
                jobDetails={jobDetails}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI MultiStep Loader */}
      {isSubmitting && <MultiStepLoader isLoading={isSubmitting} />}

      {/* --- Results Section --- */}
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {!hasResults ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Target Position & Job Description Benchmark Card */}
            <div className="p-6 sm:p-8 rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-sm text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
                        Evaluation Benchmark Role
                      </span>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                      >
                        {activeJob?.job_id || searchCriteria?.jobId}
                      </Badge>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
                      {activeJob?.job_title || 'Target Position Benchmark'}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsJobDescExpanded(!isJobDescExpanded)}
                    className="h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-muted/80"
                  >
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    <span>
                      {isJobDescExpanded
                        ? 'Collapse Description'
                        : 'View Job Description'}
                    </span>
                    {isJobDescExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Job Criteria Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/30">
                {searchCriteria?.experience !== undefined && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold py-1 px-3 bg-muted/60 text-foreground"
                  >
                    Min Experience: {searchCriteria.experience}+ Years
                  </Badge>
                )}
                {searchCriteria?.preferedDomain && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold py-1 px-3 bg-muted/60 text-foreground"
                  >
                    Domain: {searchCriteria.preferedDomain}
                  </Badge>
                )}
                {activeJob?.location && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-semibold py-1 px-3 bg-muted/60 text-foreground"
                  >
                    Site: {activeJob.location}
                  </Badge>
                )}
                {activeSkillsList.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap ml-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60">
                      Skills:
                    </span>
                    {activeSkillsList.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-[11px] font-medium border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Expandable Full Job Description */}
              {isJobDescExpanded && activeJobDescription && (
                <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Full Job Description & Target Context
                  </h4>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {activeJobDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Results Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/60 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span>Ranked Profiles ({filteredMatches.length})</span>
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Click{' '}
                  <strong className="text-foreground">
                    "Compare with Job"
                  </strong>{' '}
                  on any candidate to inspect alignment side-by-side with
                  requirements.
                </p>
              </div>

              {/* Score Filter Pills & Bulk Select */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/60">
                  <Button
                    variant={scoreThreshold === 0 ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setScoreThreshold(0)}
                    className={cn(
                      'h-7 rounded-lg text-xs font-bold px-2.5',
                      scoreThreshold === 0
                        ? 'bg-indigo-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    All Scores
                  </Button>
                  <Button
                    variant={scoreThreshold === 80 ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setScoreThreshold(80)}
                    className={cn(
                      'h-7 rounded-lg text-xs font-bold px-2.5',
                      scoreThreshold === 80
                        ? 'bg-emerald-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    &ge; 80% Match
                  </Button>
                  <Button
                    variant={scoreThreshold === 60 ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setScoreThreshold(60)}
                    className={cn(
                      'h-7 rounded-lg text-xs font-bold px-2.5',
                      scoreThreshold === 60
                        ? 'bg-amber-600 text-white'
                        : 'text-muted-foreground',
                    )}
                  >
                    &ge; 60% Match
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportDiscoveredCSV}
                  className="h-9 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-muted/80"
                  title="Export Discovered Candidates to CSV"
                >
                  <Download className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Export CSV</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllMatches}
                  className="h-9 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-muted/80"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-indigo-500" />
                  <span>
                    {isAllFilteredSelected ? 'Deselect All' : 'Select All'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Candidate Matches List */}
            <div className="grid grid-cols-1 gap-5">
              {filteredMatches.map((candidate, idx) => (
                <CandidateResultCard
                  key={idx}
                  data={candidate}
                  selectedItems={selectedItems}
                  handleCheckedChange={handleCheckedChange}
                  downlaodUrl={downlaodUrl}
                  isDownloading={downloading}
                  onCompare={() => setComparedCandidate(candidate)}
                />
              ))}
            </div>

            {/* Floating Sticky Action Bar for Bulk Selection */}
            <div
              className={cn(
                'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 backdrop-blur-xl shadow-2xl shadow-black/30 border border-white/20 dark:border-black/10 w-[min(92%,440px)] sm:w-auto',
                selectedItems.length > 0
                  ? 'translate-y-0 opacity-100 scale-100'
                  : 'translate-y-20 opacity-0 scale-95 pointer-events-none',
              )}
            >
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm">
                  {selectedItems.length}
                </div>
                <span className="text-xs font-bold tracking-tight hidden sm:inline">
                  Selected for Invitation
                </span>
              </div>

              <Separator
                orientation="vertical"
                className="h-6 bg-white/20 dark:bg-black/20"
              />

              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  className="h-9 px-4 sm:px-5 flex-1 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs shadow-lg shadow-indigo-500/20"
                  disabled={isSubmitting}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Dispatch Invitations</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-white/10 dark:hover:bg-black/10 shrink-0 text-white/80 dark:text-zinc-900/80"
                  onClick={() => setSelectedItems([])}
                  title="Clear Selection"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single CV Preview Modal */}
      <CVDialog isOpen={isOpen} setIsOpen={setIsOpen} fileUrl={fileUrl} />

      {/* Side-by-Side CV vs Job Description Comparison Modal */}
      <CandidateCompareDialog
        open={!!comparedCandidate}
        onOpenChange={(open) => !open && setComparedCandidate(null)}
        candidate={comparedCandidate}
        job={activeJob}
        searchCriteria={searchCriteria}
        isSelected={
          !!comparedCandidate &&
          selectedItems.includes(comparedCandidate.candidate_email)
        }
        onToggleSelect={handleCheckedChange}
        onViewResume={downlaodUrl}
      />
    </div>
  )
}
