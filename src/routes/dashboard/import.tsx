import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronsUpDown,
  Cloud,
  Copy,
  Eye,
  FileText,
  FolderIcon,
  FolderOpen,
  HardDrive,
  Inbox,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { Suspense, useMemo, useState } from 'react'
import {
  fetchBucketListInfo,
  getDownloadURL,
  getProcessedIndexFilesId,
  triggerIndexes,
} from '@/lib/server-function'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Card, CardTitle } from '@/components/ui/card'
import { ImportPageCard } from '@/components/web/import-page-card'
import { DashboardSkeleton } from '@/components/web/dashboard-skeleton'
import { CVDialog } from '@/components/web/cv-dialog'
import { cn } from '@/lib/utils'

export const bucketListQueryOptions = queryOptions({
  queryKey: ['buckets'],
  queryFn: () => fetchBucketListInfo(),
})

export const processedIndexQueryOptions = queryOptions({
  queryKey: ['processed-index'],
  queryFn: () => getProcessedIndexFilesId(),
})

export const Route = createFileRoute('/dashboard/import')({
  beforeLoad: ({ context }) => {
    return { role: context.role.role }
  },
  component: RouteComponent,
  loader: ({ context }) => {
    Promise.all([
      context.queryClient.ensureQueryData(bucketListQueryOptions),
      context.queryClient.ensureQueryData(processedIndexQueryOptions),
    ])
  },
  staleTime: 0,
})

function RouteComponent() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ImportContent />
    </Suspense>
  )
}

function ImportContent() {
  const queryClient = useQueryClient()
  const { role } = Route.useRouteContext()
  const {
    data: { root_folders },
  } = useSuspenseQuery(bucketListQueryOptions)
  const { data: processedIndexFiles } = useSuspenseQuery(
    processedIndexQueryOptions,
  )

  const [loadingFolder, setLoadingFolder] = useState<string | null>(null)
  const [downloadingPath, setDownloadingPath] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  // Interactive Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'indexed' | 'unindexed'
  >('all')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      root_folders.forEach((f) => {
        initial[f.name] = true
      })
      return initial
    },
  )

  const totalRagFiles = useMemo(() => {
    return (
      processedIndexFiles?.reduce((acc, item) => {
        return acc + (item.rag_file_ids?.length || 0)
      }, 0) ?? 0
    )
  }, [processedIndexFiles])

  const totalBucketFiles = useMemo(() => {
    return root_folders.reduce((acc, folder) => acc + folder.files.length, 0)
  }, [root_folders])

  // Set of indexed dates for rapid lookup
  const indexedDatesSet = useMemo(() => {
    return new Set(processedIndexFiles?.map((p) => p.date) || [])
  }, [processedIndexFiles])

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 KB'
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  const triggeringIndexCreation = async (date: string) => {
    try {
      setLoadingFolder(date)
      const response = await triggerIndexes({ data: { date } })
      if (response.success) {
        await queryClient.invalidateQueries({ queryKey: ['processed-index'] })
        toast.success(response.message || 'Indexing triggered successfully')
      } else {
        toast.error(response.message || 'Indexing request failed')
      }
    } catch {
      toast.error('Indexing request failed. Please try again.')
    } finally {
      setLoadingFolder(null)
    }
  }

  const handleDownloadUrl = async (fullPath: string, fileName: string) => {
    try {
      setDownloadingPath(fullPath)
      setFileUrl('')
      setSelectedFileName(fileName)
      setIsOpen(false)
      const response = await getDownloadURL({
        data: {
          bucket_name: 'cv_bucket_project-716b1c69-ee04-40fd-ba6',
          file_path: fullPath,
        },
      })
      if (response.download_url) {
        setFileUrl(encodeURIComponent(response.download_url))
        setIsOpen(true)
      } else {
        toast.error('Unable to generate preview URL for this file')
      }
    } catch {
      toast.error('Preview retrieval failed. Please try again.')
    } finally {
      setDownloadingPath(null)
    }
  }

  const handleCopyPath = (path: string) => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(path)
      setCopiedPath(path)
      toast.success('File path copied to clipboard')
      setTimeout(() => setCopiedPath(null), 2000)
    }
  }

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }))
  }

  const toggleAllFolders = () => {
    const allOpen = Object.values(openFolders).every(Boolean)
    const updated: Record<string, boolean> = {}
    root_folders.forEach((f) => {
      updated[f.name] = !allOpen
    })
    setOpenFolders(updated)
  }

  // Filtered folders and files
  const filteredFolders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return root_folders
      .map((folder) => {
        const isIndexed = indexedDatesSet.has(folder.name)

        // Status filter check
        if (statusFilter === 'indexed' && !isIndexed) return null
        if (statusFilter === 'unindexed' && isIndexed) return null

        // Search query filter
        if (!query) {
          return { ...folder, isIndexed }
        }

        const folderMatches = folder.name.toLowerCase().includes(query)
        const matchingFiles = folder.files.filter(
          (file) =>
            file.name.toLowerCase().includes(query) ||
            file.full_path.toLowerCase().includes(query),
        )

        if (folderMatches || matchingFiles.length > 0) {
          return {
            ...folder,
            files: folderMatches ? folder.files : matchingFiles,
            isIndexed,
          }
        }

        return null
      })
      .filter((f): f is NonNullable<typeof f> => f !== null)
  }, [root_folders, searchQuery, statusFilter, indexedDatesSet])

  const totalFilteredFiles = useMemo(() => {
    return filteredFolders.reduce((acc, folder) => acc + folder.files.length, 0)
  }, [filteredFolders])

  const allFoldersAreOpen = useMemo(() => {
    return Object.values(openFolders).every(Boolean)
  }, [openFolders])

  return (
    <div className="relative min-h-screen flex flex-col gap-6 md:gap-10 p-4 md:p-10 lg:p-14 pb-20 bg-transparent overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Ambient Background Glow Elements --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-8%] right-[-5%] w-[450px] h-[450px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-violet-500/10 dark:bg-violet-500/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* --- Executive Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20 shadow-xl shadow-indigo-500/5 relative overflow-hidden group">
            <HardDrive className="h-7 w-7 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400 relative z-10 transition-transform group-hover:scale-110 duration-300" />
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                Archive Bank
              </h1>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5"
              >
                Connected
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-1">
              <Cloud className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span>
                Storage repository with {totalBucketFiles} total files across{' '}
                {root_folders.length} deployment batches.
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllFolders}
            className="h-10 rounded-xl px-3.5 gap-2 text-xs font-bold border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:bg-muted/80 transition-all active:scale-95"
          >
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{allFoldersAreOpen ? 'Collapse All' : 'Expand All'}</span>
          </Button>
        </div>
      </div>

      {/* --- Statistics Metrics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {processedIndexFiles && (
          <>
            <ImportPageCard
              cardDescription="Total Processed Indexes"
              processedCount={processedIndexFiles.length}
              footerDescription="Latest Run: "
              processedIndexFiles={processedIndexFiles}
            />
            <ImportPageCard
              cardDescription="Total Processed Files"
              processedCount={totalRagFiles}
              footerDescription="Latest Run: "
              processedIndexFiles={processedIndexFiles}
            />
            <ImportPageCard
              cardDescription="Last Processed Index"
              processedCount={totalRagFiles}
              footerDescription="Latest Run: "
              processedIndexFiles={processedIndexFiles}
            />
          </>
        )}
      </div>

      {/* --- Main Section: Explorer & Filters --- */}
      <div className="relative rounded-[2.5rem] border border-border/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl shadow-2xl shadow-black/5 p-4 sm:p-8 space-y-8">
        {/* Search, Filter and Actions Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file names, folders, or paths..."
              className="pl-10 pr-9 h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/40 border border-border/60">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all',
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                All Folders
              </Button>
              <Button
                variant={statusFilter === 'indexed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('indexed')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5',
                  statusFilter === 'indexed'
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Indexed
              </Button>
              <Button
                variant={statusFilter === 'unindexed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setStatusFilter('unindexed')}
                className={cn(
                  'h-8 rounded-lg text-xs font-bold px-3 transition-all gap-1.5',
                  statusFilter === 'unindexed'
                    ? 'bg-amber-600 text-white shadow-sm hover:bg-amber-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80',
                )}
              >
                <AlertCircle className="h-3 w-3 text-amber-400" />
                Needs Indexing
              </Button>
            </div>

            <span className="text-xs font-medium text-muted-foreground/70 ml-2">
              Showing{' '}
              <strong className="text-foreground">{totalFilteredFiles}</strong>{' '}
              of {totalBucketFiles} files
            </span>
          </div>
        </div>

        {/* Folders Accordion List */}
        <div className="space-y-6">
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => {
              const isOpen = openFolders[folder.name] ?? true
              const isFolderLoading = loadingFolder === folder.name

              return (
                <Collapsible
                  key={folder.name}
                  open={isOpen}
                  onOpenChange={() => toggleFolder(folder.name)}
                  className="group rounded-2xl md:rounded-3xl border border-border/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-sm hover:border-border/80"
                >
                  {/* Folder Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-6 bg-muted/20 border-b border-border/30">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105 shadow-sm',
                          folder.isIndexed
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
                        )}
                      >
                        {isOpen ? (
                          <FolderOpen className="h-5 w-5" />
                        ) : (
                          <FolderIcon className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
                            {folder.name}
                          </h3>

                          {folder.isIndexed ? (
                            <Badge className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Indexed
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/15 gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Unindexed
                            </Badge>
                          )}

                          <Badge
                            variant="outline"
                            className="text-[10px] font-semibold text-muted-foreground border-border/60"
                          >
                            {folder.files.length}{' '}
                            {folder.files.length === 1 ? 'file' : 'files'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {role === 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            'h-9 px-3.5 rounded-xl text-xs font-bold gap-1.5 transition-all shadow-sm active:scale-95',
                            folder.isIndexed
                              ? 'border-border/60 hover:bg-primary/5 hover:text-primary'
                              : 'border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            void triggeringIndexCreation(folder.name)
                          }}
                          disabled={isFolderLoading || loadingFolder !== null}
                        >
                          {isFolderLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Indexing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>
                                {folder.isIndexed
                                  ? 'Re-index'
                                  : 'Trigger Index'}
                              </span>
                            </>
                          )}
                        </Button>
                      )}

                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-muted/80 transition-transform"
                          aria-label="Toggle folder"
                        >
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 text-muted-foreground transition-transform duration-200',
                              isOpen && 'rotate-90',
                            )}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  {/* File Grid */}
                  <CollapsibleContent className="p-4 md:p-6 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {folder.files.map((file, idx) => {
                        if (!file.name || file.name.length === 0) return null
                        const isDownloading = downloadingPath === file.full_path
                        const isCopied = copiedPath === file.full_path

                        return (
                          <Card
                            key={idx}
                            className="group/file relative overflow-hidden flex flex-col justify-between p-4 rounded-2xl border border-border/50 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <div className="space-y-3">
                              {/* File Top Bar: Icon + Name + Size */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="h-9 w-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/15 group-hover/file:scale-105 transition-transform">
                                    <FileText className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                                  </div>

                                  <div className="min-w-0">
                                    <CardTitle className="text-xs sm:text-sm font-bold text-foreground break-words leading-tight group-hover/file:text-indigo-600 dark:group-hover/file:text-indigo-400 transition-colors">
                                      {file.name}
                                    </CardTitle>
                                    <span className="inline-block mt-1 text-[10px] font-mono font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40 tabular-nums">
                                      {formatSize(file.size)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* File Path Pill */}
                              <div
                                onClick={() => handleCopyPath(file.full_path)}
                                className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors cursor-pointer group/path"
                                title="Click to copy full path"
                              >
                                <p className="text-[10px] font-mono text-muted-foreground/70 truncate flex-1">
                                  {file.full_path}
                                </p>
                                {isCopied ? (
                                  <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                                ) : (
                                  <Copy className="h-3 w-3 text-muted-foreground/40 group-hover/path:text-foreground shrink-0 transition-colors" />
                                )}
                              </div>
                            </div>

                            {/* Action Bar */}
                            <div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 flex-1 rounded-xl text-xs font-bold gap-1.5 border-border/60 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all active:scale-95"
                                onClick={() =>
                                  handleDownloadUrl(file.full_path, file.name)
                                }
                                disabled={
                                  isDownloading || downloadingPath !== null
                                }
                              >
                                {isDownloading ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    <span>Opening...</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-3.5 w-3.5" />
                                    <span>Preview CV</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/40 flex items-center justify-center border border-border/40 shadow-inner">
                <Inbox className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No matching files or batches found'
                    : 'Archives Empty'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? "Try adjusting your search query or filter settings to find what you're looking for."
                    : 'Connect your cloud bucket to start managing and indexing your resume archives.'}
                </p>
              </div>
              {(searchQuery || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                  }}
                  className="h-8 rounded-xl text-xs font-bold border-border/60"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CV Preview Modal */}
      <CVDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fileUrl={fileUrl}
        fileName={selectedFileName}
      />
    </div>
  )
}
